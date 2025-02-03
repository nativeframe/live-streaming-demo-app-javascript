class Demo {
	constructor() {
		// add an event listern to the div id and when it changes call a function bind init to the class
		document.getElementById('JWT').addEventListener('paste', (event) => {
			this.onJWT(event.clipboardData.getData('text'))
		});

		this.userID = getSearchParam('user_id');
		if (!this.userID) {
			document.getElementById('error').textContent = 'user_id is required, add ?user_id=your-user-id to the URL';
		}

		// check JWT in local storage
		const jwt = localStorage.getItem(`jwt-${this.userID}`);
		if (jwt) {
			this.onJWT(jwt);
		}

		this.programID = getSearchParam('id');

		if (!this.programID) {
			document.getElementById('error').textContent = 'Program ID is required, add ?id=your-program-id to the URL';
		}
	}

	onJWT(jwtToken) {
		console.log('jwtToken', jwtToken);
		try {
			const decodedToken = parseJWT(jwtToken);
			document.getElementById('jwt-display').textContent = JSON.stringify(decodedToken, null, 2);
			this.jwt = jwtToken;

			/// add JWT to the input
			document.getElementById('JWT').value = jwtToken;

			// add JWT to local storage
			localStorage.setItem(`jwt-${this.userID}`, jwtToken);

		} catch (error) {
			document.getElementById('error').textContent = error;
			return;
		}

		this.initVC();
	}

	async initVC() {
		this.vc = await new VideoClient.VideoClient({
			// backendEndpoints: ["https://gateway.zorro.nativeframe.com"],
			backendEndpoints: ["https://gateway.james.devspace.lsea4.livelyvideo.tv"],
			token: this.jwt
		});

		await this.encoder();
	}

	async encoder() {
		await VideoClient.mediaController.init();
		this.mediaStreamController = await VideoClient.mediaController.requestController();

		this.mediaStreamController.audioMuted = false;
		this.mediaStreamController.videoPaused = false;
		this.mediaStreamController.videoDeviceId = VideoClient.mediaController.videoDevices()[0].deviceId;
		this.mediaStreamController.audioDeviceId = VideoClient.mediaController.audioDevices()[0].deviceId;

		const preview = this.vc.requestPlayer(this.mediaStreamController);

		// Create the video element using videoClient.
		const video = VideoClient.adapter.device.createVideoElement();

		// Set a width for the video (this can be done separately if needed).
		video.style.objectFit = 'cover'
		video.style.width = "40%";
		// Set the local previews audio to mute so you don't hear yourself.
		preview.localAudioMuted = true;
		// Attach the video to the videoElement.
		preview.attachTo(video);

		// Append your newly created video-element with the preview player attached to your document body.
		document.getElementById("videoWrapper").appendChild(video);
		// create start broadcast button


		console.log('encoder initialized');
		try {
			this.call = await this.vc.joinCall(this.programID, {})
		} catch (error) {
			document.getElementById('error').textContent = error;
			return;
		}

		this.addBroadcastButton();

		this.call.on("peerAdded", (event) => {
			console.log('peer added', event);

			const peer = event.peer;

			peer.on("playerAdded", (event) => {
				console.log('player added', event);
				const player = event.player;
				const videoElement = VideoClient.adapter.device.createVideoElement();
				// add peer id as video element id
				videoElement.id = event.peer.peerParams.id;
				videoElement.style.objectFit = 'cover'
				videoElement.style.width = "40%";
				player.attachTo(videoElement);
				document.getElementById("videoWrapper").appendChild(videoElement);
			});
		});

		this.call.on("peerRemoved", (event) => {
			console.log('peer removed', event);
		});

		console.log('call joined');
	}

	addBroadcastButton() {
		const broadcastButton = document.createElement("button");
		broadcastButton.id = "broadcast";
		broadcastButton.textContent = "Start Broadcast";
		document.getElementById("controls").appendChild(broadcastButton);

		this.broadcasting = false;

		broadcastButton.addEventListener("click", async () => {
			if (this.broadcasting) {
				this.broadcast.dispose();
				this.broadcasting = !this.broadcasting;
				broadcastButton.textContent = "Start Broadcast";
				return;
			}

			console.log('broadcasting');
			try {
				this.broadcast = await this.call.broadcast(this.mediaStreamController, {
					streamName: "commentator"
				});
				this.broadcasting = !this.broadcasting;
				broadcastButton.textContent = "End Broadcast";
			} catch (err) {
				document.getElementById('error').textContent
			}
		});
	}
}

function getSearchParam(paramName) {
	return new URLSearchParams(window.location.search).get(paramName);
}

// Usage:
// URL: http://example.com?name=John
const name = getSearchParam('name'); // Returns "John"

function parseJWT(token) {
	// Split the token into parts
	const parts = token.split('.');

	if (parts.length !== 3) {
		throw new Error('Invalid JWT format');
	}

	// Decode each part
	const decoded = {
		header: JSON.parse(decodeBase64Url(parts[0])),
		payload: JSON.parse(decodeBase64Url(parts[1])),
	};

	return decoded;
}

function decodeBase64Url(str) {
    // Convert base64url to base64
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    // Decode
    return atob(padded);
}

try {
	window.demo = new Demo();
} catch (error) {
	document.getElementById('error').textContent = error;
}
