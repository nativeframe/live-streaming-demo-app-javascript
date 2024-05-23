async function useClientToken () {
    // This is just grabbing a random name from our list, all displayNames and userIds should be unique.
    const user = `demoUser${getRandomName()}${Math.floor(Math.random() * 10)}`;

    let privateKey = '';

    // Fetching our private key for the user we plan to broadcast with.
    await fetch(`${window.serviceEndpoint}/private-key?user=${user}`)
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
    const token = await tokenRefresher(user, privateKey, window.serviceEndpoint);

    // Our video client options.
    const videoClientOptions = {
      backendEndpoints: [window.backendEndpoint],
      token: token,
    };

    // Create our VideoClient instance with the options above and once created we can create our Encoder.
    let vc = await new VideoClient.VideoClient(videoClientOptions);
    await encoder(vc, VideoClient);
}

async function useAuth0() {
    auth0.createAuth0Client({
        domain: "dev-c7487lvy5pa6ai7i.us.auth0.com",
        clientId: "joLQM9sRA1CNKlgBdcMWYZH4eYGk152m",
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
    }

    // Assumes a button with id "logout" in the DOM
    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        auth0Client.logout();
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = await auth0Client.getUser();
    console.log(userProfile);
    // const t = await auth0Client.getTokenSilently();
    // log the token
    // console.log(t);

    // get the jwt
    const jwt = await auth0Client.getIdTokenClaims();
    console.log(jwt);
    // save to local storage
    localStorage.setItem('jwt', jwt.__raw);

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

    // add listeners to controls
    
}