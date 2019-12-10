const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/surveys', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var ResponseSchema = new mongoose.Schema({
    name: String,
    votes: { type: Number, default: 0 },
});

const Response = mongoose.model('Response', ResponseSchema);

var SurveySchema = new mongoose.Schema({
    question: String,
    responses: [ResponseSchema], //TODO: perhaps change this to simply a JSON object instead of a schema
    answer: { type: String, default: "none" },
    answered: { type: Number, default: 0 },
});



const Survey = mongoose.model('Survey', SurveySchema);

//SURVEY

app.post('/api/surveys', async(req, res) => {
    //ADD A NEW QUESTION
    const survey = new Survey({
        question: req.body.question,
    });
    try {
        console.log("Post survey");
        console.log(survey);
        await survey.save();
        res.send(survey);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/surveys', async(req, res) => {
    //GET ALL QUESTIONS
    try {
        let surveys = await Survey.find();
        res.send(surveys);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/surveys', async(req, res) => {
    console.log("IN THE UPDATE PUT");
    try {
        //UPDATE QUESTION AFTER SUBMITTING A SURVEY
        console.log(req.body);
        let survey = await Survey.findOne({question: req.body.question });

        //replace values with new ones
        survey.responses = req.body.responses;
        survey.answered = req.body.answered;

        //save database
        await survey.save();
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }



});

//QUESTIONS

app.delete('/api/surveys/:id', async(req, res) => {
    //DELETE A QUESTION
    try {
        console.log(req.params._id);
        console.log("delete survey");
        console.log(Survey);
        await Survey.deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/surveys/:id', async(req, res) => {
    try {
        //ADD A RESPONSE TO A QUESTION
        console.log("add response option");
        let survey = await Survey.findOne({ _id: req.params.id });
        console.log("The new name before adding: " + req.body.name);
        survey.responses.push({ name: req.body.name });
        await survey.save();
        console.log(survey);
        console.log("The new name: " + survey.responses[0].name);
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

/*

/*app.put('/api/surveys/:id/responses', async (req, res) => {
    try {
        console.log("upvote a response");
        let survey = await Survey.findOne({_id: req.params.id});
        var response = survey.responses.id({_id: req.params.id});
        response.upvote += 1; 
        await response.save();
        await survey.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
*/
