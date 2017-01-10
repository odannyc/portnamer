// this syntax is overkill for these simple  examples, but extensible
module.exports = (function() {
  const greetings = ['hello', 'hi', 'yo', 'what\'s up', 'whatup', 'hola'];
  const helpMessage = 'I am your fiendly port namer bot. You can ask me stuff like:\n```What port does telnet use?\nport 22?\nssh?\nGet me a random port\nLets play a game\nQuiz me```\nSo, what would you like to do ? :)';

  return {
    greetings,
    helpMessage
  };
})();
