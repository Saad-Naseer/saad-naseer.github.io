function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    // Show the selected page
    document.getElementById(pageId).style.display = "block";
}

// Show the first page by default when the page loads
document.addEventListener("DOMContentLoaded", () => {
    showPage("about"); // Default page
});
