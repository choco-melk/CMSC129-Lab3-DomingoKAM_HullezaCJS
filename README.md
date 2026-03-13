# About `my-seasonal-anime-list`

# Creator

- Keith Ashly Domingo (TheAshly/FakeThird)
- Christian Jave Hulleza (choco-melk)

# Description

**`my-seasonal-anime-list`** is a incremental pair project made for CMSC 129: Software Engineering 2 laboratory, it is a seasonal anime list maker similar to MAL for you to share your opinion on anime to your friends. The project is using [Jikan API](https://jikan.moe/) through their public API for getting anime datas.
```
https://api.jikan.moe/v4
```

# Features

**`my-seasonal-anime-list`** has certain functionalities:
- Keep track of the Animes you're currently watching.
- Rate the shows currently in your list.
- Check the boxes if you either like the opening or ending.
- Update the status if you're still watching, finished, or dropped it.

# Installation and Usage
Start at the my-seasonal-anime-list.
1. Clone the repository, by opening a terminal and typing in:
```
git clone https://github.com/FakeThird/CMSC129-Lab1-DomingoKAM_HullezaCJS.git
```
2. Locate the repository and do the following steps:
    - To open the server-side code. Have another terminal. Go to server and type "node server.js"
    - To open the client-side code. Go to client and type "npm run dev" in a terminal.
3. Open the link to the local hosting and enjoy the website.

# API endpoints
```
Fetching Data from Server:  method=GET route=/api/anime-list
Adding Data to DB:  method=POST route=/api/add-anime
Update Data of an anime in DB: method=PUT route=/api/update-anime/:id
Delete Data of an Anime in DB: method=DELETE route=/api/delete-anime/:id
```

# License and Credits

This project was created as a pair incremental project for CMSC 129 - Software Engineering 2.

- Credits to MyAnimeList (MAL) for the design and the project is only meant to reference it.
- Code is free for **educational purposes** (learning, teaching, academic research)
- Code is free for **personal, non-commercial use**

**Copyright © 2026 Keith Ashly Domingo and Christian Jave Hulleza**
