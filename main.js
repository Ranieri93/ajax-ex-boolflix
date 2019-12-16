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
    // l'evento del richiamo ajax sarà un keypress dell'inivio,
    $('#searchInput').keypress(function(event) {
        if(event.which == 13) {
            $('.container').text('');
            imdbApiCall();
        }
    });
    // la stessa funzione la richiamo con il click:
    $('#searchButton').click(function() {
        $('.container').text('');
        imdbApiCall();
    })

    // definisco una funzione per la chiamata API
    function imdbApiCall () {
        // mi vado a recuperare il value dell'input
        var inputValue = $('#searchInput').val();
        // Adesso devo cercare tramite la libreria api tutti i film che hanno una corrispondenza con il value inserito dall'utente:
        // definisco la variabile url:
        var apiUrlBase = 'https://api.themoviedb.org/3/';
        // vado ad effettuare la chiamata ajax:
        $.ajax({
            'url': apiUrlBase + 'search/movie',
            'data': {
                'api_key': '08c1066e89bef9e87a45652373f1ec85',
                // sostituisco nel query il value dell'input:
                'query': inputValue,
                'language': 'it-IT',
                'dataType': 'jsonp'
            },
            'method': 'GET',
            'success': function (data) {
                getMyInfos(data);
            },
            'error': function() {
                alert('error');
            }
        });
        // mi resetto il value per far scomparire il teso una volta cliccato invio:
        var inputValue = $('#searchInput').val('');
    }

    // creo una funzione che mi permetta di generalizzare la ricerca:
    function getMyInfos (array) {
        var subject = array.results;
        for (var i = 0; i < subject.length; i++) {
            var titleSubject = subject[i].title;
            var originalTitleSubject = subject[i].original_title;
            var languegeSubject = subject[i].original_language;
            var voteSubject = subject[i].vote_average;

            $('.container').append('<ul><li> Titolo Film: ' + titleSubject + '</li><li> Titolo Originale:' + originalTitleSubject + '</li><li> Lingua Originale: ' + languegeSubject + '</li><li> Voto Critica: ' + voteSubject + '</li></ul>');
        }
    };
});
