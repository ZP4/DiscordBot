const dotenv = require('dotenv').config('./../process.env');
const itsadate = require('its-a-date');
const remindSchema = require('./../schemas/remind-schema');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = {
    commands: ['remindme'],
    callback : (message, arguments, text) => {
        const connectToMongoDB = async () => {
            await mongoose.connect(
                process.env.MONGO_URI,
                {})
                .then(() => {
                    // var db = mongoose.connection;

                    //Round down to nearest minute 60 * 1000

                    const embedMessage = new MessageEmbed()
                        .setTitle("Reminder Set")
                        .setColor("#00FF00")
                        .setThumbnail('https://cdn.icon-icons.com/icons2/2248/PNG/512/alarm_check_icon_135987.png')
                    
                    const timeNow = (Math.floor(Date.now()/60000));
                    const timeRemind = Math.floor(Date.parse(itsadate.parse(text))/60000)+ 1;
                    console.log(`DDD: ${itsadate.parse(text)}`);

                    const desc = arguments.slice(arguments.indexOf('about')+1, arguments.length+1).join(" ")
                    
                    console.log(text)
                    console.log(timeRemind)
                    console.log(`Date now ${timeNow}`)
                    console.log(desc)
                    
                    if(isNaN(timeRemind)) {
                        embedMessage
                            .setTitle("Reminder Set Failed")
                            .setDescription("Please be more specific with the time or specify a time")

                        message.reply({
                            embeds: [embedMessage]
                        })
                    }
                    else {

                        var date = new Date(timeRemind * 60000)
                        var humanDate = new moment(date)
    
                        if (timeNow == timeRemind-1) {
                            embedMessage
                                .setColor("#FF0000")
                                .setDescription(`Your reminder has been rounded to the nearest minute.\n
                                We will remind you on:\n**${humanDate.format("dddd, MMMM Do YYYY, h:mm a")}**
                                `)
                            message.reply({
                                embeds: [embedMessage]
                            })
                        }
                        else {
                            
                            embedMessage
                                .setDescription(`Your reminder has been set for \n**${humanDate.format("dddd, MMMM Do YYYY, h:mm a")}**`)
    
                            message.reply({
                                embeds: [embedMessage]
                            })
                        }

                        setTimeout(async () => {
                            await new remindSchema({
                                discordID: message.author.id,
                                channelID: message.channelId,
                                dateNow: timeNow,
                                dateRemind: timeRemind,
                                descriptionText: desc          
                            }).save().then(() => {
                                // db.close();
                            })
                        }, 0)
    
                        
                        
                        
                    }
                    
                    
                })

            
            
        }

        connectToMongoDB();
        

        


    }
}