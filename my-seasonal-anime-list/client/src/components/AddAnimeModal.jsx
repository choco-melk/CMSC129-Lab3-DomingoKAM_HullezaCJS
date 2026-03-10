import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { useForm } from 'react-hook-form'
import Modal from "./ui/modal/Modal"


function AddAnimeModal() {
    const [isVisible, setVisible] = useState(true);
    const { register, handleSubmit, reset } = useForm()

    async function onSubmit(data) {
        const anime = {
            "title": data.title,
            "watched": data.watched || false,
            "currentEp": data.currentEpisode || 0,
            "status": data.status,
            "rating": data.rating || 0,
            "op": data.op || false,
            "ed": data.ed || false
        };

        try {
            const response = await fetch('http://localhost:3000/api/add-anime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(anime)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert('Anime added successfully');
                reset();
                setVisible(false);
            } else {
                alert('Failed to add anime: ' + (result.message || response.statusText));
            }
        } catch (error) {
            console.error('Error adding anime:', error);
            alert('An error occurred while adding anime');
        }
    }
    return (
        (isVisible) &&
        <Modal>
            <FontAwesomeIcon icon={faXmark} onClick={() => setVisible(false)} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-element">
                    <label htmlFor="title-input">Title</label>
                    <input type="text" id="title-input" {...register("title")} placeholder="Anime Title"/>
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
                    <button type="submit">Add Anime</button>
                </div>
            </form>
        </Modal>
    )   
}

export default AddAnimeModal;


