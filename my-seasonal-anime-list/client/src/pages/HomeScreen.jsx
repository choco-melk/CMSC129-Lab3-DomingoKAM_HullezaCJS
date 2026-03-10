import { useState, useEffect } from 'react'
import AddAnimeModal from "../components/AddAnimeModal";
import EditAnimeModal from "../components/EditAnimeModal";
import DeleteAnimeModal from "../components/DeleteAnimeModal";
import AnimeList from "../components/AnimeList";
import Header from "../components/ui/header/Header";
import SearchAnime from '../components/SearchAnime';
import Toast from '../components/ui/toast/Toast';

function HomeScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAnime, setEditAnime] = useState(null);
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

  function showToast(message) {
    setToastMessage(message);
  }

  function handleAddSuccess(newAnime) {
    fetchAnimeList();
    showToast(`Added "${newAnime.title}"`);
  }

  function handleEditSuccess(updatedAnime) {
    fetchAnimeList();
    showToast(`Updated "${updatedAnime.title}"`);
  }

  function handleDeleteSuccess() {
    console.log('handleDeleteSuccess called');
    fetchAnimeList();
    showToast('Anime deleted successfully');
  }

  const filteredAnimeList = statusFilter === 'All' 
    ? animeList 
    : animeList.filter(anime => anime.status === statusFilter);

  return (
    <main className="home-screen">
      <Header content="MyAnimeOpinions" />
      
      <div className="content-container" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}        <div className="search-section" style={{ flex: '1', minWidth: '300px', maxHeight: '90vh', overflowY: 'auto' }}>
          <SearchAnime onAnimeClick={handleAnimeSelect}/>
        </div>
        
        <div className="list-section" style={{ flex: '2', minWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="filter-container" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <label htmlFor="status-filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Status:</label>
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
      <EditAnimeModal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        anime={editAnime}
        onEditSuccess={handleEditSuccess}
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