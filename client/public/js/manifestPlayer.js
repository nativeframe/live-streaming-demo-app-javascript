// Variables to store the Player and VideoClient instances.
let playerVideo = null;
let vc = null;

// Click handler for playing/pausing the video.
function handlePlayerPlay() {
  // Ensure the player exists.
  if (playerVideo) {
    // Changing the text of the playbutton to play/pause dependent of state.
    const video = document.getElementById("playerPlayButton");
    let text = video.textContent;
    if (text === "Pause") {
      video.textContent = "Play";
    } else {
      video.textContent = "Pause";
    }
    // Styling.
    video.classList.toggle("highlight");
    // This is where the player is actually set to the play/paused state.
    playerVideo.localVideoPaused = !playerVideo.localVideoPaused;
  }
}

// Click handler for muting/unmuting the video.
function handlePlayerMute() {
  // Ensure the playerVideo exists.
  if (playerVideo) {
    // Changing the text of the mutebutton mute/unmute dependent of state.
    const mute = document.getElementById("playerMuteButton");
    let text = mute.textContent;
    if (text === "Mute") {
      mute.textContent = "Unmute";
    } else {
      mute.textContent = "Mute";
    }
    // Styling.
    mute.classList.toggle("highlight");
    // This is where the player is actually setting the muted/unmuted state.
    playerVideo.localAudioMuted = !playerVideo.localAudioMuted;
  }
}

// Click handler for entering fullScreen mode.
function handlePlayerFullScreen() {
  // Ensure the player exists.
  if (playerVideo) {
    document.getElementById("playerWrapper").requestFullscreen();
  }
}

function addPlayer(player) {
  // Here we are ensuring the Create Video Element feature exists on the current VideoClient.
  if (
    VideoClient.adapter.device.isImplements(
      VideoClient.adapter.Feature.CREATE_VIDEO_ELEMENT
    )
  ) {
    // Check to see if you already have a wrapper containing a player and remove it if so.
    const wrapper = document.getElementById("playerWrapper");
    if (wrapper) {
      wrapper.remove();
    }
    const container = document.getElementById("container");

    // If we don't have a wrapper the buttons haven't been created yet, so lets create them.
    if (!wrapper) {
      // Create and append the play/pause button.
      const playerPlayButton = document.createElement("button");
      playerPlayButton.id = "playerPlayButton";
      playerPlayButton.textContent = "Pause";
      container.appendChild(playerPlayButton);

      // Create and append the mute/unmute button.
      const playerMuteButton = document.createElement("button");
      playerMuteButton.id = "playerMuteButton";
      playerMuteButton.textContent = "Mute";
      container.appendChild(playerMuteButton);

      // Create and append the fullscreen button.
      const playerFullScreenButton = document.createElement("button");
      playerFullScreenButton.id = "playerFullScreenButton";
      playerFullScreenButton.textContent = "FullScreen";
      container.appendChild(playerFullScreenButton);

      // Event listeners to trigger our click handler functions when button elements are clicked.
      document
        .getElementById("playerPlayButton")
        .addEventListener("click", handlePlayerPlay);
      document
        .getElementById("playerMuteButton")
        .addEventListener("click", handlePlayerMute);
      document
        .getElementById("playerFullScreenButton")
        .addEventListener("click", handlePlayerFullScreen);
    }

    // Create the Player Wrapper.
    const playerWrapper = document.createElement("div");
    playerWrapper.id = "playerWrapper";
    container.appendChild(playerWrapper);

    // Create our VideoElement using the Video Client and attach our player to it.
    const videoEl = VideoClient.adapter.device.createVideoElement();
    videoEl.style.objectFit = 'cover'
    videoEl.style.height = "100%";
    videoEl.style.width = "100%";
    player.attachTo(videoEl);

    // Finally we append our player to our playerWrapper.
    document.getElementById("playerWrapper").appendChild(videoEl);
  }
}

// Function to create our VideoClient instance and call to create our player.
function createVideoClient(manifestUrl, VideoClient, endpoint) {
  // If we don't have a player yet we don't have a VideoClient instance and need to create one.
  if (playerVideo === null) {
    vc = new VideoClient.VideoClient({
      backendEndpoints: [endpoint],
    });

    // If we already have a player we need to dispose of the old one so we can replace it with a new one.
    if (playerVideo != null) {
      playerVideo.dispose();
      playerVideo = null;
    }
  }
  try {
    // Here is our actual request to create our player with our manifestUrl provided.
    playerVideo = vc.requestPlayer(manifestUrl);
  } catch (err) {
    throw err;
  }

  // Call our function that handles attaching the player to the page.
  addPlayer(playerVideo);

  return false;
}
