import { db } from '../firebase-config.js';

class Admin {
    constructor(adminData) {
        this.id = adminData.id; // Add this line to handle the document ID
        this.username = adminData.username;
        this.email = adminData.email;
        this.password = adminData.password;
        this.createdAt = adminData.createdAt || new Date();
        this.updatedAt = adminData.updatedAt || new Date();
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
        return new Admin({
            ...data,
            id: doc.id
        });
    }

    // Save admin to Firestore
    async save() {
        try {
            this.updatedAt = new Date();
            if (this.id) {
                // Update existing admin
                await db.collection('admins').doc(this.id).update(this.toFirestore());
                return this;
            } else {
                // Create new admin
                const docRef = await db.collection('admins').add(this.toFirestore());
                this.id = docRef.id;
                return this;
            }
        } catch (error) {
            throw new Error(`Failed to save admin: ${error.message}`);
        }
    }

    // Find admin by ID
    static async findById(id) {
        try {
            const doc = await db.collection('admins').doc(id).get();
            if (!doc.exists) {
                return null;
            }
            return Admin.fromFirestore(doc);
        } catch (error) {
            throw new Error(`Failed to find admin by ID: ${error.message}`);
        }
    }

    // Find admin by email
    static async findByEmail(email) {
        try {
            const querySnapshot = await db.collection('admins').where('email', '==', email).get();
            if (querySnapshot.empty) {
                return null;
            }
            return Admin.fromFirestore(querySnapshot.docs[0]);
        } catch (error) {
            throw new Error(`Failed to find admin by email: ${error.message}`);
        }
    }

    // Find admin by username
    static async findByUsername(username) {
        try {
            const querySnapshot = await db.collection('admins').where('username', '==', username).get();
            if (querySnapshot.empty) {
                return null;
            }
            return Admin.fromFirestore(querySnapshot.docs[0]);
        } catch (error) {
            throw new Error(`Failed to find admin by username: ${error.message}`);
        }
    }

    // Find all admins
    static async findAll() {
        try {
            const querySnapshot = await db.collection('admins').orderBy('createdAt', 'desc').get();
            return querySnapshot.docs.map(doc => Admin.fromFirestore(doc));
        } catch (error) {
            throw new Error(`Failed to find all admins: ${error.message}`);
        }
    }

    // Update admin
    async update(updateData) {
        try {
            this.updatedAt = new Date();
            const updatedFields = { ...updateData, updatedAt: this.updatedAt };
            await db.collection('admins').doc(this.id).update(updatedFields);
            
            // Update local instance
            Object.assign(this, updateData);
            return this;
        } catch (error) {
            throw new Error(`Failed to update admin: ${error.message}`);
        }
    }

    // Delete admin
    async delete() {
        try {
            await db.collection('admins').doc(this.id).delete();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete admin: ${error.message}`);
        }
    }
}

export default Admin;
