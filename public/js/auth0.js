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