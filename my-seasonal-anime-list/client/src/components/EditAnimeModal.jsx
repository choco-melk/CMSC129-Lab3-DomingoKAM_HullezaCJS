import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from "./ui/modal/Modal"

function EditAnimeModal({ isVisible = true, onClose, anime, onEditSuccess }) {
    const { register, handleSubmit, reset } = useForm();

    // sets the anime to be edited
    useEffect(() => {
        if (anime) {
            reset({
                title: anime.title,
                watched: anime.watched,
                currentEpisode: anime.currentEp,
                status: anime.status,
                rating: anime.rating,
                op: anime.op,
                ed: anime.ed
            });
        }
    }, [anime]);

    // submits editted anime to server to be added in db
    async function onSubmit(data) {
        const updatedAnime = {
            title: data.title,
            watched: data.watched || false,
            currentEp: data.currentEpisode || 0,
            status: data.status,
            rating: data.rating || 0,
            op: data.op || false,
            ed: data.ed || false
        };

        // calls the api endpoint that updates the anime in the db
        const response = await fetch(`http://localhost:3000/api/update-anime/${anime._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAnime)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert('Anime updated successfully');
            reset();
            onClose();
            onEditSuccess();
        } else {
            alert('Failed to update anime: ' + (result.message || response.statusText));
        }
    }

    function onCloseButtonClick() {
        reset();
        onClose();
    }

    return (
        (isVisible) &&
        <Modal>
            <FontAwesomeIcon icon={faXmark} className="modal-close-icon" onClick={onCloseButtonClick}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-element">
                    <label htmlFor="title-input">Title: {anime.title}</label>
                </div>
                <div className="form-element">
                    <label htmlFor="watched-checkbox">Watched</label>
                    <input type="checkbox" id="watched-checkbox" {...register("watched")}/>
                </div>
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
                    <button type="submit">Update Anime</button>
                </div>
            </form>
        </Modal>
    )
}

export default EditAnimeModal;