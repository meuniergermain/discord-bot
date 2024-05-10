const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// console.log(this.cooldown);
		await interaction.reply(`Websocket heartbeat: ${interaction.client.ws.ping}ms.`);
		// await interaction.deleteReply();
	},
};