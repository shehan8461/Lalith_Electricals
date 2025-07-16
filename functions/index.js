const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Express app setup
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    res.status(200).json({
      status: "OK",
      database: "Firebase Firestore",
      connection: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "Firebase Firestore",
      connection: "Disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// User verification middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key",
      (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Invalid token.",
          });
        }
        req.user = decoded;
        next();
      });
};

// Error handling utility
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// AUTH ROUTES
app.post("/auth/signup", async (req, res, next) => {
  try {
    const {username, email, password} = req.body;

    // Check if user already exists
    const existingUser = await db.collection("users")
        .where("email", "==", email).get();
    if (!existingUser.empty) {
      return next(createError(400, "User already exists"));
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user
    const userRef = db.collection("users").doc();
    await userRef.set({
      username,
      email,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/signin", async (req, res, next) => {
  try {
    const {email, password} = req.body;

    // Find user
    const userQuery = await db.collection("users")
        .where("email", "==", email).get();

    if (userQuery.empty) {
      return next(createError(404, "User not found"));
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid credentials"));
    }

    // Create JWT
    const token = jwt.sign(
        {id: userDoc.id, email: user.email},
        process.env.JWT_SECRET || "your-secret-key",
        {expiresIn: "1h"},
    );

    // Set cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: userDoc.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/signout", (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// USER ROUTES
app.get("/user/profile", verifyToken, async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.id).get();

    if (!userDoc.exists) {
      return next(createError(404, "User not found"));
    }

    const user = userDoc.data();
    delete user.password; // Don't send password

    res.status(200).json({
      success: true,
      user: {id: userDoc.id, ...user},
    });
  } catch (error) {
    next(error);
  }
});

app.post("/user/update", verifyToken, async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcryptjs.hash(password, 12);

    await db.collection("users").doc(req.user.id).update(updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/user/delete", verifyToken, async (req, res, next) => {
  try {
    await db.collection("users").doc(req.user.id).delete();
    res.clearCookie("access_token");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// ITEM ROUTES
app.get("/user/items", verifyToken, async (req, res, next) => {
  try {
    const itemsQuery = await db.collection("items")
        .where("userId", "==", req.user.id).get();

    const items = itemsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/user/item/create", verifyToken, async (req, res, next) => {
  try {
    const {name, description, price, imageUrls, category} = req.body;

    const itemRef = db.collection("items").doc();
    await itemRef.set({
      name,
      description,
      price: parseFloat(price),
      imageUrls: imageUrls || [],
      category,
      userId: req.user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      itemId: itemRef.id,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/user/item/:id", verifyToken, async (req, res, next) => {
  try {
    const itemDoc = await db.collection("items").doc(req.params.id).get();

    if (!itemDoc.exists) {
      return next(createError(404, "Item not found"));
    }

    const item = itemDoc.data();

    // Check if user owns this item
    if (item.userId !== req.user.id) {
      return next(createError(403, "Access denied"));
    }

    res.status(200).json({
      success: true,
      item: {id: itemDoc.id, ...item},
    });
  } catch (error) {
    next(error);
  }
});

app.post("/user/item/update/:id", verifyToken, async (req, res, next) => {
  try {
    const {name, description, price, imageUrls, category} = req.body;

    // Check if item exists and user owns it
    const itemDoc = await db.collection("items").doc(req.params.id).get();
    if (!itemDoc.exists) {
      return next(createError(404, "Item not found"));
    }

    const item = itemDoc.data();
    if (item.userId !== req.user.id) {
      return next(createError(403, "Access denied"));
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (imageUrls) updateData.imageUrls = imageUrls;
    if (category) updateData.category = category;

    await db.collection("items").doc(req.params.id).update(updateData);

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/user/item/delete/:id", verifyToken, async (req, res, next) => {
  try {
    // Check if item exists and user owns it
    const itemDoc = await db.collection("items").doc(req.params.id).get();
    if (!itemDoc.exists) {
      return next(createError(404, "Item not found"));
    }

    const item = itemDoc.data();
    if (item.userId !== req.user.id) {
      return next(createError(403, "Access denied"));
    }

    await db.collection("items").doc(req.params.id).delete();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// PUBLIC ROUTES (no authentication required)
app.get("/public/items", async (req, res, next) => {
  try {
    const itemsQuery = await db.collection("items").limit(50).get();

    const items = itemsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/public/item/:id", async (req, res, next) => {
  try {
    const itemDoc = await db.collection("items").doc(req.params.id).get();

    if (!itemDoc.exists) {
      return next(createError(404, "Item not found"));
    }

    res.status(200).json({
      success: true,
      item: {id: itemDoc.id, ...itemDoc.data()},
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN ROUTES
app.get("/admin/users", verifyToken, async (req, res, next) => {
  try {
    const usersQuery = await db.collection("users").limit(50).get();

    const users = usersQuery.docs.map((doc) => {
      const user = doc.data();
      delete user.password; // Don't send passwords
      return {id: doc.id, ...user};
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/admin/items", verifyToken, async (req, res, next) => {
  try {
    const itemsQuery = await db.collection("items").limit(50).get();

    const items = itemsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
