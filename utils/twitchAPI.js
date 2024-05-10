const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

let access_token = '';

async function getToken() {
	const url = 'https://id.twitch.tv/oauth2/token';
	const data = new URLSearchParams();
	data.append('client_id', process.env.TWITCH_ID);
	data.append('client_secret', process.env.TWITCH_SECRET);
	data.append('grant_type', 'client_credentials');

	try {
		const response = await axios.post(url, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		// console.log('Response:', response.data);
		access_token = response.data.access_token;
	} catch (error) {
		console.error('Error:', error);
		console.log('An error occurred while getting the token. Returning default value.');
		access_token = '';
		throw error;
	}
}

async function getStreamStatus(channel_ids) {
	try {
		if (!access_token) {
			await getToken();
		}

		const url = `https://api.twitch.tv/helix/streams?${channel_ids.map(key => `user_login=${key}`).join('&')}`;
		const headers = {
			'Client-ID': process.env.TWITCH_ID,
			'Authorization': `Bearer ${access_token}`,
		};
		const response = await axios.get(url, { headers });
		// console.log(response.data.data);
		return response.data.data;
	} catch (error) {
		console.log(error);
	}
}

async function getUsers(channel_ids) {
	try {
		if (!access_token) {
			await getToken();
		}

		const url = `https://api.twitch.tv/helix/users?${channel_ids.map(key => `login=${key}`).join('&')}`;
		const headers = {
			'Client-ID': process.env.TWITCH_ID,
			'Authorization': `Bearer ${access_token}`,
		};
		const response = await axios.get(url, { headers });
		//console.log(response.data.data);
		return response.data.data;
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getStreamStatus,
	getUsers,
};