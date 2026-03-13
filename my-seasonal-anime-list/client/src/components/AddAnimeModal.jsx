import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Modal from "./ui/modal/Modal"

function AddAnimeModal({ isVisible = true, onClose, onAddSuccess, selectedAnime, animeList = [], showToast }) {
    const { register, handleSubmit, reset, setValue } = useForm()
    const [op, setOp] = useState(false);
    const [ed, setEd] = useState(false);

    useEffect(() => {
        if (selectedAnime) {
            setValue('title', selectedAnime.title || '');
            setOp(false);
            setEd(false);
        } else {
            reset();
            setOp(false);
            setEd(false);
        }
    }, [selectedAnime, setValue, reset]);

    async function onSubmit(data) {
        const title = data.title?.trim();
        if (title && animeList.some(a => a.title.toLowerCase() === title.toLowerCase())) {
            if (showToast) showToast(`"${title}" is already in your list`);
            return;
        }

        const anime = {
            "title": title,
            "watched": data.watched || false,
            "currentEp": data.currentEpisode || 1,
            "status": data.status,
            "rating": data.rating || 0,
            "op": op,
            "ed": ed
        };

        const response = await fetch('http://localhost:3000/api/add-anime', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(anime)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            reset();
            onClose();
            onAddSuccess(result.anime);
        } else {
            alert('Failed to add anime: ' + (result.message || response.statusText));
        }
    }

    return (
        (isVisible) && 
        <Modal>
            <FontAwesomeIcon icon={faXmark} className="modal-close-icon" onClick={onClose}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-element">
                    <label htmlFor="title-input">{selectedAnime.title}</label>
                </div>
                <div className="form-element">
                    <label htmlFor="watched-checkbox">Watched</label>
                    <input type="checkbox" id="watched-checkbox" {...register("watched")}/>
                </div>
                <div className="form-element">
                    <label htmlFor="current-episode-input">Current Episode</label>
                    <input type="number" id="current-episode-input" {...register("currentEpisode")} placeholder="Current Episode" min="1" step="1"/>
                </div>
                <div className="form-element">
                    <label htmlFor="status-select">Status</label>
                    <select id="status-select" {...register("status")}>
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>
                <div className="form-element">
                    <label htmlFor="rating-input">Rating</label>
                    <input type="number" id="rating-input" {...register("rating")} min="0" max="10" step="1"/>
                </div>
                <div className="form-element">
                    <label>OP</label>
                    <span className={`heart-icon editable ${op ? 'filled' : ''}`} onClick={() => setOp(!op)}>
                        {op ? '♥' : '♡'}
                    </span>
                </div>
                <div className="form-element">
                    <label>ED</label>
                    <span className={`heart-icon editable ${ed ? 'filled' : ''}`} onClick={() => setEd(!ed)}>
                        {ed ? '♥' : '♡'}
                    </span>
                </div>
                <div className="form-element">
                    <button type="submit">Add Anime</button>
                </div>
            </form>
        </Modal>
    )   
}

export default AddAnimeModal;