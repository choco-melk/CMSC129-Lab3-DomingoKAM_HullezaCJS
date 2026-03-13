import { useState, useEffect } from 'react'
import AddAnimeModal from "../components/AddAnimeModal";
import DeleteAnimeModal from "../components/DeleteAnimeModal";
import AnimeList from "../components/AnimeList";
import Header from "../components/ui/header/Header";
import SearchAnime from '../components/SearchAnime';
import Toast from '../components/ui/toast/Toast';
import './HomeScreen.css'

function HomeScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAnime, setDeleteAnime] = useState(null);
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
 
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

  async function handleEdit(updatedAnime) {
    const response = await fetch(`http://localhost:3000/api/update-anime/${updatedAnime._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAnime)
    });
    const result = await response.json();
    if (response.ok && result.success) {
      fetchAnimeList();
      showToast(`Updated "${result.anime.title}"`);
    }
  }

  function handleDelete(anime) {
    setDeleteAnime(anime);
    setShowDeleteModal(true);
  }

  function handleAnimeSelect(anime) {
    setSelectedAnime(anime);
    setShowAddModal(true);
  }

  function showToast(message) {
    setToastMessage(message);
  }

  function handleAddSuccess(newAnime) {
    fetchAnimeList();
    showToast(`Added "${newAnime.title}"`);
  }

  function handleDeleteSuccess() {
    fetchAnimeList();
    showToast('Anime deleted successfully');
  }

  const filteredAnimeList = statusFilter === 'All' 
    ? animeList 
    : animeList.filter(anime => anime.status === statusFilter);

  return (
    <main className="home-screen">
      <Header content="MyAnimeOpinions" />
      
      <div className="content-container">
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}        
        <div className="search-section">
          <SearchAnime onAnimeClick={handleAnimeSelect}/>
        </div>
        
        <div className="list-section">
          <div className="filter-container">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select 
              id="status-filter" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
          
          <AnimeList
            animeList={filteredAnimeList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    
      <AddAnimeModal
        isVisible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedAnime(null);
        }}
        onAddSuccess={handleAddSuccess}
        selectedAnime={selectedAnime}
        animeList={animeList}
        showToast={showToast}
      />
      <DeleteAnimeModal
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        anime={deleteAnime}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </main>
  );
}

export default HomeScreen;