import express from "express";
import { syncToBackup, syncFromBackupToPrimary, primaryConn, backupConn} from "../config/database.js";

const router = express.Router();

// Get backup and primary DB status
router.get("/backup-status", async (req, res) => {
    try {
        const primaryState = primaryConn.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
        const backupState = backupConn.readyState;

        const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

        res.json({
            primary: {
                state: states[primaryState],
                host: primaryConn.host || "unknown"
            },
            backup: {
                state: states[backupState],
                host: backupConn.host || "unknown"
            },
            activeConnection: primaryConn.host
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual sync to backup
router.post("/sync-to-backup", async (req, res) => {
    try {
        await syncToBackup();
        res.json({ message: "Synced to backup successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual sync from backup to primary
router.post("/sync-from-backup", async (req, res) => {
    try {
        await syncFromBackupToPrimary();
        res.json({ message: "Synced from backup to primary successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

