import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Modal from "./ui/modal/Modal"
import Toast from "./ui/toast/Toast";

import { useState } from 'react';

function DeleteAnimeModal({ isVisible = true, onClose, anime, onDeleteSuccess }) {
    const [toastMessage, setToastMessage] = useState(null);

    function showLocalToast(msg) {
        setToastMessage(msg);
    }

    // submits deleted anime to server to be removed from db
    async function onSubmit(event) {
        event.preventDefault(); // prevent form page reload
        // calls the api endpoint that deletes an anime from the db
        const response = await fetch(`http://localhost:3000/api/delete-anime/${anime._id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (response.ok && result.success) {
            onClose();
            onDeleteSuccess();
            showLocalToast(`Deleted "${anime.title}"`);
        } else {
            alert('Failed to delete anime: ' + (result.message || response.statusText));
        }
    }

    return (
        (isVisible) && 
        <>
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
          {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        </>
    )   
}

export default DeleteAnimeModal;


