const dotenv = require('dotenv').config('./../process.env');
const mongoose = require('mongoose');


module.exports = {
    commands: ['remindlist'],
    // expectedArgs: '<num1> <num2>',
    permissionError: 'You need admin permissions to run this command',
    // minArgs: 2,
    // maxArgs: 2,
    callback : (message, arguments, text) => {
        



    },
    // permissions: 'ADMINISTRATOR',
    // requiredRoles: []
}