import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Modal from "./ui/modal/Modal"

function AddAnimeModal({ isVisible = true, onClose, onAddSuccess, selectedAnime }) {
    const { register, handleSubmit, reset, setValue } = useForm()

    useEffect(() => {
        if (selectedAnime) {
            setValue('title', selectedAnime.title || '');
        } else {
            reset();
        }
    }, [selectedAnime, setValue, reset]);

    // submits added anime to server to be added in db
    async function onSubmit(data) {
        const anime = {
            "title": data.title,
            "watched": data.watched || false,
            "currentEp": data.currentEpisode || 1,
            "status": data.status,
            "rating": data.rating || 0,
            "op": data.op || false,
            "ed": data.ed || false
        };

        // calls the api endpoint that adds an anime to the db
        const response = await fetch('http://localhost:3000/api/add-anime', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(anime)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            reset();
            onClose();
            onAddSuccess();
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
                    <label htmlFor="title-input">Title: {selectedAnime.title}</label>
                </div>
                <div className="form-element">
                    <label htmlFor="watched-checkbox">Watched</label>
                    <input type="checkbox" id="watched-checkbox" {...register("watched")}/>
                </div><div className=""></div>
                <div className="form-element">
                    <label htmlFor="current-episode-input">Current Episode</label>
                    <input type="text" id="current-episode-input" {...register("currentEpisode")} placeholder="Current Episode"/>
                </div>
                <div className="form-element">
                    <label htmlFor="status-select">Status: </label>
                    <select id="status-select" {...register("status")}>
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>
                <div className="form-element">
                    <label htmlFor="rating-input">Rating: </label>
                    <input type="number" id="rating-input" {...register("rating")} min="0" max="10" step="0.1"/>
                </div>
                <div className="form-element">
                    <label htmlFor="op-checkbox">OP</label>
                    <input type="checkbox" id="op-checkbox" {...register("op")}/>
                </div>
                <div className="form-element">
                    <label htmlFor="ed-checkbox">ED</label>
                    <input type="checkbox" id="ed-checkbox" {...register("ed")}/>
                </div>
                <div className="form-element">
                    <button type="submit">Add Anime</button>
                </div>
            </form>
        </Modal>
    )   
}

export default AddAnimeModal;


