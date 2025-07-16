import { db } from '../firebase-config.js';

class User {
    constructor(userData) {
        this.id = userData.id; // Add this line to handle the document ID
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.profilePicture = userData.profilePicture || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg';
        this.createdAt = userData.createdAt || new Date();
        this.updatedAt = userData.updatedAt || new Date();
    }

    // Convert to Firestore data
    toFirestore() {
        // Filter out undefined values to prevent Firestore errors
        const data = {};
        
        // Required fields - must be present
        if (this.username !== undefined && this.username !== null) {
            data.username = this.username;
        }
        if (this.email !== undefined && this.email !== null) {
            data.email = this.email;
        }
        if (this.password !== undefined && this.password !== null) {
            data.password = this.password;
        }
        
        // Optional fields - only add if they exist
        if (this.profilePicture !== undefined && this.profilePicture !== null) {
            data.profilePicture = this.profilePicture;
        }
        if (this.createdAt !== undefined && this.createdAt !== null) {
            data.createdAt = this.createdAt;
        }
        if (this.updatedAt !== undefined && this.updatedAt !== null) {
            data.updatedAt = this.updatedAt;
        }
        
        return data;
    }

    // Create from Firestore data
    static fromFirestore(doc) {
        const data = doc.data();
        return new User({
            ...data,
            id: doc.id
        });
    }

    // Save user to Firestore
    async save() {
        try {
            this.updatedAt = new Date();
            if (this.id) {
                // Update existing user
                await db.collection('users').doc(this.id).update(this.toFirestore());
                return this;
            } else {
                // Create new user
                const docRef = await db.collection('users').add(this.toFirestore());
                this.id = docRef.id;
                return this;
            }
        } catch (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const doc = await db.collection('users').doc(id).get();
            if (!doc.exists) {
                return null;
            }
            return User.fromFirestore(doc);
        } catch (error) {
            throw new Error(`Failed to find user by ID: ${error.message}`);
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const querySnapshot = await db.collection('users').where('email', '==', email).get();
            if (querySnapshot.empty) {
                return null;
            }
            return User.fromFirestore(querySnapshot.docs[0]);
        } catch (error) {
            throw new Error(`Failed to find user by email: ${error.message}`);
        }
    }

    // Find user by username
    static async findByUsername(username) {
        try {
            const querySnapshot = await db.collection('users').where('username', '==', username).get();
            if (querySnapshot.empty) {
                return null;
            }
            return User.fromFirestore(querySnapshot.docs[0]);
        } catch (error) {
            throw new Error(`Failed to find user by username: ${error.message}`);
        }
    }

    // Update user
    async update(updateData) {
        try {
            this.updatedAt = new Date();
            const updatedFields = { ...updateData, updatedAt: this.updatedAt };
            await db.collection('users').doc(this.id).update(updatedFields);
            
            // Update local instance
            Object.assign(this, updateData);
            return this;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    // Delete user
    async delete() {
        try {
            await db.collection('users').doc(this.id).delete();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
}

export default User;
