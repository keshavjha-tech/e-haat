import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/connection.js';

dotenv.config({ path: './.env' });

async function fixStoreNameIndex() {
    try {
        await connectDB();
        console.log("Connected to database");

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Get all existing indexes
        const indexes = await collection.indexes();
        console.log("\n📋 Current indexes:");
        indexes.forEach(idx => {
            console.log(`  - ${idx.name}:`, JSON.stringify(idx.key), idx.unique ? '(unique)' : '', idx.sparse ? '(sparse)' : '');
        });

        // Count users with null store_name
        const nullCount = await collection.countDocuments({ store_name: null });
        console.log(`\n📊 Users with null store_name: ${nullCount}`);

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
                    background: false  // Create synchronously to ensure it's done
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
            console.log("     - Key:", JSON.stringify(storeNameIndex.key));
        } else {
            console.error("  ❌ Index not found after creation!");
            throw new Error("Index creation failed");
        }

        // Test: Try to insert a document with null store_name
        console.log("\n🧪 Testing index with null values...");
        const testDoc = {
            name: "Test User " + Date.now(),
            email: `test${Date.now()}@test.com`,
            password: "test123456",
            store_name: null
        };
        
        try {
            const testResult = await collection.insertOne(testDoc);
            console.log("  ✅ Test insert successful:", testResult.insertedId);
            // Clean up test document
            await collection.deleteOne({ _id: testResult.insertedId });
            console.log("  ✅ Test document cleaned up");
        } catch (testError) {
            console.error("  ❌ Test insert failed:", testError.message);
            if (testError.code === 11000) {
                console.error("  ⚠️  Index is still not sparse! Multiple null values are being rejected.");
            }
        }

        console.log("\n✅ Index fix completed successfully!");
        console.log("\n💡 Please restart your server for changes to take effect.");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error fixing index:", error);
        process.exit(1);
    }
}

fixStoreNameIndex();
