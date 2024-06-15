document.addEventListener("DOMContentLoaded", function() {
    const ul = document.querySelector("nav ul");
    const artists = ["Graduation by Kanye West", "Link 2", "Link 3", "Link 4", "Link 5", "Link 6", "Link 7", "Link 8", "Link 9", "Link 10", "Link 11", "Link 12", "Link 13"];
    const headerTitle = document.querySelector(".header-title");

    function populateList() {
        ul.innerHTML = '';
        artists.forEach((artist) => {
            const li = document.createElement("li");
            li.textContent = artist;
            ul.appendChild(li);
        });
    }

    populateList();

    // Add a delay to remove the cursor after the typing animation
    setTimeout(() => {
        headerTitle.style.borderRight = 'none';
    }, 1450); // Adjust the delay to match the typing animation duration

    let vantaEffect = VANTA.BIRDS({
        el: "#my-background",
        backgroundColor: 0x0d0d0d,
        color1: 0xff4c4c,
        color2: 0x4c4cff,
        colorMode: "variance",
        quantity: 6,
        birdSize: 1.5,
        wingSpan: 30,
        speedLimit: 7.5,
        separation: 20,
        alignment: 20,
        cohesion: 20,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00
    });

});

async function fetchRecentlyPlayedTracks(token) {
    const apiUrl = 'https://api.spotify.com/v1/me/player/recently-played?limit=5';
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.items;
}

function displayRecentlyPlayed(tracks) {
    const container = document.getElementById('recently-listened-content');
    container.innerHTML = '';
    tracks.forEach(item => {
        const track = item.track;
        const trackElement = document.createElement('div');
        trackElement.className = 'track';
        trackElement.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}" />
            <div>
                <h3>${track.name}</h3>
                <p>${track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
        `;
        container.appendChild(trackElement);
    });
}

document.getElementById('recently-listened-tab').addEventListener('click', async () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');
    if (token) {
        const tracks = await fetchRecentlyPlayedTracks(token);
        displayRecentlyPlayed(tracks);
    } else {
        window.location.href = 'https://your-vercel-app.vercel.app/login';
    }
});

const clientId = 'b18acce7865b488782b0a404a6848e98'; // Make sure this is a string
const redirectUri = 'https://mateenpixel.github.io/mateenmusic';
const vercelUrl = 'https://mateenmusic.vercel.app/'; // Your Vercel app URL

// Spotify Implicit Grant Flow
function authenticate() {
    const scopes = 'user-read-recently-played';
    const url = `${vercelUrl}/login`;
    window.location.href = url;
}

async function fetchRecentlyPlayedTracks(token) {
    const apiUrl = 'https://api.spotify.com/v1/me/player/recently-played?limit=5';
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.items;
}

function displayRecentlyPlayed(tracks) {
    const container = document.getElementById('recently-listened-tracks');
    container.innerHTML = '';
    tracks.forEach(item => {
        const track = item.track;
        const trackElement = document.createElement('div');
        trackElement.className = 'track';
        trackElement.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}" />
            <div>
                <h3>${track.name}</h3>
                <p>${track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
            <div class="track-buttons">
                <button onclick="shareTrack('${track.external_urls.spotify}', '${track.name}', '${track.artists.map(artist => artist.name).join(', ')}')">Share</button>
                <a href="${track.external_urls.spotify}" target="_blank">Open in Spotify</a>
            </div>
        `;
        container.appendChild(trackElement);
    });
}

function shareTrack(url, name, artists) {
    if (navigator.share) {
        navigator.share({
            title: `Check out ${name} by ${artists}`,
            url: url
        }).catch(console.error);
    } else {
        alert('Sharing not supported in this browser. Here is the link: ' + url);
    }
}

// Handle modal
const modal = document.getElementById('modal');
const span = document.getElementsByClassName('close')[0];

document.getElementById('recently-listened-tab').addEventListener('click', () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');
    if (token) {
        fetchRecentlyPlayedTracks(token).then(tracks => {
            displayRecentlyPlayed(tracks);
            modal.style.display = 'block';
        });
    } else {
        authenticate();
    }
});

// Ensure other tabs clear the hash and hide the modal
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        if (tab.id !== 'recently-listened-tab') {
            window.location.hash = '';
            modal.style.display = 'none';
        }
    });
});

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}