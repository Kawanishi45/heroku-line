'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const bodyParser = require('body-parser');

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
app.setHeader('Access-Control-Allow-Origin: *')

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };

    // use reply API
    return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/test', (req, res) => {
    console.log(req.body);
    if (req.body.messageText) {
        broadcast(req.body.messageText);
        res.send('POST requested to test');
    } else {
        res.send('error: Not exist messageText');
    }
});

const broadcast = async (messageText) => {
    const messages = [{
        type: 'text',
        text: messageText
    }];

    try {
        const res = await client.broadcast(messages);
        console.log(res);
    } catch (err) {
        console.error(err);
    }
}
