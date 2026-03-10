import { useEffect, useState, useRef, useCallback } from "react";

const BASE = 'https://api.jikan.moe/v4';

function SearchAnime({ onAnimeClick }) {
    const [searchedAnime, setSearchedAnime] = useState("");
    const [animeList, setAnimeList] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const pageRef = useRef(1);
    const isLoadingRef = useRef(false);

    // infinite scroll 
    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoadingRef.current) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                // determine if we are paginating a search or the top list
                const isSearching = searchedAnime?.trim().length >= 3;
                const nextPage = pageRef.current + 1;
                
                if (isSearching) {
                    fetchData(searchedAnime.trim(), nextPage, true);
                } else {
                    fetchData(null, nextPage, false);
                }
            }
        });

        if (node) observer.current.observe(node);
    }, [hasNextPage, searchedAnime]);

    // fetch data from api based on search query and page number
    const fetchData = useCallback(async (query, page, isSearch) => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;

        const url = isSearch 
            ? `${BASE}/anime?q=${encodeURIComponent(query)}&limit=10&page=${page}`
            : `${BASE}/top/anime?limit=10&page=${page}`;

        try {
            const res = await fetch(url);
            const json = await res.json();
            
            if (json.data) {
                setAnimeList(prev => page === 1 ? json.data : [...prev, ...json.data]);
                setHasNextPage(json.pagination?.has_next_page ?? false);
                pageRef.current = page;
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            isLoadingRef.current = false;
        }
    }, []);

    // fetch initial data on search query change
    useEffect(() => {
        const query = searchedAnime?.trim();
        
        const delayDebounceFn = setTimeout(() => {
            pageRef.current = 1; 

            if (!query || query.length < 3) {
                fetchData(null, 1, false);
            } else {
                fetchData(query, 1, true);
            }
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchedAnime, fetchData]);
    return (
        <div className="search-anime-container">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search for anime..." 
                    value={searchedAnime} 
                    onChange={(e) => setSearchedAnime(e.target.value)}
                />
            </div>
            <div className="search-results-container">
                {animeList.map((anime, index) => {
                    const isLast = index === animeList.length - 1;
                    return (
                        <div
                            key={`${anime.mal_id}-${index}`} 
                            ref={isLast ? lastElementRef : null}
                            style={{ padding: '20px', borderBottom: '1px solid #ccc', cursor: 'pointer' }}
                            onClick={() => onAnimeClick && onAnimeClick(anime)}
                        >
                            <div style={{ backgroundImage: `url(${anime.images.jpg.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '150px', height: '200px'}}></div>
                            <h3>{anime.title}</h3>
                            <p>Score: {anime.score}</p>
                        </div>
                    );
                })}
                
                {isLoadingRef.current && <div className="loader">Loading more anime...</div>}
            </div>
        </div>
    );
}

export default SearchAnime;