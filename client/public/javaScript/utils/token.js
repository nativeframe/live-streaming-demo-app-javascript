async function fetchToken(options, endpoint) {
    // ** REQUIRED **
    // You must add your service endpoint here in order to use this demo.
    // ** REQUIRED **
    const response = await fetch(`${endpoint}/auth-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    })
    const body = await response.json();
    return body.token;
};


// Functions as a Refresher for fetching our token
async function tokenRefresher(user, privateKey, endpoint) {
    // You need to return a promise for this to work properly
    return async () =>  {
        let token;
        // These options are setup for a broadcaster
        const options = {
            scopes: ['broadcaster'],
            userId: 'admin',
            data: {
                displayName: user,
                mirrors: [
                    {
                        id: privateKey,
                        streamName: 'demo',
                        kind: 'pipe',
                        clientEncoder: 'demo',
                        streamKey: privateKey,
                        clientReferrer: 'staging',
                    },
                ],
            },
        };
        try {
            token = await fetchToken(options, endpoint);
        } catch (error) {
            console.error("unable to get access token", {
                error,
            });
            throw error;
        }
        return token;
    }
};



