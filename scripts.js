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



let audioContext, recognizerNode, mediaStream, recognizer;
let lastAudioTime = Date.now(); // Time of the last audio sample
const SILENCE_DURATION = 3000; // Duration to consider silence (in milliseconds)
let silenceCheckInterval;

async function init() {
    try {
        console.log('Initializing Vosk model...');
        // Replace 'model.tar.gz' with the correct path to your model file
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const modelUrl = 'https://github.com/Saad-Naseer/MediaAI-web/raw/main/model/model.tar.gz';
        const proxiedModelUrl = corsProxy + modelUrl;

        const model = await Vosk.createModel('model/model.tar.gz');
        console.log('Vosk model loaded successfully.');

        recognizer = new model.KaldiRecognizer();

        recognizer.on("result", (message) => {
            console.log(`Result: ${message.result.text}`);
            document.getElementById('transcription').innerText = `Result: ${message.result.text}`;
        });

        recognizer.on("partialresult", (message) => {
            console.log(`Partial result: ${message.result.partial}`);
            document.getElementById('transcription').innerText = `Partial result: ${message.result.partial}`;
            //if(message.result.partial!="")
                //lastAudioTime = Date.now(); // Update time on partial result
        });

        // Access microphone
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 1,
                sampleRate: 16000
            }
        });
        console.log('Microphone access granted.');

        // Create an AudioContext
        audioContext = new AudioContext();
        console.log('AudioContext created.');

        // Create a ScriptProcessorNode for audio processing
        recognizerNode = audioContext.createScriptProcessor(4096, 1, 1);
        console.log('ScriptProcessorNode created.');

        // Set up an event handler to process audio data
        recognizerNode.onaudioprocess = (event) => {
            try {
                const inputData = event.inputBuffer.getChannelData(0);
                const volume = Math.max(...inputData.map(value => Math.abs(value))); // Calculate volume level

                if (volume > 0.01) { // Adjust threshold as needed
                    lastAudioTime = Date.now(); // Update time on audio activity
                }

                // Pass the audio buffer to Vosk for processing
                recognizer.acceptWaveform(event.inputBuffer);
            } catch (error) {
                console.error('Error processing audio data:', error);
            }
        };

        // Create a MediaStreamSource and connect it to the ScriptProcessorNode
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(recognizerNode);
        recognizerNode.connect(audioContext.destination);

        document.getElementById('status').innerText = 'Status: Listening...';
        document.getElementById('start-btn').classList.add('active');
        console.log('Microphone access and audio processing set up.');

        // Start the silence check loop
        startSilenceCheck();

    } catch (error) {
        console.error('Initialization error:', error);
        document.getElementById('status').innerText = 'Status: Error initializing Vosk or microphone';
    }
}

function startSilenceCheck() {
    silenceCheckInterval = setInterval(() => {
        const now = Date.now();
        const durationSinceLastAudio = now - lastAudioTime;

        if (durationSinceLastAudio > SILENCE_DURATION) {
            // Silence detected
            stopListening();
        }
    }, 1000); // Check every second
}

function stopListening() {
    if (recognizerNode && audioContext && mediaStream) {
        // Stop the ScriptProcessorNode and audio context
        recognizerNode.disconnect();
        audioContext.close();

        // Stop all tracks in the media stream
        mediaStream.getTracks().forEach(track => track.stop());

        // Clear the silence check interval
        clearInterval(silenceCheckInterval);

        // Update the button and status
        document.getElementById('start-btn').classList.remove('active');
        document.getElementById('status').innerText = 'Status: Stopped listening due to silence';
        console.log('Stopped listening due to silence.');
    }
}

window.onload = () => {
    document.getElementById('start-btn').addEventListener('click', () => {
        if (document.getElementById('start-btn').classList.contains('active')) {
            stopListening();
        } else {
            init();
        }
    });
};