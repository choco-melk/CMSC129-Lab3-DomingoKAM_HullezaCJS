import './AnimeList.css'
import { useState } from 'react'

const MOCK_ANIME = [
    { _id: '1', title: 'Sousou no Frieren', watched: true, currentEp: 28, status: 'Completed', rating: 10, op: true, ed: true },
    { _id: '2', title: 'Fullmetal Alchemist: Brotherhood', watched: true, currentEp: 64, status: 'Completed', rating: 10, op: true, ed: false },
    { _id: '3', title: 'Steins;Gate', watched: false, currentEp: 12, status: 'Watching', rating: 9, op: false, ed: true },
    { _id: '4', title: 'Hunter x Hunter', watched: false, currentEp: 50, status: 'Watching', rating: 9, op: true, ed: false },
    { _id: '5', title: 'Vinland Saga', watched: false, currentEp: 1, status: 'Dropped', rating: 7, op: false, ed: false },
]

function AnimeList({ animeList, onEdit, onDelete }) {
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    const displayList = (animeList && animeList.length > 0) ? animeList : MOCK_ANIME;

    function handleEditClick(anime) {
        setEditingId(anime._id);
        setEditValues({
            title: anime.title,
            watched: anime.watched,
            currentEp: anime.currentEp,
            status: anime.status,
            rating: anime.rating,
            op: anime.op,
            ed: anime.ed
        });
    }

    function handleSaveClick() {
        onEdit({ _id: editingId, ...editValues });
        setEditingId(null);
        setEditValues({});
    }

    function handleCancelClick() {
        setEditingId(null);
        setEditValues({});
    }

    function handleChange(field, value) {
        setEditValues(prev => ({ ...prev, [field]: value }));
    }

    return (
        <table className="anime-list-component">
            <thead>
                <tr>
                    <th className="label col-title">Anime Title</th>
                    <th className="label col-watched">Watched</th>
                    <th className="label col-episode">Current Episode</th>
                    <th className="label col-status">Status</th>
                    <th className="label col-rating">Rating</th>
                    <th className="label col-op">OP</th>
                    <th className="label col-ed">ED</th>
                    <th className="label col-actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                    {displayList.map((anime) => {
                        const isEditing = editingId === anime._id;
                        return (
                            <tr key={anime._id} className="anime-row">
                                <td className="label col-title">
                                    {anime.title}
                                </td>
                                <td className="label col-watched">
                                    <input type="checkbox"
                                        checked={isEditing ? editValues.watched : anime.watched}
                                        onChange={isEditing ? e => handleChange('watched', e.target.checked) : undefined}
                                        readOnly={!isEditing}
                                        className={`row-checkbox ${isEditing ? 'editable' : ''}`}
                                    />
                                </td>
                                <td className="label col-episode">
                                    {isEditing
                                        ? <input className="inline-input" type="number" value={editValues.currentEp} min="0" step="1" onChange={e => handleChange('currentEp', e.target.value)} />
                                        : anime.currentEp}
                                </td>
                                <td className="label col-status">
                                    {isEditing
                                        ? <select className="inline-select" value={editValues.status} onChange={e => handleChange('status', e.target.value)}>
                                            <option value="Watching">Watching</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Dropped">Dropped</option>
                                          </select>
                                        : anime.status}
                                </td>
                                <td className="label col-rating">
                                    {isEditing
                                        ? <input className="inline-input" type="number" value={editValues.rating} min="0" max="10" step="0.1" onChange={e => handleChange('rating', e.target.value)} />
                                        : anime.rating}
                                </td>
                                <td className="label col-op">
                                    {isEditing
                                        ? <span className={`heart-icon editable ${editValues.op ? 'filled' : ''}`} onClick={() => handleChange('op', !editValues.op)}>{editValues.op ? '♥' : '♡'}</span>
                                        : <span className={`heart-icon ${anime.op ? 'filled' : ''}`}>{anime.op ? '♥' : '♡'}</span>}
                                </td>
                                <td className="label col-ed">
                                    {isEditing
                                        ? <span className={`heart-icon editable ${editValues.ed ? 'filled' : ''}`} onClick={() => handleChange('ed', !editValues.ed)}>{editValues.ed ? '♥' : '♡'}</span>
                                        : <span className={`heart-icon ${anime.ed ? 'filled' : ''}`}>{anime.ed ? '♥' : '♡'}</span>}
                                </td>
                                <td className="label col-actions">
                                    {isEditing ? (
                                        <>
                                            <button className="btn btn-primary" onClick={handleSaveClick}>Save</button>
                                            <button className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary" onClick={() => handleEditClick(anime)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => onDelete(anime)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}            
            </tbody>
        </table>
    )
}

export default AnimeList;