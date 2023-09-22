const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const gTTS = require('gtts');

const { token } = require("./config.json");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ]
})

client.commands = new Collection();

// const langCommand = require('./commands/lang.js');
// const lang_ = require('./commands/lang.js');
// client.commands.set(langCommand.data.name, langCommand);

// on error ; don't
process.on('uncaughtException', function (err) {
    console.log(err);
});

const player = createAudioPlayer();

client.on('ready', () => {
    console.log(`[ yappy is running ]`);
    lang = 'en-us'
});

client.on("messageCreate", (message) => {
    const demand = message.content.toLowerCase()
    var tts = message.content
    var connection

    function yapLog(x){
        console.log("[ \x1b[31m"+message.guild.name+"\x1b[0m ] [ \x1b[31m"+message.member.voice.channel.name+"\x1b[0m ] [ \x1b[31m"+message.author.username+"\x1b[0m ] "+x)
    }

    function join(channel){
        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false
        });
    }

    // change speaking language
    // if (demand.startsWith("-l ")){
    //     lang = demand.slice(3)
    //     yapLog("[ \x1b[33maccent changed to "+lang+"\x1b[0m ]")
    //     tts = 'voice changed'
    // }

    // condition
    if (message.content && message.member.voice.channel && message.member.voice.selfMute && !message.member.voice.serverMute && !message.content.includes("https://")){
        yapLog(message.content)

        // prevent reading out pingsIDs or custom emojis
        if (tts.includes(">")){
            tts = tts.replace(/[^a-zA-Z ]/g, '')
        }

        // run through tts, read error if error
        try{
            var gtts = new gTTS(tts, lang);
        }catch (err){
            console.log(err)
            if (err.toString().includes('Language not supported')){
                lang = 'en-us'
                var gtts = new gTTS(err.toString()+'. accent set to american', lang);
            }else{
                var gtts = new gTTS(err.toString(), lang);
            }
        }

        // save file
        file = './lines/'+Date.now()+'.wav'
        gtts.save(file, function (err, result) {
            if(err) { throw new Error(err) }

            // join channel
            join(message.member.voice.channel)

            // speak file, or funny sound
            switch (tts) {
                case 'brb':
                    player.play(createAudioResource('./goofy ahh sounds/track 15.mp3'));
                break;

                case '💀':
                    player.play(createAudioResource('./goofy ahh sounds/bone.mp3'));
                break;

                case '⚓':
                    player.play(createAudioResource('./goofy ahh sounds/boatHorn.mp3'));
                break;

                default:
                    player.play(createAudioResource(file));
                break;
            }
            connection.subscribe(player);
        });
    }
});

// lang command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true })
    if (interaction.commandName === 'lang') {
        lang = interaction.options.getString('accent')
        console.log("       [ \x1b[33maccent changed to "+lang+"\x1b[0m ]")
        await interaction.editReply({ content: 'Language set to ; `' + lang + '`', ephemeral: true })
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if(newState.channel === null){
        // aww... everyone left
        let connection = getVoiceConnection(oldState.guild.id)
        if (connection && oldState.channel.members.size == 2){
            let leaveTime = Math.random() * 2000 + 500
            setTimeout(function () {
                connection.destroy();
            }, leaveTime);
        }
    }
});

client.login(token);