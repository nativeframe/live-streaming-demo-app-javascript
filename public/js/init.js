// Creates the VideoClient options and initializes the VideoClient instance
async function init(authType) {
    if (
        window.config.backendEndpoint === undefined || 
        window.config.backendEndpoint === '' ||
        window.config.projectId === undefined || 
        window.config.projectId === ''
    ) {
        console.error("Missing configuration");
        return;
    }
    let videoClientOptions;
    if (authType === "auth0") {
        videoClientOptions = await useAuth0();
    } else if (authType === "token") {
        await createStream();
        videoClientOptions = await getBroadcasterOptions();
    } else {
        console.error("Invalid authType");
        return;
    }
    // Create our VideoClient instance with the options above and once created we can create our Encoder.
    let vc = await new VideoClient.VideoClient(videoClientOptions);
    await encoder(vc, VideoClient);
}

// Creates a new public stream in the project
async function createStream() {
    const user = getRandomName();
    window.config.user = user;
    // Create stream
    let streamId;
    try {
        const options = {
            "streamId": "",
            "userId": user,
            "authType": "public",
            "roles": ["broadcaster"]
        };
        const response = await fetch(`${window.config.backendEndpoint}/program/api/v1/projects/${window.config.projectId}/create-claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${window.config.serviceJwt}`
            },
            body: JSON.stringify(options),
        });
        const body = await response.json();
        streamId = body["@nativeframe"].streamId;
        document.getElementById('stream-id').textContent = streamId;
        window.config.streamId = streamId;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Retrieves the KID from the project, used to generate a token
async function getKID() {
    let kid;
    try {
        const response = await fetch(`${window.config.backendEndpoint}/auth/v1/jwks?iss=nativeframe?project=${window.config.projectId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        const body = await response.json();
        kid = body.keys[0].kid;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
    return kid;
}

// Creates the options for the broadcaster
async function getBroadcasterOptions () {
    const kid = await getKID();
    const token = await tokenRefresher(window.config.user, window.config.streamId, kid, ["broadcaster"]);
    const encoderOptions = {
      backendEndpoints: [window.config.backendEndpoint],
      token: token,
    };
    return encoderOptions;
}

// Creates the options for the viewer
async function getViewerOptions(streamId) {
    const kid = await getKID();
    const user = getRandomName();
    const token = await tokenRefresher(user, streamId, kid, ["viewer"]);
    const options = {
        backendEndpoints: [window.config.backendEndpoint],
        token: token,
    }
    return options;
}
