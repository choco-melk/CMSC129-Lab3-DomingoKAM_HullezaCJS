function SearchBar({searchedAnime, setSearchedAnime}) {
    console.log(searchedAnime);
    return (
    <div className="search-anime-container">
        <input 
        type="text" 
        placeholder="Search Anime (Ex. Boku No Pico)"
        value={searchedAnime}
        onChange={(e) => setSearchedAnime(e.target.value)}
        />
    </div>
    );
}

export default SearchBar;