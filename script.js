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
