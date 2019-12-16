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

    // vado ad effettuare la chiamata ajax:
    // definisco la variabile url:






    //
    // l'evento del richiamo ajax sarà un keypress dell'inivio,
    $('#searchInput').keypress(function(event) {
        // mi vado a recuperare il value dell'input
        var inputValue = $('#searchInput').val();
        if(event.which == 13) {
            // Adesso devo cercare tramite la libreria api tutti i film che hanno una corrispondenza con il value inserito dall'utente:

            var apiUrlBase = 'https://api.themoviedb.org/3/';

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
                'success': function(data) {
                    var film = data.results;
                    for (var i = 0; i < film.length; i++) {
                        var titoloFilm = film[i].title;
                        console.log('titolo film: ' + titoloFilm);
                        var titoloOriginale = film[i].original_title;
                        console.log('titolo originale: ' + titoloOriginale);
                        var linguaFilm = film[i].original_language;
                        console.log('lingua originale: ' + linguaFilm);
                        var votoFilm = film[i].vote_average;
                        console.log('voto film: ' + votoFilm);
                        $('.container').append('<ul><li> Titolo Film: ' + titoloFilm + '</li><li> Titolo Originale:' + titoloOriginale + '</li><li> Lingua Originale: ' + linguaFilm + '</li><li> Voto Critica: ' + votoFilm + '</li></ul>');
                    }
                },
                'error': function() {
                    alert('error');
                }
            });

        }
    });
});
