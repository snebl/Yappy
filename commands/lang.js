const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lang')
		.setDescription('Changes accent [ the reply error is normal, yappy does not like texting ]')
		.addStringOption(option =>
			option
				.setName('accent')
				.setDescription('examples: en, ja, sv')
				.setRequired(true)),
};