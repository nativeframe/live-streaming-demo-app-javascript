// Fetches the token from the backend
async function fetchToken(options) {
    try {
        const response = await fetch(`${window.config.backendEndpoint}/auth/v1/video-jwt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${window.config.serviceJwt}`
            },
            body: JSON.stringify(options),
        });
        const body = await response.json();
        videoJwt = body.token;
        return videoJwt;
    } catch (error) {
        console.error("unable to get access token", {
            error,
        });
        throw error;
    }
};

// Functions as a Refresher for fetching our token
async function tokenRefresher(user, streamId, kid, scopes) {
    // You need to return a promise for this to work properly
    return async () =>  {
        let token;
        const options = {
            "kid": kid,
            "videoToken": {
              "scopes": scopes,
              "userId": user,
              "ttl": 86400,
              "data": {
                    "displayName": streamId,
                    "mirrors": [
                        {
                            "id": streamId,
                            "streamName": streamId,
                            "kind": "pipe",
                            "clientEncoder": "SaaS",
                            "streamKey": streamId,
                            "clientReferrer": window.config.projectId
                        }
                    ]
                }
            }
        };
        try {
            token = await fetchToken(options);
        } catch (error) {
            console.error("unable to get access token", {
                error,
            });
            throw error;
        }
        return token;
    }
};



