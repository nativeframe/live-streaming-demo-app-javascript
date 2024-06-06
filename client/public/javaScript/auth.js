async function auth(authType) {
    let videoClientOptions;
    if (authType === "auth0") {
        videoClientOptions = await useAuth0();
    } else if (authType === "token") {
        videoClientOptions = await useClientToken();
    } else {
        console.error("Invalid authType");
        return;
    }
    console.log('OPTIONS', videoClientOptions);
    // Create our VideoClient instance with the options above and once created we can create our Encoder.
    let vc = await new VideoClient.VideoClient(videoClientOptions);
    await encoder(vc, VideoClient);
}

async function useClientToken () {
    // This is just grabbing a random name from our list, all displayNames and userIds should be unique.
    const user = `demoUser${getRandomName()}${Math.floor(Math.random() * 10)}`;
    let privateKey = '';
    // Fetching our private key for the user we plan to broadcast with.
    await fetch(`${window.config.serviceEndpoint}/private-key?user=${user}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Store the private key
      privateKey = data.results.pvtKey;
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
    // Create our token refresh using the username and privateKey we just generated.
    const token = await tokenRefresher(user, privateKey, window.config.serviceEndpoint);
    // Our video client options.
    const videoClientOptions = {
      backendEndpoints: [window.config.backendEndpoint],
      token: token,
    };
    return videoClientOptions;
}

async function useAuth0() {
    auth0.createAuth0Client({
        domain: window.config.auth0.domain,
        clientId: window.config.auth0.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin
        }
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
            const jwt = await auth0Client.getIdTokenClaims();
            localStorage.setItem('jwt', jwt.__raw);
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
    });

    // const videoJwt = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImY0ZWFlMzFmLTljZWEtNGNlYi1hNzlhLTA3MDc1YjExNTA0MiIsInR5cCI6IkpXVCJ9.eyJAdmlkZW8vdG9rZW4iOnsiYWNjZXNzSWRzIjpbXSwiYWRtaW4iOmZhbHNlLCJkYXRhIjp7ImRpc3BsYXlOYW1lIjoiYXNkZiIsIm1pcnJvcnMiOlt7ImNsaWVudEVuY29kZXIiOiJTYWFTIiwiY2xpZW50UmVmZXJyZXIiOiIwMThlOWJiNC1hNzczLTdlN2MtOGU3Mi1jNDI5ZmI3NzdjYTgiLCJpZCI6ImE0NDUwZDEzLTMzNWYtNGFkNS05NzA1LWRjODAyOTdiNzM1OSIsImtpbmQiOiJwaXBlIiwic3RyZWFtS2V5IjoiYTQ0NTBkMTMtMzM1Zi00YWQ1LTk3MDUtZGM4MDI5N2I3MzU5Iiwic3RyZWFtTmFtZSI6ImFzZGYifV19LCJleHBpcmUiOiIyMDI0LTA2LTA2VDE4OjMxOjQ2LjMxODM2NDM0NFoiLCJzY29wZXMiOlsiYnJvYWRjYXN0ZXIiXSwidG9rZW4iOiI5ZGYxNzNjNDlmN2Y0Y2E5OTAzODE0MjhiZTE1ZjI4NCIsInVzZXJJZCI6IjI3NDRmZGVmLTc5YzEtNDViOS04MzRlLWRjZTllNTMyZmZmMSJ9LCJleHAiOjE3MTc2OTg3MDYsImlhdCI6MTcxNzY5NTEwNiwiaXNzIjoiZGV2Mj9wcm9qZWN0PTAxOGU5YmI0LWE3NzMtN2U3Yy04ZTcyLWM0MjlmYjc3N2NhOCIsImp0aSI6ImNwZ3Y1MGhiaDBmMjU0dGdrZjAwIiwicm9sZXMiOlsidXNlciJdLCJzdWIiOiIyNzQ0ZmRlZi03OWMxLTQ1YjktODM0ZS1kY2U5ZTUzMmZmZjEifQ.GZk7NdSt_bd9uUej2xt5stBjQ5G8U4PLmB6T3EY8G3PPP2Ko79xro5zYfQYvnkGe71w18yPuF6Cfy0TitCSkkym7SxEsnOh38nCukCP9FRo37x2VLX0Obdo0UHkrpapdYgq8UjPnAf6NM_LSG0ItSMGRE_Un9XQKYQsIANGBku1zRTe0IyC4GLyti0VG84vcMp6mrB9q-ide-4iFYN8I-Tjw8b6HFHKJ4TXoDUC3AOmCzOwuSQ7NlQ9N4ooo-GZ9DQayWGL4OUBRT1zE0Fl01a7PBQp8_vKUjgh2-wdloE1Nrs2Zns9dQzNVrIwLkIA2b7llUoAcFb7VEKdo85IlrA";

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
    // if (videoJwt) {
        const videoClientOptions = {
            backendEndpoints: [window.config.backendEndpoint],
            token: jwt,
            // token: videoJwt,
        };
        return videoClientOptions;
    }
}