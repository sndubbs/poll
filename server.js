const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/questions', {
    useNewUrlParser: true
});

var QuestionSchema = new mongoose.Schema({
    name: String,
    response: String,
    comments: {type: Number, default: 0},
});

const Question = mongoose.model('Question', QuestionSchema);

app.post('/api/questions', async(req, res) => {
    const question = new Question({
        name: req.body.name,
    });
    try {
        console.log("Post question");
        console.log(question);
        await question.save();
        res.send(question);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/questions', async (req, res) => {
    try {
        let questions = await Question.find();
        res.send(questions);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/questions/:id', async (req, res) => {
    try{
        console.log("delete question");
        console.log(Question);
        await Question.deleteOne({_id: req.params.id});
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/questions/:id', async (req, res) => {
    try {
        console.log("upcomment");
        let question = await Question.findOne({_id: req.params.id});
        console.log(question.comments);
        question.comments += 1;
        await question.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));