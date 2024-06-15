document.addEventListener("DOMContentLoaded", function() {
    const ul = document.querySelector("nav ul");
    const artists = ["Graduation by Kanye West", "Link 2", "Link 3", "Link 4", "Link 5", "Link 6", "Link 7", "Link 8", "Link 9", "Link 10", "Link 11", "Link 12", "Link 13"];
    const headerTitle = document.querySelector(".header-title");
    const recentlyListenedModal = document.getElementById('recently-listened-modal'); // Ensure correct ID
    const aboutMeModal = document.getElementById('about-me-modal');
    const closeButtons = document.getElementsByClassName('close');

    function populateList() {
        ul.innerHTML = '';
        artists.forEach((artist) => {
            const li = document.createElement("li");
            li.textContent = artist;
            ul.appendChild(li);
        });
    }

    populateList();

    setTimeout(() => {
        headerTitle.style.borderRight = 'none';
    }, 1450);

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

    // Close modal buttons functionality
    Array.from(closeButtons).forEach(button => {
        button.onclick = function() {
            recentlyListenedModal.style.display = 'none';
            aboutMeModal.style.display = 'none';
        }
    });

    window.onclick = function(event) {
        if (event.target == recentlyListenedModal) {
            recentlyListenedModal.style.display = 'none';
        }
        if (event.target == aboutMeModal) {
            aboutMeModal.style.display = 'none';
        }
    };
});

async function fetchRecentlyPlayedTracks(token) {
    console.log('Fetching recently played tracks with token:', token);
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
                <a href="${track.external_urls.spotify}" target="_blank">Open in Spotify</a>
            </div>
        `;
        container.appendChild(trackElement);
    });
}

// Ensure vercelUrl is defined before it's used
const clientId = 'b18acce7865b488782b0a404a6848e98';
const vercelUrl = 'https://mateenmusic.vercel.app';

function authenticate() {
    const scopes = 'user-read-recently-played';
    const url = `${vercelUrl}/login`;
    console.log('Redirecting to Spotify for authentication:', url);
    window.location.href = url;
}

document.getElementById('recently-listened-tab').addEventListener('click', () => {
    console.log('Recently listened tab clicked');
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');
    if (token) {
        console.log('Access token found:', token);
        fetchRecentlyPlayedTracks(token).then(tracks => {
            console.log('Tracks fetched:', tracks);
            displayRecentlyPlayed(tracks);
            recentlyListenedModal.style.display = 'block'; // Ensure modal is shown
        }).catch(error => {
            console.error('Error fetching tracks:', error);
        });
    } else {
        console.log('No access token found, initiating authentication');
        authenticate();
    }
});

document.getElementById('about-me-tab').addEventListener('click', () => {
    aboutMeModal.style.display = 'block';
});

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        if (tab.id !== 'recently-listened-tab' && tab.id !== 'about-me-tab') {
            window.location.hash = '';
            recentlyListenedModal.style.display = 'none';
            aboutMeModal.style.display = 'none';
        }
    });
});
