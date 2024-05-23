const axios = require("axios");

// An in-memory structure to track which broadcasts viewers are watching
const viewersByCallId = {};

// Function that creates our private key for our broadcaster.
const getPrivateKey = async (req, res) => {
  // You will need to setup your environment variables or hardcode the values here.
  const url = `${process.env.BACKEND_ENDPOINT}/api/ls/v1/key/${req.query.user}?token=${process.env.TOKEN}`;

  try {
    const response = await axios.get(url);

    const data = JSON.stringify(response.data);

    res.end(data);
  } catch (error) {
    console.log("Error", error.message);
    res.end("Internal Server Error");
  }
};
// Function that hits our live endpoint in order to get a list of all current live streams.
const getLiveStreams = async (req, res) => {
  // You will need to setup your environment variables or hardcode the values here.
  const url = `${process.env.BACKEND_ENDPOINT}/api/ls/v1/live?token=${process.env.TOKEN}`;
  try {
    const response = await axios.get(url);

    const data = JSON.stringify(response.data);

    res.end(data);
  } catch (error) {
    console.log("Error", error.message);
    res.end("Internal Server Error");
  }
};

// Function that hits our foundation auth in order to generate an auth token for broadcasters and viewers.
const getAuthToken = async (req, res) => {
  // You will need to setup your environment variables or hardcode the values here.
  let url = `${process.env.BACKEND_ENDPOINT}/auth/v1/access-tokens`;
  try {
    // Update the url so that it is not behind keycloak and hits the foundation auth.
    url = url.replace('umbrella.', "");

    const response = await axios.post(url, req.body, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    const responseData = JSON.stringify(response.data);

    res.end(responseData);
  } catch (error) {
    console.log("Error:", error.message);
    res.end("Internal Server Error");
  }
};

// Handler to get list of viewers watching a broadcast
const getViewersWatching = (req, res) => {
  // Accepts a callId as a query parameter
  const { callId } = req.query;

  // Check if callId is provided
  if (!callId || typeof callId !== "string") {
    return res
      .status(400)
      .send({ error: "A valid callId is required as a query parameter." });
  }

  // Retrieve viewers for the given callId, or an empty array if none exist
  const viewers = viewersByCallId[callId] || [];
  res.json({ callId, viewers });
};

// Handler for when a viewer joins the broadcast
const handleViewerJoined = (req, res) => {
  // Parse the callId and peerId from the request body
  const { callId, peerId } = req.body;

  if (!viewersByCallId[callId]) {
    viewersByCallId[callId] = []; // Initialize the array if it doesn't exist
  }

  // Add the peerId to the list of viewers for the callId
  viewersByCallId[callId].push(peerId);
  res
    .status(200)
    .send({ message: `Viewer ${peerId} added to call ${callId}.` });
};

// Handler for when a viewer leaves the broadcast
// Removes a peerId from the callId's viewer list
const handleViewerLeft = (req, res) => {
  const { callId, peerId } = req.body;

  if (viewersByCallId[callId]) {
    viewersByCallId[callId] = viewersByCallId[callId].filter(
      (id) => id !== peerId
    ); // Remove the peerId
    res
      .status(200)
      .send({ message: `Viewer ${peerId} removed from call ${callId}.` });
  } else {
    res.status(404).send({ message: `CallId ${callId} not found.` });
  }
};

// Handler for when a broadcast ends
// Removes the callId from the in-memory storage
const handleBroadcastEnded = (req, res) => {
  const { callId } = req.body;

  if (viewersByCallId[callId]) {
    delete viewersByCallId[callId]; // Remove the entry for the callId
    res
      .status(200)
      .send({ message: `Broadcast ${callId} has ended and viewers cleared.` });
  } else {
    res
      .status(404)
      .send({ message: `CallId ${callId} not found or already cleared.` });
  }
};

module.exports = {
  getAuthToken,
  getLiveStreams,
  getPrivateKey,
  getViewersWatching,
  handleBroadcastEnded,
  handleViewerJoined,
  handleViewerLeft,
};
