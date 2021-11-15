const {prefix} = require("../config.json")
const {Permissions} = require('discord.js')

const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
      ]

      for (const permission of permissions) {
          if(!validPermissions.includes(permission)) {
              throw new Error(`Unknown permission node "${permission}"`)
          }
      }
} 

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have permission to run this command.',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions

    if  (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering command "${commands[0]}"`)

    if (permissions.length) {
        if (typeof permissions == 'string') {
            permissions = [permissions]
        }

        validatePermissions(permissions)
    }

    client.on("messageCreate", message => {
        const {member, content, guild} = message

        for (const alias of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {

                //Check Permissions
                // console.log(Permissions.FLAGS)
                for (let [name, bitwise] in Object.entries(Permissions.FLAGS)) {
                    
                    if(!message.member.permissionsIn(message.channel).any(name)) {
                        message.reply({
                            content: permissionError
                        })
                        return
                    }
                    // console.log(message.member.permissionsIn(message.channel).any(name))
                }

                //Check Roles
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => {
                        role.name === requiredRole
                    }) 

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply({
                            content:`You must have the "${requiredRole}" role to use this command.`
                        })
                        return
                    }
                }

                const arguments = content.split(/[ ]+/)
                // REMOVE PREFIX AND COMMAND
                arguments.shift()

                if (arguments.length < minArgs || (
                    maxArgs !== null && arguments.length > maxArgs
                )) {
                    message.reply({
                        content: `Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`
                    })
                    return
                }

                callback(message, arguments, arguments.join(' '))


                return
            }
        }
    })
}