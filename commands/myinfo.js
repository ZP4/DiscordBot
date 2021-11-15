module.exports = {
    commands: ['myinfo', 'mi'],
    callback : (message, arguments, text) => {

        message.reply(`${message.author.id}`)
    },
}