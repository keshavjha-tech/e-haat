import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/connection.js';

dotenv.config({ path: './.env' });

async function fixStoreNameIndexFinal() {
    try {
        await connectDB();
        console.log("Connected to database");

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Update all existing users with null store_name to remove the field entirely
        console.log("\n🔄 Updating existing users with null store_name...");
        const updateResult = await collection.updateMany(
            { store_name: null },
            { $unset: { store_name: "" } }
        );
        console.log(`  ✅ Updated ${updateResult.modifiedCount} documents (removed store_name field)`);

        // Get all existing indexes
        const indexes = await collection.indexes();
        console.log("\n📋 Current indexes:");
        indexes.forEach(idx => {
            if (idx.key && idx.key.store_name !== undefined) {
                console.log(`  - ${idx.name}:`, JSON.stringify(idx.key), idx.unique ? '(unique)' : '', idx.sparse ? '(sparse)' : '');
            }
        });

        // Drop ALL indexes that include store_name
        console.log("\n🗑️  Dropping existing store_name indexes...");
        for (const index of indexes) {
            if (index.key && index.key.store_name !== undefined) {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`  ✅ Dropped: ${index.name}`);
                } catch (err) {
                    if (err.code === 27 || err.codeName === 'IndexNotFound') {
                        console.log(`  ℹ️  Index ${index.name} doesn't exist`);
                    } else {
                        console.log(`  ⚠️  Error dropping ${index.name}:`, err.message);
                    }
                }
            }
        }

        // Wait for index operations to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create sparse unique index
        console.log("\n🔨 Creating sparse unique index...");
        try {
            await collection.createIndex(
                { store_name: 1 },
                { 
                    unique: true, 
                    sparse: true,
                    name: 'store_name_1',
                    background: false
                }
            );
            console.log("  ✅ Created sparse unique index on store_name");
        } catch (error) {
            console.error("  ❌ Error creating index:", error.message);
            throw error;
        }

        // Verify the index
        console.log("\n✅ Verifying index...");
        const newIndexes = await collection.indexes();
        const storeNameIndex = newIndexes.find(idx => idx.name === 'store_name_1');
        
        if (storeNameIndex) {
            console.log("  ✅ Index verified:");
            console.log("     - Name:", storeNameIndex.name);
            console.log("     - Unique:", storeNameIndex.unique);
            console.log("     - Sparse:", storeNameIndex.sparse);
        }

        console.log("\n✅ Fix completed successfully!");
        console.log("\n💡 All existing null store_name values have been removed.");
        console.log("💡 New users will not have store_name field until they become sellers.");
        console.log("💡 Please restart your server for changes to take effect.");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error:", error);
        process.exit(1);
    }
}

fixStoreNameIndexFinal();

