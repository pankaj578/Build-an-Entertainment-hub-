let trailerUrl = ""; // trailer URL for banner show

// Example trailer URLs - add more show name to URL mappings here
const trailerMap = {
  "Batman": "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&controls=1",
  "Star": "https://www.youtube.com/embed/VIDEO_ID_STAR?autoplay=1&controls=1",
  "Games": "https://www.youtube.com/embed/VIDEO_ID_GAME?autoplay=1&controls=1",
  // Add more shows here...
};

function init() {
  fetchShows("batman");
  fetchShows("star");
  fetchShows("games");
  loadTVShows();

  setupTrailerHandlers();
}

function fetchShows(query) {
  fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(results => {
      if (!results.length) {
        showError(`No shows found for "${query}"`);
        return;
      }
      const shows = results.map(r => r.show);
      if (query === "batman") {
        setBanner(shows[0]);
      }
      displayShows(shows, `Results for "${query}"`);
    })
    .catch(err => {
      console.error("Failed to fetch shows:", err);
      showError(`Failed to load shows for "${query}"`);
    });
}

function setBanner(show) {
  const bannerSection = document.getElementById("banner-section");
  bannerSection.style.backgroundImage = `url(${show.image?.original || 'https://via.placeholder.com/1280x720?text=No+Image'})`;
  document.getElementById("banner-title").textContent = show.name;
  document.getElementById("banner-description").textContent = show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : "No description available.";

  trailerUrl = trailerMap[show.name] || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1";
}

function setupTrailerHandlers() {
  const trailerOverlay = document.getElementById("trailer-overlay");
  const trailerVideo = document.getElementById("trailer-video");
  const closeBtn = document.getElementById("close-trailer");

  closeBtn.addEventListener("click", () => {
    trailerVideo.src = "";
    trailerOverlay.style.display = "none";
  });

  trailerOverlay.addEventListener("click", (e) => {
    if (e.target === trailerOverlay) {
      trailerVideo.src = "";
      trailerOverlay.style.display = "none";
    }
  });
}

function openTrailer(url) {
  const trailerOverlay = document.getElementById("trailer-overlay");
  const trailerVideo = document.getElementById("trailer-video");
  trailerVideo.src = url;
  trailerOverlay.style.display = "flex";
}

function displayShows(shows, title) {
  const container = document.getElementById("movies-cont");

  const section = document.createElement("section");
  section.className = "movies-section";

  const header = document.createElement("h2");
  header.className = "movie-section-heading";
  header.textContent = title;
  section.appendChild(header);

  const row = document.createElement("div");
  row.className = "movies-row";

  shows.forEach(show => {
    const imageUrl = show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";
    const div = document.createElement("div");
    div.className = "movie-item";
    div.innerHTML = `
      <img class="move-item-img" src="${imageUrl}" alt="${show.name}" />
      <button class="play-trailer-btn">▶ Play Trailer</button>
    `;

    // Play trailer button listener
    div.querySelector(".play-trailer-btn").addEventListener("click", () => {
      const url = trailerMap[show.name] || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
      openTrailer(url);
    });

    row.appendChild(div);
  });

  section.appendChild(row);
  container.appendChild(section);
}

function loadTVShows() {
  fetch("https://api.tvmaze.com/shows")
    .then(res => res.json())
    .then(shows => {
      displayTVShows(shows.slice(0, 30)); // first 30 shows
    })
    .catch(err => {
      console.error("Failed to load TV Shows:", err);
      const container = document.getElementById("tvshows-cont");
      container.innerHTML = `<h2 style="color:white; padding: 1rem;">Failed to load TV Shows.</h2>`;
    });
}

function displayTVShows(shows) {
  const container = document.getElementById("tvshows-cont");
  container.innerHTML = ''; // clear existing content

  const section = document.createElement("section");
  section.className = "movies-section";

  const header = document.createElement("h2");
  header.className = "movie-section-heading";
  header.textContent = "TV Shows";
  section.appendChild(header);

  const row = document.createElement("div");
  row.className = "movies-row";

  shows.forEach(show => {
    const imageUrl = show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";
    const div = document.createElement("div");
    div.className = "movie-item";
    div.innerHTML = `
      <img class="move-item-img" src="${imageUrl}" alt="${show.name}" />
      <p style="color:white; text-align:center;">${show.name}</p>
      <button class="play-trailer-btn">▶ Play Trailer</button>
    `;

    div.querySelector(".play-trailer-btn").addEventListener("click", () => {
      const url = trailerMap[show.name] || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
      openTrailer(url);
    });

    row.appendChild(div);
  });

  section.appendChild(row);
  container.appendChild(section);
}

function showError(message) {
  const container = document.getElementById("movies-cont");
  const errorMsg = document.createElement("h2");
  errorMsg.style.color = "white";
  errorMsg.style.padding = "1rem";
  errorMsg.textContent = message;
  container.appendChild(errorMsg);
}

window.addEventListener("load", init);