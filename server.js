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
    upvote: {type: Number, default: 0},
}); 

const Response = mongoose.model('Response', ResponseSchema);

var SurveySchema = new mongoose.Schema({
    question: String,
    responses: [ResponseSchema],
    answered: {type: Number, default: 0},
});

const Survey = mongoose.model('Survey', SurveySchema);

app.post('/api/surveys', async(req, res) => {
    const survey = new Survey({
        question: req.body.question,
    });
    try {
        console.log("Post survey");
        console.log(survey);
        await survey.save();
        res.send(survey);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/surveys', async (req, res) => {
    try {
        let surveys = await Survey.find();
        res.send(surveys);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/surveys/:id', async (req, res) => {
    try {
        console.log(req.params._id);
        console.log("delete survey");
        console.log(Survey);
        await Survey.deleteOne({_id: req.params.id});
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/*app.put('/api/surveys/:id', async (req, res) => {
    try {
        console.log("upcomment");
        let survey = await Survey.findOne({_id: req.params.id});
        console.log(survey.answered);
        survey.answered += 1;
        await survey.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});*/

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
app.put('/api/surveys/:id', async (req, res) => {
    try {
        console.log("add response option");
        let survey = await Survey.findOne({_id: req.params.id});
        console.log(req.body.name);
        survey.responses.push({name: req.body.name});
        await survey.save();
        console.log(survey);
        console.log(survey.responses[0].name);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));