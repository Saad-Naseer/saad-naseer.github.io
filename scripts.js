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


function filterVideos() {
    let input = document.getElementById("videoSearch").value.toLowerCase(); // Get user input
    let videos = document.querySelectorAll(".video_item"); // Select all video items
    let bestMatch = null;
    let highestMatchScore = 0;

    videos.forEach(video => {
        let title = video.getAttribute("data-title").toLowerCase(); // Get video title
        let matchScore = getMatchScore(input, title); // Calculate match score

        if (matchScore > highestMatchScore) {
            highestMatchScore = matchScore;
            bestMatch = video;
        }

        // Show or hide videos based on whether the title includes the search term
        video.style.display = title.includes(input) ? "block" : "none";
    });

    // If there is a best match, scroll to it for better UX
    if (bestMatch) {
        bestMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// Function to calculate match score (simple version)
function getMatchScore(input, title) {
    if (title.includes(input)) return input.length; // Higher length = better match
    return 0; // No match
}



