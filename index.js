const dotenv = require('dotenv').config({path: __dirname+'\\process.env'});
const path = require('path');
const fs = require('fs');
const checkRemind = require('./checkRemindQueue');
const { Client, Intents, MessageEmbed } = require('discord.js');




// Create a new client instance
const client = new Client({ intents: [
    Intents.FLAGS.GUILD_MESSAGE_TYPING, 
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });


// When the client is ready, run this code (only once)
client.once('ready', async () => {
	
    const baseFile = "command-base.js"
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option= require(path.join(__dirname, dir, file))
                // console.log(file, option)
                commandBase(client, option)
            }
        }
    }

    readCommands('commands')
    
});


client.on('messageCreate', message => {
    if (message.author.bot) return false;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
    // console.log(message.content);
    
    const messageArray = message.content.toLowerCase().split(" ");


    if (messageArray.includes("pu") 
        || messageArray.includes("pullup") 
        || messageArray.includes("capybara")
        || message.content.toLowerCase().includes("pull up")
    ) 
        {
            message.channel.send({content: "https://www.youtube.com/watch?v=26KooinHoJI"});
            
        }
});



// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

checkRemind(client);

