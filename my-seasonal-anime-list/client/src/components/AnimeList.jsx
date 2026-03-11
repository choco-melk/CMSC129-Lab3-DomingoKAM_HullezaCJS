function AnimeList({ animeList, onEdit, onDelete }) {
    return (
        <table className="anime-list-component">
            <thead>
                <tr>
                    <th className="label">Anime Title</th>
                    <th className="label">Watched</th>
                    <th className="label">Current Episode</th>
                    <th className="label">Status</th>
                    <th className="label">Rating</th>
                    <th className="label">OP</th>
                    <th className="label">ED</th>
                    <th className="label">Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    (animeList && animeList.length > 0) ?
                    animeList.map((anime) => (
                        <tr key={anime._id} className="anime-row">
                            <td className="label">{anime.title}</td>
                            <td className="label">{anime.watched ? "Yes" : "No"}</td>
                            <td className="label">{anime.currentEp}</td>
                            <td className="label">{anime.status}</td>
                            <td className="label">{anime.rating}</td>
                            <td className="label">{String(anime.op)}</td>
                            <td className="label">{String(anime.ed)}</td>
                            <td className="label">
                                <button className="btn btn-primary" onClick={() => onEdit(anime)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => onDelete(anime)}>Delete</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '16px', fontStyle: 'italic' }}>No anime in your list yet. Search and add some anime!</td></tr>
                } 
            </tbody>
        </table>
    )    
}

export default AnimeList;