const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handeEvent =  (type, data) => {
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
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    // deconstrucing data coming from posts
    // and comments through the event bus
    const { type, data } = req.body;
    handeEvent(type, data);
    res.send({}); 
});

app.listen(4002, async () => {
    console.log("query on 4002");
    // sync code in case this service goes down it will 
    // retrieve all the missed out posts 
    const res = await axios.get('http://event-bus-srv:4005/events');
    for(let event of res.data) {
        console.log('Processing events', event.type);
        handleEvent(event.type, event.data);
    };
});

