module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    callback : (message, arguments, text) => {
        message.reply({
            content: "Pog"
        })
        .then((msg) => {
            msg.edit({
                content: msg.content + `\nLatency: ${msg.createdTimestamp - message.createdTimestamp}ms \nAPI Latency: ${Math.round(message.client.ws.ping)}ms`
            })
        })
    }
} 