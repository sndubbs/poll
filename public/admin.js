/*global Vue axios */
var app = new Vue({
    el: '#app',
    data: {
        newQuestion: "",
        surveys: [],
        answer: "",
    },
    created() {
        this.getSurveys();
    },
    computed: {
        suggestions() {
            return this.surveys.filter(survey => survey.question.toLowerCase().startsWith(this.findQuestion.toLowerCase()));
        }
    },
    methods: {
        fileChanged(event) {
            this.file = event.target.files[0];
        },
        async addSurvey() {
            //ADD A NEW SURVEY
            try {
                await axios.post('/api/surveys', {
                    question: this.newQuestion,
                    answered: 0,
                });
                this.getSurveys(); //refresh the screen with the new survey
            }
            catch (error) {
                console.log(error);
            }
        },
        async addResponse(survey) {

            try {
                console.log("adding response");
                console.log("survey: " + survey);
                console.log("survey response name: " + survey.responses.name)
                await axios.put('/api/surveys/' + survey._id, {
                    name: survey.responses.name,
                    upvote: 0
                });
                this.findSurvey = null;
                this.getSurveys();
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },
        async getSurveys() {
            try {
                console.log("Fetching survey");
                let response = await axios.get("/api/surveys");
                this.surveys = response.data;
                console.log(this.surveys);
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },
        selectSurvey(survey) {
            this.findQuestion = "";
            this.findSurvey = survey;
        },
        async deleteSurvey(survey) {
            try {
                console.log(survey._id);
                let respond = axios.delete("/api/surveys/" + survey._id);
                this.findSurvey = null;
                this.getSurveys();
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },
        async submitSurvey() {
            console.log("Submitting Responses...");
            //surveys = questions
            for (var question of this.surveys) {
                if (question.answer != "none") {
                    console.log(question.question + ": " + question.answer);
                    
                    question.answered += 1;
                    question.responses.forEach(function(response){
                        if(response.name == question.answer){
                            response.votes += 1;
                        }
                    });

                    try {
                        await axios.put("/api/surveys/", question);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }

        }
    }
});
