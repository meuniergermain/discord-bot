const { Events } = require('discord.js');
const createEmbed = require('../utils/createEmbed.js');
const { dictionaryCompare, askForUsers } = require('../utils/twitchHandler.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const channelId = process.env.CHANNEL_ID;
		const channel = client.channels.cache.get(channelId);

		askForUsers();

		// This function handles the comparison of dictionaries. It checks if any items are online and updates their status accordingly.
		const handleDictionaryComparison = async () => {
			try {
				const online = await dictionaryCompare();
				if (online.length > 0) {
					for (const item of online) {
						if (!item.messageId) {
							console.log(`${item.data.user_login} went online`);
							const sentMessage = await channel.send(createEmbed(item));
							item.messageId = sentMessage.id;
						} else {
							const messageEdit = await channel.messages.fetch(item.messageId);
							if (messageEdit) {
								await messageEdit.edit(createEmbed(item));
							}
						}
					}
				} else {
					console.log('No streamers went online.');
				}
			} catch (error) {
				console.error('Error occurred while fetching online status:', error);
			}
		};

		handleDictionaryComparison();
		setInterval(handleDictionaryComparison, 45000);

	},
};