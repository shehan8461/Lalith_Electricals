import Admin from "../models/admin.firebase.js";
import bcryptjs from 'bcryptjs';

export const admin_details = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.json({ success: true, data: admins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const admin_signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if admin already exists
        const existingAdminByEmail = await Admin.findByEmail(email);
        if (existingAdminByEmail) {
            return res.status(400).send({ success: false, message: "Admin with this email already exists" });
        }
        
        const existingAdminByUsername = await Admin.findByUsername(username);
        if (existingAdminByUsername) {
            return res.status(400).send({ success: false, message: "Username already taken" });
        }

        // Hash password
        const hashedPassword = bcryptjs.hashSync(password, 10);
        
        const admin = new Admin({
            username,
            email,
            password: hashedPassword
        });
        
        await admin.save();
        res.send({ success: true, message: "Admin created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

export const updateAdmin = async (req, res) => {
    try {
        const { id, ...rest } = req.body;
        
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send({ success: false, message: "Admin not found" });
        }

        // Hash password if provided
        if (rest.password) {
            rest.password = bcryptjs.hashSync(rest.password, 10);
        }

        const updatedAdmin = await admin.update(rest);
        res.send({ success: true, message: "Updated successfully", data: updatedAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send({ success: false, message: "Admin not found" });
        }

        await admin.delete();
        res.send({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

export const fetchupdateAdmin = async (req, res) => {
    const id = req.params.id;

    try {
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).send({ success: false, message: "Admin not found" });
        }

        res.send({ success: true, message: "Admin fetched successfully", data: admin });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};

export const admin_signin = async (req, res) => {
    console.log('Admin signin attempt');
    const { email, password } = req.body;

    try {
        console.log('Login email:', email);
        const admin = await Admin.findByEmail(email);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        // Compare password with hashed password
        const isPasswordValid = bcryptjs.compareSync(password, admin.password);

        console.log('Input password:', password);
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        // Remove password from response
        const { password: hashedPassword, ...adminData } = admin;
        
        // If password is valid, send success message and admin data
        res.status(200).json({ success: true, message: "Login successful", data: adminData });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
