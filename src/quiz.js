var Ports = require('./ports');

class Quiz
{
  constructor() {
    // Pick a random port, ready to go
    this.port = Ports.random(true);

    // Now pick either to ask for the port or for the name
    this.askFor = ['name', 'port'][Math.floor(Math.random() * 2)];
  }

  question() {
    if (this.askFor == 'name') {
      return `What is the name of the service that uses port *${this.port.Port}*?`;
    } else if (this.askFor == 'port') {
      return `What is the port number that is used by *${this.port.Description}*?`;
    }
  }

  answer() {
    if (this.askFor == 'name') {
      return this.port.Description;
    } else if (this.askFor == 'port') {
      return this.port.Port;
    }
  }

  check(answer) {
    const regex = new RegExp('\\b' + answer.toLowerCase() + '\\b');
    return regex.test((this.answer()).toLowerCase());
  }
}

module.exports = Quiz;
