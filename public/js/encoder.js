async function encoder(vc, VideoClient) {
  // Create your videoClient instance.
  // Initialize and create your mediaController (Note: The media controller should only be initialized once).
  // For mobile browsers mediaController.init(); needs to be called on user action like on click.
  await VideoClient.mediaController.init();
  let mediaStreamController =
    await VideoClient.mediaController.requestController();

  // Set the defaults for your mediaStreamController.
  // Note only call methods/set properties for your video using the mediaStreamController.
  // Calling methods/setting properties on the HTMLVideoElement itself will cause issues with the video.
  mediaStreamController.audioMuted = false;
  mediaStreamController.videoPaused = false;
  mediaStreamController.audioDeviceId = null;
  mediaStreamController.videoDeviceId =
    VideoClient.mediaController.videoDevices()[0].deviceId;

  // Request your preview player from the VideoClient.
  const preview = vc.requestPlayer(mediaStreamController);

  let video;
  // Use the isImplements method on the adapter device to ensure the CREATE_VIDEO_ELEMENT is enabled.
  if (
    VideoClient.adapter.device.isImplements(
      VideoClient.adapter.Feature.CREATE_VIDEO_ELEMENT
    )
  ) {
    // Create the video element using videoClient.
    video = VideoClient.adapter.device.createVideoElement();
    // Set a width for the video (this can be done separately if needed).
    video.style.objectFit = 'cover'
    // video.style.height = "100%";
    video.style.width = "40%";
    // Set the local previews audio to mute so you don't hear yourself.
    preview.localAudioMuted = true;
    // Attach the video to the videoElement.
    preview.attachTo(video);
  }

  // Append your newly created video-element with the preview player attached to your document body.
  document.getElementById("videoWrapper").appendChild(video);

  // Click handler for hiding/showing the video.
  function handleVideo() {
    const video = document.getElementById("video-button");
    let text = video.textContent;
    if (text === "Stop Video") {
      video.textContent = "Start Video";
    } else {
      video.textContent = "Stop Video";
    }
    // Styling.
    video.classList.toggle("highlight");
    // Here is where we actually pause/unpause the video.
    mediaStreamController.videoPaused = !mediaStreamController.videoPaused;
  }
  // Click handler for muting/unmuting the video.
  function handleMute() {
    const mute = document.getElementById("mute-button");
    let text = mute.textContent;
    if (text === "Mute") {
      mute.textContent = "Unmute";
    } else {
      mute.textContent = "Mute";
    }
    // Styling.
    mute.classList.toggle("highlight");
    // Here is where we actually mute/unmute the encoder.
    mediaStreamController.audioMuted = !mediaStreamController.audioMuted;
  }
  // Click handler for entering fullScreen mode.
  function handleFullScreen() {
    document.getElementById("videoWrapper").requestFullscreen();
  }
  // Keeps track of if your are broadcasting/not broadcasting.
  let broadcasting = false;
  // Click handler for creating the call and broadcasting/ending the broadcast/closing the call.
  async function handleBroadcast() {
    const broadcast = document.getElementById("broadcast-button");
    broadcast.classList.toggle("highlight");
    let text = broadcast.textContent;
    if (text === "Start Broadcast") {
      broadcast.textContent = "End Broadcast";
    } else {
      broadcast.textContent = "Start Broadcast";
    }
    // Options to be passed to the broadcast.
    let broadcastOptions = { streamName: window.config.streamId };
    // Create the call.
    let call = await vc.createCall({ userId: window.config.user });
    // If you are not broadcasting and the call exists.
    if (!broadcasting && call != null) {
      // Create the broadcast and pass the mediaStreamController and broadcastOptions as arguments (It is recommended to always use a return value for this method).
      const broadcast = call.broadcast(mediaStreamController, broadcastOptions);
      // Set broadcasting to true.
      broadcasting = true;
      // Starts polling for viewers watching the broadcast.
      // The list of viewers returned from the server is then displayed in the viewers div.
      // startPollingForViewers(call.id);
    }
    // If you are broadcasting and want to end the broadcast.
    else {
      // Dispose of the call (Note: this will also dispose of the call broadcast).
      call.dispose();
      // Set broadcasting to false.
      broadcasting = false;

      stopPollingForViewers(call.id);
      clearViewers();
    }
  }

  // Adding event listeners for each button to user our handler methods above.
  document
    .getElementById("video-button")
    .addEventListener("click", handleVideo, false);
  document
    .getElementById("mute-button")
    .addEventListener("click", handleMute, false);
  document
    .getElementById("full-screen-button")
    .addEventListener("click", handleFullScreen, false);
  document
    .getElementById("broadcast-button")
    .addEventListener("click", handleBroadcast, false);
}
