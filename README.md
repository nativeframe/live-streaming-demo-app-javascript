# Live Streaming Demo App

This demo will cover how to start a live stream on the Native Frame platform. 

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) installed (latest stable version recommended).
- A [Native Frame](https://dashboard.nativeframe.com) account.

## Getting Started

To start a live stream, the broadcaster must authenticate with the Native Frame platform. There are two options to authenication - using a Native Frame token, or through [Auth0](https://auth0.com/). Below are steps for both authentication options. If you do not know which to choose, we recommend using the Native Frame token option.

### Using the Native Frame Token Option

1. From the [Native Frame dashboard](https://dashboard.nativeframe.com), create a new **Manual** project.
2. Navigate to the **API Keys** page, under the **JSON Web Key Sets (JWKS)** section, find the **Service Account JWK** and click **Generate JWT** button. Copy the generated JWT.
3. Open `/public/js/globalConfig.js` and paste the JWT in the `serviceJwt` variable. 
4. Navigate back to the dashboard and copy the **Project ID**. @todo -- for now, you can find the projectId by pasting the `serviceJwt` in jwt.io and grabbing it from the `iss` field. It's the uuid that comes after `nativeframe?project=`.
5. Paste the projectId in the `projectId` variable in `/public/js/globalConfig.js`.
6. Now you're ready to go!

### Using the Auth0 Option

First we need to configure this app to use Auth0.

1. Open `/public/js/globalConfig.js` and set the `authType` to `auth0`
1. Set `auth0.domain` and `auth0.clientId` to your Auth0 domain and Auth0 client ID found on in the Auth0 dashboard.

Next, it's time to configure your Auth0 app in the Auth0 dashboard. [Check out this guide](https://docs.nativeframe.com/docs/platform/auth/auth0/) for details on the Auth0 configuration.


## Demo

1. Install the dependencies by running `npm run install`
1. Start the client by running `npm run start`
1. Navigate to http://localhost:3000 to start a live stream
1. Once you're streaming, you can watch the playback by scrolling down and clicking "View Stream"


## Disclaimer

This app is for demonstration and educational purposes only.