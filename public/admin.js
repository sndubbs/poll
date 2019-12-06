/*global Vue axios */
var app = new Vue({
    el: '#admin',
    data: {
        question: "",
        answered: '',
        file: null,
        addSurvey: null,
        surveys: [{
            responses: []
        }],
        findQuestion: "",
        findSurvey: "",
        newSurvey: "",
        addR: "",
        name: "",
        upvote: "",

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
        async upload() {
            try {
                let r1 = await axios.post('/api/surveys', {
                    question: this.question,
                    answered: this.answered,
                });
                this.addSurvey = r1.data;
            }
            catch (error) {
                console.log(error);
            }
        },
        async addResponse(survey) {

            try {
                console.log("adding resoponse");
                console.log(survey);
                console.log(survey.responses.name)
                let r1 = await axios.put('/api/surveys/' + survey._id, {
                    name: this.name,
                    upvote: this.upvote
                });
                this.addR = r1.data;
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
                console.log(this.surveys);
                let respond = await axios.get("/api/surveys");
                this.surveys = respond.data;
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
        async upAnswered(survey) {
            try {
                console.log(survey);
                let respond = await axios.put("/api/surveys/" + survey._id, {
                    answered: survey.answered,
                });
                this.findSurvey = null;
                this.getSurveys();
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },
        submitResponse() {
            console.log("Submitting Response");
            for (var survey of this.surveys) {
                if (survey.selected) {
                    console.log(survey);
                    this.upAnswered(survey);
                }
            }
        }
    }
})
