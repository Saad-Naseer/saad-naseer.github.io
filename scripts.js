function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

// Show "About" section by default on page load
document.addEventListener("DOMContentLoaded", () => {
    showSection('about');
});
