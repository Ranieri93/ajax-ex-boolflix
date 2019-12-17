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
    var apiUrlImg = 'https://image.tmdb.org/t/p/'

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
            var originalTitleSubject = subject[i].original_title;

            if (titleSubject.length > 0) {
                var titleSubject = subject[i].title;
            } else if (originalTitleSubject.lenght > 0) {
                var originalTitleSubject = subject[i].original_title;
            } else {
                var titleSubject = subject[i].name;
                var originalTitleSubject = subject[i].original_name;
            }


            // var originalNameSubject = subject[i].original_name;
            var languegeSubject = subject[i].original_language;
            var voteSubject = subject[i].vote_average;
            var posterSubject = subject[i].poster_path;
            var overviewSubject = subject[i].overview;
            // creo il template per le variabili di handlebars:
            var templateVariables = {
                posterImg: apiUrlImg + 'w342' + posterSubject,
                title: titleSubject,
                // name: originalNameSubject,
                originalTitle: originalTitleSubject,
                // originalName: originalNameSubject,
                language: flagLanguage(languegeSubject),
                vote: starVote(voteSubject),
                overview: overviewSubject
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

        return fullStar.repeat(rounderNumber) + emptyStar.repeat(5 - rounderNumber)
    };

    // Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API.

    // mi creo un'altra funzione che mi permetta di gestire i casi delle lingue più conosciute:

    function flagLanguage (input) {
        //creo dei casi in cui al variare del valore dell'inpput, mi cambi anche la relativa icona:
        if (input == 'en') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/united_kingdom_flags_flag_17079.png" alt="">'
        } else if (input == 'it') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/italy_flags_flag_17018.png" alt="">'
        } else if (input == 'de') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/germany_flags_flag_17001.png" alt="">'
        } else if (input == 'es') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/spain_flags_flag_17068.png" alt="">'
        } else if (input == 'fr') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/france_flags_flag_16999.png" alt="">'
        } else if (input == 'zh') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/china_flags_flag_16985.png" alt="">'
        } else if (input == 'pt') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/portugal_flags_flag_17054.png" alt="">'
        } else if (input == 'ja') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/japan_flags_flag_17019.png" alt="">'
        } else {
            return input
        };
    };

    // adesso devo gestire il l'hover sulle card con le foto:
    // mi vado a intercettare l'evento sulle card
    $(document).on('mouseover', '.card-film', function(){
        // mi seleziono i soggetti corretti con cui lavorare
        var selectedPosterCard = $(this).children('img');
        var selectedTextCard = $(this).children('ul');
        // pongo le conzioni
        selectedPosterCard.toggleClass('hidden')
        selectedTextCard.toggleClass('active')
    });

});
