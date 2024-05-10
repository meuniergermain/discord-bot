const { EmbedBuilder } = require('discord.js');

module.exports = function createEmbed(data) {
	if (!data.data) return;

	/* 	const exampleEmbed = new EmbedBuilder()
			.setColor(0x6441a5)
			.setTitle(data.user_name)
			.setURL(`https://www.twitch.tv/${data.user_login}`)
			.setAuthor({ name: 'A', iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/68296fe2-cee7-42dd-b241-6535084df12a-profile_image-70x70.png', url: 'https://discord.js.org' })
			.setDescription(data.title)
			.setThumbnail('https://i.imgur.com/AfFp7pu.png')
			.addFields(
				{ name: data.game_name, value: data.viewer_count })
			.setImage('https://panels.twitch.tv/panel-68078157-image-4985521e-e9d3-4c33-b588-cdfd9a2a85f7')
			.setTimestamp();
 */

	const width = 1280;
	const height = 720;
	const randomNumber = Math.floor(Math.random() * 10000);

	const thumbnailUrl = data.data.thumbnail_url.replace('{width}', width).replace('{height}', height) + '?' + randomNumber;
	const dataEmbed = new EmbedBuilder()
		.setColor(0x6441a5)
		.setTitle(data.data.user_name)
		.setURL(`https://www.twitch.tv/${data.data.user_login}`)
		//.setAuthor({ name: data.user_name, iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
		.setDescription(data.data.title)
		.setThumbnail(data.userData.profile_image_url)
		.addFields(
			{ name: `${data.data.game_name}`, value: `${data.data.viewer_count}` },
		)
		.setImage(thumbnailUrl)
		.setTimestamp();

	const resultEmbed = {
		embeds: [
			dataEmbed,
		],
	};

	//console.log(data.data.viewer_count);
	//console.log(thumbnailUrl);

	return (resultEmbed);
};