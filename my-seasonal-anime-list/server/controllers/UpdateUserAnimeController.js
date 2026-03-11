import userAnimeSchema from "../models/UserAnimeModel.js";
import { activeConn, syncToBackup } from "../config/database.js";

async function updateUserAnime(req, res) {
    try {
        const UserAnimeModel = activeConn.model('UserAnime', userAnimeSchema);
        const { id } = req.params;
        const { title, watched, currentEp, status, rating, op, ed } = req.body;

        // Validate required fields
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ success: false, message: "Title is required and must be a non-empty string" });
        }
        if (!status || !['Watching', 'Completed', 'Dropped'].includes(status)) {
            return res.status(400).json({ success: false, message: "Status is required and must be one of: Watching, Completed, Dropped" });
        }
        if (watched !== true && watched !== false) {
            return res.status(400).json({ success: false, message: "Watched must be a boolean" });
        }
        if (op !== true && op !== false) {
            return res.status(400).json({ success: false, message: "OP must be a boolean" });
        }
        if (ed !== true && ed !== false) {
            return res.status(400).json({ success: false, message: "ED must be a boolean" });
        }
        if (isNaN(Number(currentEp)) || Number(currentEp) < 0) {
            return res.status(400).json({ success: false, message: "Current episode must be a non-negative number" });
        }
        if (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 10) {
            return res.status(400).json({ success: false, message: "Rating must be a number between 0 and 10" });
        }

        const updatedAnime = await UserAnimeModel.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                watched: Boolean(watched),
                currentEp: Number(currentEp),
                status,
                rating: Number(rating),
                op: Boolean(op),
                ed: Boolean(ed)
            },
            { new: true }
        );

        if (!updatedAnime) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

        console.log("Anime updated successfully:", updatedAnime);

        // Sync to backup after successful update
        syncToBackup().catch(error => console.error('Sync to backup failed:', error));

        res.status(200).json({
            success: true,
            message: "Anime updated successfully",
            anime: updatedAnime
        });

    } catch (error) {
        console.error("Error updating anime:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error occurred while updating anime"
        });
    }
}

export default updateUserAnime;