# Live Streaming Demo App

This demo will cover how to start a live stream on the Native Frame platform. 

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) installed (latest stable version recommended).
- A [Native Frame](https://dashboard.nativeframe.com) account.

## Getting Started

To start a live stream, the broadcaster must authenticate with the Native Frame platform. There are two options to authenication - using a Native Frame token, or through [Auth0](https://auth0.com/). Below are steps for both authentication options.

### Using the Native Frame Token Option

1. From the [Native Frame dashboard](https://dashboard.nativeframe.com), create a new **Manual** project.
2. Navigate to the **API Keys** page, under the **JSON Web Key Sets (JWKS)** section, find the **Service Account JWK** and click **Generate JWT** button. Copy the generated JWT.
3. Open `/public/js/globalConfig.js` and paste the JWT in the `serviceJwt` variable. 
4. Navigate back to the dashboard and copy the **Project ID**. @todo -- for now, you can find the projectId by pasting the `serviceJwt` in jwt.io and grabbing it from the `iss` field. It's the uuid that comes after `nativeframe?project=`.
5. Paste the projectId in the `projectId` variable in `/public/js/globalConfig.js`.
6. Now you're ready to go!

<!-- ### Using the Auth0 Option

First we need to configure this app to use Auth0.

1. Open `/client/public/js/globalConfig.js` and set the `authType` to `auth0`
1. Set `auth0.domain` and `auth0.clientId` to your Auth0 domain and Auth0 client ID found on in the Auth0 dashboard.

Next, it's time to configure the app in the Auth0 dashboard. The first step is to add a role to the Auth0 user you'll be using for this demo. 

1. Navigate to the User Management dashboard and select "Roles"
1. Create a new role with the name "broadcaster" and a description "Public broadcaster role"
1. Assign this role to the user you will be using for this demo

Now we have to configure the Auth0 app.

1. Navigate to "Applications" > "Applications" and select the app you will be using for this demo...
1. Navigate to "Actions" > "Flows" and select "Login"
1. Add a new "Action" and paste the following script

```js
const createVideoClaimBroadcaster = async (event, api) => {
	const res = await fetch(`${event.secrets.NativeFrameHost}/program/api/v1/projects/${event.secrets.NativeFrameProjectID}/streams?projectId=${event.secrets.NativeFrameProjectID}`, {
		"headers": {
			"authorization": `bearer ${event.secrets.NativeFrameJWT}`,
			"content-type": "application/json",
		},
		"body": `{"streamName":"${Date.now().toLocaleString()}","authKey":"some-secret","authType":"private","transcode":true}`,
		"method": "POST",
	});
	if (!res.ok) {
		api.access.deny("Unable to create stream:" + res.status + " " + event.secrets.NativeFrameHost + " " + event.secrets.NativeFrameProjectID)
		return
	}

	const stream = await res.json();
	const t = {
		data: {
			displayName: event.user.given_name,
			mirrors: [
				{
					clientEncoder: "SaaS",
					clientReferrer: event.secrets.NativeFrameProjectID,
					id: stream.id,
					kind: "pipe",
					streamKey: stream.id, // streamId
					streamName: "demo"
				}
			]
		},
		token: stream.id,
		scopes: event.authorization.roles,
		userId: event.user.user_id,
		expire: "2025-06-06T22:33:31.898626447Z" //TODO: get from event if we can
	};
	api.accessToken.setCustomClaim('@video/token', t);
}

const createViewerVideoClaim = (event, api) => {
	const t = {
		data: {
			displayName: event.user.given_name,
		},
		token: "todo",
		scopes: event.authorization.roles,
		userId: event.user.user_id,
		expire: "2025-06-06T22:33:31.898626447Z" //TODO: get from event if we can
	};
	api.accessToken.setCustomClaim('@video/token', t);
}

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
	if (event.authorization) {
		api.accessToken.setCustomClaim("lively/roles", event.authorization.roles)
		if (event.authorization.roles.includes("broadcaster")) {
			await createVideoClaimBroadcaster(event, api)
			return;
		}
		createViewerVideoClaim(event, api)
	}
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
```

1. Next we need to set 3 secrets. Click "Add Secret" and enter the following
    1. `NativeFrameProjectID` - set this to your Native Frame projectId
    1. `NativeFrameHost` - set this to `https://dev2.devspace.lsea4.livelyvideo.tv`
    1. `NativeFrameJWT` - set this to a user account associated with a service account

### Obtain the NativeFrameJWT

1. Go to your project on the Native Frame dashboard. Note this must be a manual project.
1. Select "API Keys" and click "New JWK"
1. Add "Auth0 Service Account" as the JWK Alias and select "Service Account" as the "Role" and click "Create"
1. Next send a cURL with the following fields populated

```bash
curl 'https://dashboard.dev2.devspace.lsea4.livelyvideo.tv/dashboard/api/v1/organizations/test-org/projects/{YOUR_PROJECT_ID}/foundation-auth/auth/v1/jwt' \
  -H 'authorization: bearer {YOUR_NATIVE_FRAME_DASHBOARD_JWT}' \
  -H 'content-type: application/json' \
  --data-raw '{"kid":"{KID_OF_SERVICE_ACCOUNT_JWT}", "sub": "test-user"}'
  ```

5. Now copy the returned token and add this as the NativeFrameJWT secret in Auth0. -->

## Demo

1. Install the dependencies by running `npm run install`
1. Start the client by running `npm run start`
1. Navigate to http://localhost:3000 to start a live stream
1. Once you're streaming, you can watch the playback by scrolling down and clicking "View Stream"


## Disclaimer

This app is for demonstration and educational purposes only.