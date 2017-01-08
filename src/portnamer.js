var Botkit = require('botkit');
var Ports = require('./ports');
var Quiz = require('./quiz');

// load the .env file
require('dotenv').config({silent: true});

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.TOKEN
}).startRTM();

// Hello
controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    bot.reply(message, 'Hello. If you\'d like to know how to use me.. ;). Type `help`.');
});

// Help
controller.hears(['help'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'I am your fiendly port namer bot. You can ask me stuff like:\n```What port does telnet use?\nport 22?\nssh?\nGet me a random port\nLets play a game\nQuiz me```\nSo, what would you like to do ? :)');
});

// check by port
controller.hears(['port (\\d+)', '^(\\d+)\\s*\\?*$'], 'direct_message,direct_mention,mention', function(bot, message) {
    var port = message.match[1];
    var name = Ports.find('name', port);

    if (name.length > 0) {
        var reply = 'Looks like the port ' + port + ' belongs to ' + name[0].Description;
    } else {
        var reply = '*Sorry*, I couldn\'t find a name that matches port `' + port + '`';
    }

    bot.reply(message, reply);
});

// check by name
controller.hears(['port (?:does|is|has|have) (\\w+)', '^(\\w+)\\s*\\?*$'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = (message.match[1]).toLowerCase();
    var port = Ports.find('port', name);

    if (port.length > 0) {
        var reply = name + ' uses port ' + port[0].Port;
    } else {
        var reply = '*Sorry*, I couldn\'t find a port that matches `' + name + '`';
    }

    bot.reply(message, reply);
});

// get a random port
controller.hears(['random', 'fun fact'], 'direct_message,direct_mention,mention', function(bot, message) {
    var randomPort = Ports.random();

    // Starts the reply string
    var reply = `*${randomPort.Description}* is ${randomPort.Status} and uses port ${randomPort.Port} over `;

    // Checks if the port uses both udp and tcp
    if (randomPort.TCP != '' && randomPort.UDP != '') {
        reply = reply + `${randomPort.TCP} and ${randomPort.UDP}.`;
    } else if (randomPort.TCP != '') {
        reply = reply + `${randomPort.TCP}.`;
    } else if (randomPort.UDP != '') {
        reply = reply + `${randomPort.UDP}.`;
    }

    bot.reply(message, reply);
});

// Quiz time
controller.hears(['quiz me', 'game'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        if (!err) {
            convo.say('Awesome! Let\'s play a game I like to call `Name That Port` :)\nLet\'s start!');

            var quiz = new Quiz();
            convo.ask(quiz.question(), function (response, convo) {
                if (quiz.check(response.text)) {
                    convo.say('You\'re *right*!');
                } else {
                    convo.say('Sorry.. you got it *wrong*.\nThe actual answer is `' + quiz.answer() + '`.\nGoodluck next time :)\nYou can play again by typing `quiz me`.');
                }

                convo.next();
            });
        }
    });
});
