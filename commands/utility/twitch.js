const { SlashCommandBuilder } = require('discord.js');
const { addStreamer, removeStreamer, dictionaryKeys } = require('../../utils/twitchHandler.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('twitch')
		.setDescription('Handles the twitch module')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a streamer to the watchlist')
				.addStringOption(option =>
					option.setName('username')
						.setDescription('Streamer username to add to the watchlist')
						.setAutocomplete(false)
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a streamer to the watchlist')
				.addStringOption(option =>
					option.setName('username')
						.setDescription('Streamer username to remove from the watchlist')
						.setAutocomplete(true)
						.setRequired(true))),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = dictionaryKeys;
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			const validation = await addStreamer(interaction.options.getString('username'));
			console.log(validation);
			if (validation) {
				await interaction.reply(`Added streamer : ${validation[0].display_name}`);
			} else {
				await interaction.reply('Name is not valid.');
			}
		} else if (interaction.options.getSubcommand() === 'remove') {
			const validation = await removeStreamer(interaction.options.getString('username'));
			if (validation) {
				await interaction.reply(`Removed streamer : ${interaction.options.getString('username')}`);
			} else {
				await interaction.reply(`${interaction.options.getString('username')} is not in the list.`);
			}
		}
	},
};