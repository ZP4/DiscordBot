const moment = require('moment');
const mongoose = require('mongoose');
const remindSchema = require('./schemas/remind-schema');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = function(client) {
    setInterval(() => {
        const timeNow = Math.floor(Date.now()/60000)
        let remindQueue = [];
    
        mongoose.connect(
            process.env.MONGO_URI,
            {keepAlive: true, keepAliveInitialDelay: 30000}
            ).then(() => {
                const db = mongoose.connection;
    
                try {   
                    remindSchema.find({}).sort('dateRemind').lean().then((res) => {
                        console.log("==========================================")
                        console.log(res);
                        remindQueue = res;
                        console.log(timeNow);
                        
                        const reminderEmbed = new MessageEmbed()
                                    .setColor('#44AA22')
                                    .setTitle('Reminder')
                                    .setDescription('')
                                    .setThumbnail("https://mpng.subpng.com/20210101/ht/transparent-alarm-icon-time-date-icon-bell-icon-5fef9e70c2e675.9860299416095391847983.jpg")
    
                        for (const reminder of remindQueue) {
                            const {discordID, dateRemind, channelID, descriptionText, _id} = reminder;
            
                            if (dateRemind <= timeNow) {
                                console.log("Dateremind == timenow")
                                
                                reminderEmbed
                                    .setDescription(`Reminding you about: \n**${descriptionText}**`)
                                    .setFooter(`${new moment(new Date(dateRemind * 60000)).format("dddd, MMMM Do YYYY, h:mm a")}`)
    
                                client.channels.cache.get(`${channelID}`).send({
                                    content: `<@${discordID}>`,
                                    embeds: [reminderEmbed]
                                })
                                

                                remindSchema.findByIdAndDelete(_id).then(()=> {
                                    console.log("deleted");
                                })
                            }
                            // else if (timeNow > dateRemind) {
                            //     client.channels.cache.get(`${channelID}`).send({
                            //         content: `<@${discordID}> reminder on ${descriptionText}`
                            //     })
                            //     remindSchema.findByIdAndDelete(_id).then(()=> {
                            //         console.log("deleted?")
                            //     })
                            // }
                        }
                    })
                }
                catch {
                    console.log("CHECKREMIND ERROR");
                }
                finally {
                    
                }
        })

    }, 60000)
}

