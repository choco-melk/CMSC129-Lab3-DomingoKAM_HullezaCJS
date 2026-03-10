import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Modal from "./ui/modal/Modal"

function DeleteAnimeModal({ isVisible = true, onClose, anime, onDeleteSuccess }) {
    // submits deleted anime to server to be removed from db
    async function onSubmit() {
        // calls the api endpoint that deletes an anime from the db
        const response = await fetch(`http://localhost:3000/api/delete-anime/${anime._id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (response.ok && result.success) {
            onClose();
            onDeleteSuccess();
        } else {
            alert('Failed to delete anime: ' + (result.message || response.statusText));
        }
    }

    return (
        (isVisible) && 
        <Modal>
            <FontAwesomeIcon icon={faXmark} className="modal-close-icon" onClick={onClose}/>
            <form onSubmit={onSubmit}>
                <div className="form-element">
                    <label htmlFor="title-input">Are you sure you want to delete {anime.title}?</label>
                </div>
                <div className="form-element">
                    <button type="submit">Delete</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    )   
}

export default DeleteAnimeModal;


