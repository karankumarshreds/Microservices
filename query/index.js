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
        const {  id, content, postId, status } = data;
        // get the post of the associated comment
        // and push this comment(id) to it's list 
        const post = posts[`${postId}`];
        post.comments.push({ id, content, status });
    };
    if(type === 'CommentUpdated') {
        const { id, postId, status, content } = data;
        // get post with postId 
        const post = posts[`${postId}`];
        // find comment which is updated
        const comment = post.comments.find(each => {
            return each.id === id;
        });
        // set it's status to incoming status 
        comment.status = status;
    };
    res.send({}); 
});

app.listen(4002, () => {
    console.log("query on 4002");
});

