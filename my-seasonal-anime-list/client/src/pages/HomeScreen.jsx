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

  return (
    <main className="home-screen">
      <Header content="MyAnimeOpinions" />
      <SearchAnime onAnimeClick={handleAnimeSelect}/>
      <AnimeList animeList={animeList} onEdit={handleEdit} onDelete={handleDelete} />
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