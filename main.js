// Creare un layout base con una searchbar (una input e un button) in cui possiamo
// scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il
// bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto


$(document).ready(function(){

    // definisco la variabile url:
    var apiUrlBase = 'https://api.themoviedb.org/3/';
    var apiKey = '08c1066e89bef9e87a45652373f1ec85';

    // l'evento del richiamo ajax sarà un keypress dell'inivio,
    $('#searchInput').keypress(function(event) {
        if(event.which == 13) {
            newCall();
        }
    });
    // la stessa funzione la richiamo con il click:
    $('#searchButton').click(function() {
        newCall();
    })

    // richiamo la funzione di handlebars:
    var source   = $("#film-template").html();
    var template = Handlebars.compile(source);

    // definisco una funzione per la chiamata API
    function newCall () {
        // mi vado a recuperare il value dell'input
        var inputValue = $('#searchInput').val();
        // Adesso devo cercare tramite la libreria api tutti i film che hanno una corrispondenza con il value inserito dall'utente:
        // controllo se effetivamente ho scritto qualcosa, così da chiamare l'api solo nel caso in cui il testo esiste nell'input
        if (inputValue.length != 0) {
            // svuoto prima il div e poi, tutto il resto:
            $('.container').empty();
            imdbApiCallMovies(inputValue);
            imdbApiCallTvSeries(inputValue);
            // mi resetto il value per far scomparire il teso una volta cliccato invio:
        };
        var inputValue = $('#searchInput').val('');
    };

    function imdbApiCallMovies (search) {
        // vado ad effettuare la chiamata ajax:
        $.ajax({
            'url': apiUrlBase + 'search/movie',
            'data': {
                'api_key': apiKey,
                // sostituisco nel query il value dell'input:
                'query': search,
                'language': 'it-IT'
            },
            'method': 'GET',
            'success': function (data) {
                getMyInfosFromApi(data);
            },
            'error': function() {
                alert('error');
            }
        });
    };

    function imdbApiCallTvSeries (search) {
        // vado ad effettuare la chiamata ajax:
        $.ajax({
            'url': apiUrlBase + 'search/tv',
            'data': {
                'api_key': apiKey,
                // sostituisco nel query il value dell'input:
                'query': search,
                'language': 'it-IT'
            },
            'method': 'GET',
            'success': function (data) {
                getMyInfosFromApi(data);
            },
            'error': function() {
                alert('error');
            }
        });
    };


    // creo una funzione che mi permetta di generalizzare la ricerca:
    function getMyInfosFromApi (array) {
        var subject = array.results;
        for (var i = 0; i < subject.length; i++) {
            var titleSubject = subject[i].title;
            var nameSubject = subject[i].name;
            var originalTitleSubject = subject[i].original_title;
            var originalNameSubject = subject[i].original_name;
            var languegeSubject = subject[i].original_language;
            var voteSubject = subject[i].vote_average;
            // creo il template per le variabili di handlebars:
            var templateVariables = {
                title: titleSubject,
                name: nameSubject,
                originalTitle: originalTitleSubject,
                originalName: originalNameSubject,
                language: languegeSubject,
                vote: starVote(voteSubject),
            }
            // infine faccio append:
            var htmlFilm = template(templateVariables);
            $('.container').append(htmlFilm);

        }
    };


// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
// permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome)

    function starVote (number) {
        //trasformo il numero in uno tra 1 e 5
        var rounderNumber = Math.round(number / 2);
        // al valore del numero, corrisponderanno stelle piene: quindi icone di FA.
        // mentre quelle vuote saranno rispettivamente 5 - numero
        var fullStar = '<i class="fas fa-star"></i>';
        var emptyStar = '<i class="far fa-star"></i>';

        return (fullStar * rounderNumber) + [(5 - rounderNumber) * emptyStar];




    };

});
