import Header from "../components/Header/Header";
import { useState } from "react";
import SearchBar from "../components/SearchBar/Searchbar";

function HomePage() {
    const [searchedAnime, setSearchedAnime] = useState(""); 

    return (
    <main className="home-page">
        <Header/>
        <SearchBar
        searchedAnime={searchedAnime}
        setSearchedAnime={setSearchedAnime}
        />
    </main>
    );
}

export default HomePage;