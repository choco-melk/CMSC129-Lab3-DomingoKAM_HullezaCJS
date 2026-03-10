import { useState, useEffect } from 'react'
import AddAnimeModal from "../components/AddAnimeModal";
import EditAnimeModal from "../components/EditAnimeModal";
import DeleteAnimeModal from "../components/DeleteAnimeModal";
import AnimeList from "../components/AnimeList";
import Header from "../components/ui/header/Header";
import SearchAnime from '../components/SearchAnime';

function HomeScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAnime, setEditAnime] = useState(null);
  const [deleteAnime, setDeleteAnime] = useState(null);
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
 
  useEffect(() => {
    fetchAnimeList();
  }, []);

  async function fetchAnimeList() {
    try {
      const response = await fetch("http://localhost:3000/api/anime-list");
      const data = await response.json();
      setAnimeList(data.animes);
    } catch (error) {
      console.error("Error fetching anime list:", error);
    }
  }

  function handleEdit(anime) {
    setEditAnime(anime);
    setShowEditModal(true);
  }

  function handleDelete(anime) {
    setDeleteAnime(anime);
    setShowDeleteModal(true);
  }

  function handleAnimeSelect(anime) {
    setSelectedAnime(anime);
    setShowAddModal(true);
  }

  const filteredAnimeList = statusFilter === 'All' 
    ? animeList 
    : animeList.filter(anime => anime.status === statusFilter);

  return (
    <main className="home-screen">
      <Header content="MyAnimeOpinions" />
      <SearchAnime onAnimeClick={handleAnimeSelect}/>
      
      <div className="filter-container" style={{ margin: '20px 0', padding: '10px' }}>
        <label htmlFor="status-filter" style={{ marginRight: '10px' }}>Filter by Status:</label>
        <select 
          id="status-filter" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="All">All</option>
          <option value="Watching">Watching</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
        </select>
      </div>
      
      <AnimeList animeList={filteredAnimeList} onEdit={handleEdit} onDelete={handleDelete} />
      <AddAnimeModal
        isVisible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedAnime(null);
        }}
        onAddSuccess={fetchAnimeList}
        selectedAnime={selectedAnime}
      />
      <EditAnimeModal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        anime={editAnime}
        onEditSuccess={fetchAnimeList}
      />
      <DeleteAnimeModal
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        anime={deleteAnime}
        onDeleteSuccess={fetchAnimeList}
      />
    </main>
  );
}

export default HomeScreen;