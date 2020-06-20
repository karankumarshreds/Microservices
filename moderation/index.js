const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express(); 
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type == 'CommentCreated') {
        // we need to flag comment if it 
        // contains the keyword orange
        const status = data.content.includes('orange') ? 'rejected' : 'approved'; 
        // update the event bus 
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                ...data, status: status
            }
        });
    }
    res.send({});
});

app.listen(4003, () => {
    console.log('moderation on 4003');
});