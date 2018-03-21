var request = require('request');
var sets='', table = {};
exports.GetSets = function (user, callback) {
    request.get({
        uri: 'https://api.quizlet.com/2.0/users/' + user + '/sets?client_id={CLIENT_ID}',
    },
        function (error, response, body) {          
            if (error)
                callback(error);
            else {
                body = JSON.parse(body);
                for (var x = 0; x < body.length; x++) {
                    if ((x + 1) == body.length) {
                        sets = sets + body[x].title;
                    } else {
                        sets = sets + body[x].title + ', ';
                    }
                    table[body[x].title] = body[x].id;          
                }
                
                console.log('got sets');           
                exports.Sets = sets;
            }
        })
}

exports.GetTerms = function (key, callback) {
    var terms=[], def=[];    
    key = key == 1 ? 'Typescript' : 'OOPS concepts';
    request.get({
        uri: 'https://api.quizlet.com/2.0/sets/' + table[key] + '?client_id={CLIENT_ID}',
    },
        function (error, response, body) {
            if (error)
                console.log(error);
            else {
                body = JSON.parse(body);
                console.log(body);
                for (var x = 0; x < body.terms.length; x++) {
                    terms.push(body.terms[x].term)
                    def.push(body.terms[x].definition);
                }
                console.log('Got terms');
                exports.Terms = terms;
                exports.Def = def;
            }
        })
}