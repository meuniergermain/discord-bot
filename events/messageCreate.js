const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot || message.author.system) return;
		if (message.author.id !== process.env.MY_DISCORD_ID) return;

		console.log(message.content);

		return;
	},
};