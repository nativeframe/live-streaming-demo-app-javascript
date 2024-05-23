// Imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  getPrivateKey,
  getLiveStreams,
  getAuthToken,
  getViewersWatching,
  handleViewerJoined,
  handleViewerLeft,
  handleBroadcastEnded,
} = require("./handlers");

// In order to use our Environment variables
require("dotenv").config();

const app = express();

// Can be changed to whatever port you want
const port = 3005;

app.use(cors());

app.use(bodyParser.json());

// Endpoints used by the client application
app.get("/private-key", getPrivateKey);

app.get("/live-streams", getLiveStreams);

app.post("/auth-token", getAuthToken);

// Intended to be used with webhook events
// Allows the client application to get a list of viewers watching a broadcast
app.get("/viewers-watching", getViewersWatching);

// Endpoints to catch requests emitted by webhook events
// More information about how webhooks can be configured can be found here
// https://nativeframe-prod-usc1b.nativeframe.com/docs/administration-tools/other-events
app.post("/webhook/viewer-joined", handleViewerJoined);
app.post("/webhook/viewer-left", handleViewerLeft);
app.post("/webhook/broadcast-ended", handleBroadcastEnded);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at Your Server Endpoint:${port}`);
});
