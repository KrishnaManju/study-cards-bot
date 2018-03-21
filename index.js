var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PROT || 3978, function() {
    console.log("%s listening to the port %s", server.name, server.url);
});
var connector = new builder.ChatConnector({
    appID: process.env.MY_APP_ID ,
    appPassword:process.env.MY_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var username = 'krishna_manju';
    var quiz = require('./api.js');
    var index = 0;


    (function () {
        if (username)
            quiz.GetSets(username);   // I will invoke myself
    })();

    bot.dialog('/',function (session) {
            session.send("Hello! Welcome to the Quiz Bot. Would you like to study today?")
            session.beginDialog('/user');
        });

    bot.dialog('/user', new builder.IntentDialog()
        .matches(/^yes/i, [
            function (session) {
            if (username)
                session.beginDialog('/subject')
            else {
                builder.Prompts.text(session, "What is your quizlet username?")
            }
        },
        function (session, results) {
            quiz.GetSets(results.response);
            session.beginDialog('/subject')
        }])
        .matches(/^no/i, function(session){
            session.send("Ok see ya later!")
            session.endConversation;
        }));


    bot.dialog('/subject', [
            function (session) {
                let setArray = [], options = '';
                let i = 0;
                if(quiz.Sets != null) {
                    setArray = quiz.Sets.split(',');
                    for(let set of setArray){
                        i++;
                        options += i + '.'+ set + ' ';
                    }
                }
                builder.Prompts.text(session, "What study set would you like today? \n " + options);
            },
            function (session, results) {
                quiz.GetTerms(results.response);
                session.send("Ok! I got your flashcards! Send 'ready' to begin. Send 'flip' for definition. Send 'next' for the next card. Send 'exit' when you are done")
                session.beginDialog('/study')
            }]
    );

    bot.dialog('/study', new builder.IntentDialog()
        .matches(/^ready/i, [
            function (session) {
                session.send(quiz.Terms[index])
            }])
        .matches(/^flip/i, [
            function (session) {
                session.send(quiz.Def[index])
            }]
        )
        .matches(/^next/i, [
            function (session) {
                if (++index == quiz.Terms.length)
                    session.send("You are all out of cards! Hope you had fun studying! :)")
                else
                    session.send(quiz.Terms[index])
            }])
         .matches(/^exit/i, [
            function (session) {
                session.send("Hope you had fun studying. See ya later :)")
            }]
        )

    );