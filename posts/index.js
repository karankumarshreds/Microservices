const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, title 
    };
    //send the event to event bus as well
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    });
    res.status(200).send(posts[id]);
});

//recieve events from event-bus
app.post("/events", (req, res) => {
    console.log('Recieved events ***********', 
    req.body.type);
    res.send({});
});
 
app.listen(4000, () => {
    console.log("new version")
    console.log("posts on 4000");
});   