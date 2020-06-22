const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//db of its own
const events = [];


app.post('/events', (req,res) => { 
    const event = req.body;

    events.push(event);

    axios.post('http://localhost:4000/events', event);
    axios.post('http://localhost:4001/events', event);
    axios.post('http://localhost:4002/events', event);
    axios.post('http://localhost:4003/events', event);

    res.send({status: "OK"});
});

app.get("/events", (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('event-bus on 4005');
});