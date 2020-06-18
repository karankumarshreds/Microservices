const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const id = req.params.id;
    const { content } = req.body;
    //get if comments exist for post or get blank array
    const comments = commentsByPostId[id] || [];
    comments.push({ id: commentId, content: content});
    //asign updated array to commentsByPostId
    commentsByPostId[id] = comments;
    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log('Listening on 4001');
})