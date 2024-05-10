const { readJSONfile, writeJSONfile } = require('./jsonHandler');
const { getStreamStatus, getUsers } = require('./twitchAPI');

const streamersList = readJSONfile('streamersList');
const dictionary = { ...streamersList };

// Init each streamer object
for (const key of Object.keys(dictionary)) {
	dictionary[key] = {
		userData: {},
		data: {},
		messageId: '',
	};
}

// Retrieves the keys of the 'dictionary' object and assigns them to the an array.
let dictionaryKeys = Object.keys(dictionary);

// Adds a new streamer to the streamers list without adding any data to the file.
async function addStreamer(name) {
	const streamerExist = await getUsers([name]);
	if (streamerExist) {
		streamersList[name] = {};
		writeJSONfile(streamersList, 'streamersList');
		const newStreamer = {
			userData: streamerExist[0],
			data: {},
			messageId: '',
		};
		dictionary[name] = newStreamer;
		dictionaryKeys.push(name);
		return streamerExist;
	} else {
		return false;
	}
}

// Remove a streamer from the streamers list.
function removeStreamer(name) {
	if (name in streamersList) {
		delete streamersList[name];
		writeJSONfile(streamersList, 'streamersList');
		delete dictionary[name];
		dictionaryKeys = dictionaryKeys.filter(key => key !== name);
		console.log(`${name} has been removed from the list.`);
		return true;
	} else {
		console.log(`${name} is not in the list.`);
		return false;
	}
}

/**
 * Retrieves the stream live status for a list of users.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of stream status objects.
 * @throws {Error} If an error occurs while fetching the stream status.
 */
async function askForStreamStatus() {
	if (dictionaryKeys.length === 0) return [];

	try {
		const data = await getStreamStatus(dictionaryKeys);
		if (data.length === 0) {
			//offline;
			return [];
		} else {
			//online;
			return data;
		}
	} catch (error) {
		console.error(error.response.data);
	}
}

// Retrieves profiles data for the streamers in the dictionary.
async function askForUsers() {
	if (dictionaryKeys.length === 0) return [];

	try {
		const userData = await getUsers(dictionaryKeys);
		if (userData.length > 0) {
			for (const item of userData) {
				dictionary[item.login].userData = item;
			}
		}
	} catch (error) {
		console.error(error);
	}
}

/**
 * Compares the dictionary of streamers with the online stream status and updates the dictionary accordingly.
 *
 * @returns {Array} - An array of streamers that are currently online.
 * @throws {Error} - If an error occurs while fetching the online status.
 */
async function dictionaryCompare() {
	try {
		const online = await askForStreamStatus(dictionaryKeys);
		const isOnline = [];

		if (online.length == 0) return isOnline;

		const onlineUserNames = online.map(item => item.user_login);

		for (const key of Object.keys(dictionary)) {
			if (!onlineUserNames.includes(key)) {
				if (dictionary[key].messageId) {
					dictionary[key].messageId = '';
					//console.log(`${key} went offline`);
					dictionary[key].data = {};
				}
			}
		}
		for (const item of online) {
			//console.log(`${item.user_login} went online`);
			isOnline.push(dictionary[item.user_login]);
			dictionary[item.user_login].data = item;
		}
		return isOnline;
	} catch (error) {
		console.error('Error occurred while fetching online status:', error);
	}
}

module.exports = {
	dictionaryCompare,
	askForUsers,
	addStreamer,
	removeStreamer,
	dictionaryKeys,
};