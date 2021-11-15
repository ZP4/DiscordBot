const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const remindSchema = mongoose.Schema({
    discordID: reqString,
    channelID: reqString,
    dateNow: reqString,
    dateRemind: reqString,
    descriptionText: reqString
})


module.exports = mongoose.model('remind-queue', remindSchema, 'remind-queues')

