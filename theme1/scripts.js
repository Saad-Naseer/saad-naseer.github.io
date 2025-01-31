function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));

    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
}

// Show "About" section by default
document.addEventListener("DOMContentLoaded", () => showSection('about'));


function filterVideos() {
    var input, filter, containers, title, i;
    input = document.getElementById('videoSearch');
    filter = input.value.toUpperCase();
    containers = document.getElementsByClassName('video-container');

    // Loop through all video containers
    for (i = 0; i < containers.length; i++) {
        title = containers[i].getAttribute('data-title');
        
        // Check if the title matches the search input
        if (title.toUpperCase().indexOf(filter) > -1) {
            containers[i].style.display = "";
        } else {
            containers[i].style.display = "none";
        }
    }
}
