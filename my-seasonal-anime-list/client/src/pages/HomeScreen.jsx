import { useState } from 'react'
import AddAnimeModal from "../components/AddAnimeModal";
import AnimeList from "../components/AnimeList";
import Header from "../components/ui/header/Header";

function HomeScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="home-screen">
      <Header content="MyAnimeOpinions" />
      <AnimeList />
      <button className="add-anime-button" onClick={() => setShowModal(true)}>
        Add Anime
      </button>
      <AddAnimeModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </main>
  );
}

export default HomeScreen;