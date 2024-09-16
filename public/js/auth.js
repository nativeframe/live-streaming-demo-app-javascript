async function auth(authType) {
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
        videoClientOptions = await getBroadcasterOptions();
    } else {
        console.error("Invalid authType");
        return;
    }
    // Create our VideoClient instance with the options above and once created we can create our Encoder.
    let vc = await new VideoClient.VideoClient(videoClientOptions);
    await encoder(vc, VideoClient);
}

function getUsername() {
    const user = `demoUser${getRandomName()}${Math.floor(Math.random() * 10)}`;
    return user;
}

async function createStream() {
    const user = getUsername();
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
            },
            body: JSON.stringify(options),
        });
        const body = await response.json();
        streamId = body["@nativeframe"].streamId;
        document.getElementById('stream-id').textContent = streamId;
        window.config.streamId = streamId;
        console.log("streamId", streamId);
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

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
        console.log("kid", kid);
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
    return kid;
}

async function getBroadcasterOptions () {
    const kid = await getKID();
    const token = await tokenRefresher(window.config.user, window.config.streamId, kid, ["broadcaster"]);
    const encoderOptions = {
      backendEndpoints: [window.config.backendEndpoint],
      token: token,
    };
    return encoderOptions;
}

async function getViewerOptions(streamId) {
    const kid = await getKID();
    const user = getUsername();
    const token = await tokenRefresher(user, streamId, kid, ["viewer"]);
    const options = {
        backendEndpoints: [window.config.backendEndpoint],
        token: token,
    }
    return options;
}

async function useAuth0() {
    auth0.createAuth0Client({
        domain: window.config.auth0.domain,
        clientId: window.config.auth0.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: "https://www.nativeframe.com"
        },
        useRefreshTokens: true,
        cacheLocation: 'localstorage'
    }).then(async (auth0Client) => {
        // Assumes a button with id "login" in the DOM
        const loginButton = document.getElementById("login");
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.loginWithRedirect();
        });
        if (location.search.includes("state=") && 
            (location.search.includes("code=") || 
            location.search.includes("error="))) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
            const jwt = await auth0Client.getTokenSilently();
            localStorage.setItem('jwt', jwt);
        }
        // Assumes a button with id "logout" in the DOM
        const logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.logout();
        });
        const isAuthenticated = await auth0Client.isAuthenticated();
        const userProfile = await auth0Client.getUser();
        // Assumes an element with id "profile" in the DOM
        const profileElement = document.getElementById("profile");
        if (isAuthenticated) {
            profileElement.style.display = "block";
            profileElement.innerHTML = `
                    <p>${userProfile.name}</p>
                    <img id="profile-pic" src="${userProfile.picture}" />
                `;
            document.getElementById('video').style.display = "block";
            document.getElementById('login').style.display = "none";
        } else {
            profileElement.style.display = "none";
        }

        document.getElementById('refresh').addEventListener('click', async () => {
            const jwt = await auth0Client.getTokenSilently();
            localStorage.setItem('jwt', jwt);
            console.log('Token refreshed', jwt);
        });
    });

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        const videoClientOptions = {
            backendEndpoints: [window.config.backendEndpoint],
            token: jwt,
        };
        return videoClientOptions;
    }
}