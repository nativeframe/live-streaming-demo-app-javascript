let pollInterval;

// Starts polling every 5 seconds for viewers watching the broadcast.
// This is called when the broadcast starts.
// The list of viewers returned from the server is then displayed in the viewers div.
function startPollingForViewers(callId) {
  pollInterval = window.setInterval(async () => {
    try {
      const response = await fetch(
        `${window.config.serviceEndpoint}/viewers-watching/?callId=${callId}`
      );
      const data = await response.json();
      updateViewersList(data.viewers);
    } catch (error) {
      console.error("Failed to poll for viewers", error);
    }
  }, 5000);
}

// Stops polling for viewers.
// This is called when the broadcast ends.
function stopPollingForViewers() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = undefined;
  }
}

// Updates the viewers div with the list of viewers.
function updateViewersList(viewers) {
  const viewersDiv = document.getElementById("viewers");
  if (viewersDiv) {
    viewersDiv.innerHTML = viewers.join("<br>");
  }
}

// Clears the viewers div.
function clearViewers() {
  const viewersDiv = document.getElementById("viewers");
  if (viewersDiv) {
    viewersDiv.innerHTML = "";
  }
}
