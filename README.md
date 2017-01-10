# portnamer
A bot that can tell you what service is on what port. Gamified!

## Installation
Do you need to install this? Do you want to just add Port Namer to your Slack team or on Messenger? Coming soon!

To install you'll need to:

1. `git clone` this repository.
2. `cp .env.example .env`
3. Enter your bot token you got from Slack and enter it in the .env file
4. Run `yarn` to install dependencies
5. Finally, `npm start` or `npm run dev`. The difference is the dev script runs nodemon, so any changes to the `/src` dir will cause the app to reload automatically.

## Deploying
We recommend deploying with [now](now.sh). Go to https://my.slack.com/services/new/bot and get a Bot API key. You can also name portnamer. Copy that to your clipboard. Then deploy with one command!

```sh
now -e SLACK_TOKEN=[your slack token]
```

This will give you a url. You now have a Slackbot living in the cloud!

## Usage
You can either mention `@portnamer` in a channel after you invite it, or DM it directly. Start by saying either `hi` or `help`.

## TODO
- [ ] Get random port intent - need to conversationalize it
- [ ] Use NLP service instead of Regex


## Contributions
There's so many ways to make this better and I have little time to work on it. If you like it and might think of using it for fun or productivity, you should contribute!

Thank you! :)
