const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const id = req.params.id;
    const { content } = req.body;
    //get if comments exist for post or get blank array
    const comments = commentsByPostId[id] || [];
    comments.push({ id: commentId, content: content, status: 'pending' });
    //asign updated array to commentsByPostId
    commentsByPostId[id] = comments;
    //send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: { 
            id : commentId,
            content,
            postId: id,
            status: 'pending'
        }
    });
    res.status(201).send(comments);
});

// recieve events from event-bus
app.post("/events", async (req, res) => {
    console.log('Recieved events ***********', 
    req.body.type);
    const { type, data } = req.body;
    if(type === 'CommentModerated') {
        const { id, postId, content, status } = data; 
        // get all comments of a post
        const comments = commentsByPostId[`${postId}`];
        // get comment we need to update
        const comment = comments.find(each => {
            return each.id === id;
        });
        comment.status = status;
        // update the event bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, status, postId, content
            }
        });
    };
    res.send({});
});

app.listen(4001, () => {
    console.log('comments on 4001');
});