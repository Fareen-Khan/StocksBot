const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('price')
		.setDescription('Replies with price of Stock!'),
	async execute(interaction) {
		await interaction.reply('price is ...!');
	},
};