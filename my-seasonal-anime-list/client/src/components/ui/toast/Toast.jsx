import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [message, onClose, duration]);

    if (!message) return null;

    return <div className="toast-container">{message}</div>;
}

export default Toast;
