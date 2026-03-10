import UserAnimeModel from "../models/UserAnimeModel.js";

async function addUserAnime(req, res) {
    try {
        const { title, watched, currentEp, status, rating, op, ed } = req.body;

        // validate required fields
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

        const newAnime = new UserAnimeModel({
            title: title.trim(),
            watched: Boolean(watched),
            currentEp: Number(currentEp),
            status,
            rating: Number(rating),
            op: Boolean(op),
            ed: Boolean(ed)
        });

        const savedAnime = await newAnime.save();
        console.log("Anime added successfully:", savedAnime);

        res.status(201).json({
            success: true,
            message: "Anime added successfully",
            anime: savedAnime
        });

    } catch (error) {
        console.error("Error adding anime:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error occurred while adding anime"
        });
    }
}

export default addUserAnime;