const os = require('os');
const Botkit = require('botkit');
const Ports = require('./ports');
const Quiz = require('./quiz');
const constants = require('./constants');
require('dotenv').config({silent: true}); // load the .env file

if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify Slack Token in environment or .env');
  process.exit(1);
}

const debug = process.env.DEBUG == true ? process.env.DEBUG : false;
const controller = Botkit.slackbot({ debug });
const bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

const quizHandler = (quiz, convo) => {
  return [
    {
      pattern: 'quit',
      callback: (response, convo) => {
        convo.say('Okay, thanks for playing!');
        convo.next();}
    },
    {
      default: true,
      callback: (response, convo) => {
        if (quiz.check(response.text)) {
          convo.say('You\'re *right*!');
        } else {
          convo.say('Sorry.. you got it *wrong*... The actual answer is `' + quiz.answer() + '`');
        }
        quiz = new Quiz();
        convo.ask(quiz.question(), quizHandler(quiz, convo));
        convo.next();
      }
    }
  ]
};

// Hello
controller.hears(constants.greetings, 'direct_message,direct_mention,mention', function(bot, message) {
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
  bot.reply(message, constants.helpMessage);
});

// check by port
controller.hears(['port (\\d+)', '^(\\d+)\\s*\\?*$'], 'direct_message,direct_mention,mention', function(bot, message) {
  const port = message.match[1];
  const name = Ports.find('port', port);
  let reply = `*Sorry*, I don't have a record for anything on port ${'`' + port + '`'}`

  if (name.length) {
    reply = `Looks like port ${port} belongs to ${name[0].Description}`;
  }

  bot.reply(message, reply);
});

// check by name
controller.hears(['port (?:does|is|has|have) (\\w+)', '^(\\w+)\\s*\\?*$'], 'direct_message,direct_mention,mention', function(bot, message) {
  const name = (message.match[1]).toLowerCase();
  const port = Ports.find('name', name);
  let reply = `*Sorry*, I don't have a record that matches ${'`' + name + '`'}`;

  if (port.length) {
    reply = `${name} uses port ${port[0].Port}`;
  }

  bot.reply(message, reply);
});

// get a random port
controller.hears(['random', 'fun fact'], 'direct_message,direct_mention,mention', function(bot, message) {
  const randomPort = Ports.random();
  const protocols = [randomPort.TCP, randomPort.UDP].filter(el => el != '');

  const reply = `*${randomPort.Description}* is stupid ${randomPort.Status} and uses port ${randomPort.Port} over ${protocols.join(' and ')}.`;

  bot.reply(message, reply);
});

// Quiz time
controller.hears(['quiz me', 'game'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    if (!err) {
      convo.say('Awesome! Let\'s play a game I like to call `Name That Port` :)\nSay `exit` at any time to quit.');

      let quiz = new Quiz();
      convo.ask(quiz.question(), quizHandler(quiz, convo));
      convo.next();
    }
  });
});

controller.hears('show url', 'direct_message,direct_mention,mention', (bot, message) => {
  const macOrWindows = ['darwin', 'win32'].filter(el => el == os.platform());
  const urlMessage = process.env.NOW_URL
                  ? `My URL is ${process.env.NOW_URL}`
                  : macOrWindows.length > 0
                    ? 'I think I am running locally, as I am on a Mac or Windows machine'
                    : 'I do not seem to be deployed in the cloud using now.sh, but I am not running on Mac or Windows. Did you deploy me with Heroku or AWS?';
  bot.reply(message, urlMessage);
});
