import './Modal.css'

function Modal({ children }) {
    return (
        <div className="modal-component">
            <div className="modal-body">
                {children}
            </div>
        </div>
    );
}

export default Modal;