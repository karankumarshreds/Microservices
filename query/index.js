const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    // deconstrucing data coming from posts
    // and comments through the event bus
    const { type, data } = req.body;
    if(type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = {
            id : id,
            title: title,
            comments: []
        };
    };
    if(type === 'CommentCreated') {
        const {  id, content, postId } = req.body.data;
        // get the post of the associated comment
        // and push this comment(id) to it's list 
        const post = posts[`${postId}`];
        post.comments.push({ id, content });
    };
    res.send({});
});

app.listen(4002, () => {
    console.log("listening on 4002");
});

