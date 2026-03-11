import mongoose from "mongoose";
import dotenv from "dotenv";
import userAnimeSchema from '../models/UserAnimeModel.js';

dotenv.config();

const primaryUri = process.env.MONGODB_URI;
const backupUri = process.env.BACKUP_MONGODB_URI;

let primaryConn;
let backupConn;
let activeConn;

async function connectDB() {
    let primaryConnected = false;
    let backupConnected = false;

    // Try to connect to primary
    try {
        primaryConn = mongoose.createConnection(primaryUri);
        await primaryConn.asPromise();
        console.log(`Connected to Primary: ${primaryConn.host}`);
        primaryConnected = true;
    } catch (error) {
        console.error('Primary connection failed:', error.message);
    }

    // Try to connect to backup
    try {
        backupConn = mongoose.createConnection(backupUri);
        await backupConn.asPromise();
        console.log(`Connected to Backup: ${backupConn.host}`);
        backupConnected = true;
    } catch (error) {
        console.error('Backup connection failed:', error.message);
    }

    if (primaryConnected) {
        activeConn = primaryConn;
        await syncToBackup();

        // Listen for primary disconnection
        primaryConn.on('disconnected', () => {
            console.log('Primary disconnected, switching to backup');
            if (backupConnected) {
                activeConn = backupConn;
            } else {
                console.error('Backup not available, system offline');
            }
        });

        primaryConn.on('reconnected', async () => {
            console.log('Primary reconnected, syncing from backup to primary and switching back');
            if (backupConnected) {
                await syncFromBackupToPrimary();
            }
            activeConn = primaryConn;
        });
    } else if (backupConnected) {
        activeConn = backupConn;
        console.log('Primary failed, using backup as active');
    } else {
        console.error('Both primary and backup failed to connect');
        process.exit(1);
    }
}

async function syncToBackup() {
    try {
        const primaryModel = primaryConn.model('UserAnime', userAnimeSchema);
        const docs = await primaryModel.find({});
        const backupModel = backupConn.model('UserAnime', userAnimeSchema);
        await backupModel.deleteMany({});
        if (docs.length > 0) {
            await backupModel.insertMany(docs);
        }
        console.log(`Synced ${docs.length} documents to backup.`);
    } catch (error) {
        console.error('Sync to backup error:', error.message);
    }
}

async function syncFromBackupToPrimary() {
    try {
        const backupModel = backupConn.model('UserAnime', userAnimeSchema);
        const docs = await backupModel.find({});
        const primaryModel = primaryConn.model('UserAnime', userAnimeSchema);
        await primaryModel.deleteMany({});
        if (docs.length > 0) {
            await primaryModel.insertMany(docs);
        }
        console.log(`Synced ${docs.length} documents from backup to primary.`);
    } catch (error) {
        console.error('Sync from backup error:', error.message);
    }
}

export { connectDB, activeConn, primaryConn, backupConn, syncToBackup, syncFromBackupToPrimary};    

