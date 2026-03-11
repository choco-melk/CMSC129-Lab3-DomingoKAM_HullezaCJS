import './AnimeList.css'

function AnimeList({ animeList, onEdit, onDelete }) {
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
                {
                    (animeList && animeList.length > 0) ?
                    animeList.map((anime) => (
                        <tr key={anime._id} className="anime-row">
                            <td className="label col-title">{anime.title}</td>
                            <td className="label col-watched"><input type="checkbox" checked={anime.watched} readOnly /></td>
                            <td className="label col-episode">{anime.currentEp}</td>
                            <td className="label col-status">{anime.status}</td>
                            <td className="label col-rating">{anime.rating}</td>
                            <td className="label col-op"><input type="checkbox" checked={anime.op} readOnly /></td>
                            <td className="label col-ed"><input type="checkbox" checked={anime.ed} readOnly /></td>
                            <td className="label col-actions">
                                <button className="btn btn-primary" onClick={() => onEdit(anime)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => onDelete(anime)}>Delete</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="8" className="empty-state">No anime in your list yet. Search and add some anime!</td></tr>
                } 
            </tbody>
        </table>
    )    
}

export default AnimeList;