import { db } from '../firebase-config.js';

class Item {
    constructor(itemData) {
        this.id = itemData.id; // Add this line to handle the document ID
        this.petId = itemData.petId;
        this.userId = itemData.userId;
        this.Name = itemData.Name;
        this.date = itemData.date;
        this.Description = itemData.Description;
        this.Title = itemData.Title;
        this.profilePicture = itemData.profilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE=';
        this.alternateProfilePicture = itemData.alternateProfilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE=';
        this.thirdProfilePicture = itemData.thirdProfilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE=';
        this.fourthProfilePicture = itemData.fourthProfilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE=';
        this.productVideo = itemData.productVideo || '';
        this.featured = itemData.featured || false;
        this.onSale = itemData.onSale || false;
        this.createdAt = itemData.createdAt || new Date();
        this.updatedAt = itemData.updatedAt || new Date();
    }

    // Convert to Firestore data
    toFirestore() {
        // Filter out undefined values to prevent Firestore errors
        const data = {};
        
        // Required fields - must be present
        if (this.userId !== undefined && this.userId !== null) {
            data.userId = this.userId;
        }
        if (this.Name !== undefined && this.Name !== null) {
            data.Name = this.Name;
        }
        if (this.Title !== undefined && this.Title !== null) {
            data.Title = this.Title;
        }
        if (this.Description !== undefined && this.Description !== null) {
            data.Description = this.Description;
        }
        
        // Optional fields - only add if they exist
        if (this.petId !== undefined && this.petId !== null) {
            data.petId = this.petId;
        }
        if (this.date !== undefined && this.date !== null) {
            data.date = this.date;
        }
        if (this.profilePicture !== undefined && this.profilePicture !== null) {
            data.profilePicture = this.profilePicture;
        }
        if (this.alternateProfilePicture !== undefined && this.alternateProfilePicture !== null) {
            data.alternateProfilePicture = this.alternateProfilePicture;
        }
        if (this.thirdProfilePicture !== undefined && this.thirdProfilePicture !== null) {
            data.thirdProfilePicture = this.thirdProfilePicture;
        }
        if (this.fourthProfilePicture !== undefined && this.fourthProfilePicture !== null) {
            data.fourthProfilePicture = this.fourthProfilePicture;
        }
        if (this.productVideo !== undefined && this.productVideo !== null) {
            data.productVideo = this.productVideo;
        }
        if (this.featured !== undefined && this.featured !== null) {
            data.featured = this.featured;
        }
        if (this.onSale !== undefined && this.onSale !== null) {
            data.onSale = this.onSale;
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
        return new Item({
            ...data,
            id: doc.id
        });
    }

    // Save item to Firestore
    async save() {
        try {
            this.updatedAt = new Date();
            if (this.id) {
                // Update existing item
                await db.collection('products').doc(this.id).update(this.toFirestore());
                return this;
            } else {
                // Create new item
                const docRef = await db.collection('products').add(this.toFirestore());
                this.id = docRef.id;
                return this;
            }
        } catch (error) {
            throw new Error(`Failed to save item: ${error.message}`);
        }
   }

    // Create new item
    static async create(itemData) {
        try {
            const item = new Item(itemData);
            return await item.save();
        } catch (error) {
            throw new Error(`Failed to create item: ${error.message}`);
        }
    }

    // Find item by ID
    static async findById(id) {
        try {
            const doc = await db.collection('products').doc(id).get();
            if (!doc.exists) {
                return null;
            }
            return Item.fromFirestore(doc);
        } catch (error) {
            throw new Error(`Failed to find item by ID: ${error.message}`);
        }
    }

    // Find item by petId
    static async findByPetId(petId) {
        try {
            const querySnapshot = await db.collection('products').where('petId', '==', petId).get();
            if (querySnapshot.empty) {
                return null;
            }
            return Item.fromFirestore(querySnapshot.docs[0]);
        } catch (error) {
            throw new Error(`Failed to find item by petId: ${error.message}`);
        }
    }

    // Find all items
    static async findAll() {
        try {
            const querySnapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
            return querySnapshot.docs.map(doc => Item.fromFirestore(doc));
        } catch (error) {
            throw new Error(`Failed to find all items: ${error.message}`);
        }
    }

    // Find items by userId
    static async findByUserId(userId) {
        try {
            const querySnapshot = await db.collection('products').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
            return querySnapshot.docs.map(doc => Item.fromFirestore(doc));
        } catch (error) {
            throw new Error(`Failed to find items by userId: ${error.message}`);
        }
    }

    // Find featured items
    static async findFeatured() {
        try {
            const querySnapshot = await db.collection('products').where('featured', '==', true).orderBy('createdAt', 'desc').get();
            return querySnapshot.docs.map(doc => Item.fromFirestore(doc));
        } catch (error) {
            throw new Error(`Failed to find featured items: ${error.message}`);
        }
    }

    // Find items on sale
    static async findOnSale() {
        try {
            const querySnapshot = await db.collection('products').where('onSale', '==', true).orderBy('createdAt', 'desc').get();
            return querySnapshot.docs.map(doc => Item.fromFirestore(doc));
        } catch (error) {
            throw new Error(`Failed to find items on sale: ${error.message}`);
        }
    }

    // Update item
    async update(updateData) {
        try {
            this.updatedAt = new Date();
            const updatedFields = { ...updateData, updatedAt: this.updatedAt };
            await db.collection('products').doc(this.id).update(updatedFields);
            
            // Update local instance
            Object.assign(this, updateData);
            return this;
        } catch (error) {
            throw new Error(`Failed to update item: ${error.message}`);
        }
    }

    // Delete item
    async delete() {
        try {
            await db.collection('products').doc(this.id).delete();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete item: ${error.message}`);
        }
    }

    // Search items by name
    static async searchByName(searchTerm) {
        try {
            const querySnapshot = await db.collection('products').get();
            const items = querySnapshot.docs.map(doc => Item.fromFirestore(doc));
            
            // Filter items that contain the search term (case-insensitive)
            return items.filter(item => 
                item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.Description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            throw new Error(`Failed to search items: ${error.message}`);
        }
    }
}

export default Item;
