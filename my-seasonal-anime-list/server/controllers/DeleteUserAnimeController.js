import userAnimeSchema from "../models/UserAnimeModel.js";
import { activeConn, syncToBackup } from "../config/database.js";

async function deleteUserAnime(req, res) {
    try {
        const UserAnimeModel = activeConn.model('UserAnime', userAnimeSchema);
        const { id } = req.params;

        const deletedAnime = await UserAnimeModel.findByIdAndDelete(id);

        if (!deletedAnime) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

        console.log("Anime deleted successfully:", deletedAnime);

        // Sync to backup after successful delete
        syncToBackup().catch(error => console.error('Sync to backup failed:', error));

        res.status(200).json({
            success: true,
            message: "Anime deleted successfully",
            anime: deletedAnime
        });

    } catch (error) {
        console.error("Error deleting anime:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error occurred while deleting anime"
        });
    }
}

export default deleteUserAnime;