const { REST, Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		const data = await rest.put(
			Routes.applicationGuildCommands("1031034815622946948", "637686035115147264"),
			{ body: commands },
		);
		console.log(`success`);
	} catch (error) {
		console.error(error);
	}
})();
