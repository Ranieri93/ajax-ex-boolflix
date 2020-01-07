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
    var sources  = $("#film-template").html();
    var templates = Handlebars.compile(sources);

    //secondo Handlebars selcet
    var source   = $("#select-template").html();
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
            tmdbApiCall(inputValue,'search/tv');
            tmdbApiCall(inputValue,'search/movie');
        };
        // mi resetto il value per far scomparire il teso una volta cliccato invio:
        var inputValue = $('#searchInput').val('');
    };


    function tmdbApiCall (query, endPoint) {

        var dataAjax = {api_key: apiKey}
        // avendo scritto una chiamata ajax sola, vado a definirmi l'endpoint che mi reindirizza sul'url giusto.
        // pongo questa condizione perchè così nel caso in cui venga soddisfatta l'if al data vengano inserite informazioni aggiuntive:
        if (endPoint.includes('search')) {
            dataAjax.query = query;
            dataAjax.language = 'it-IT';
        }
        // vado ad effettuare la chiamata ajax:
        $.ajax({
            'url': apiUrlBase + endPoint,
            'data': dataAjax,
            'method': 'GET',
            'success': function (data) {
                if (endPoint.includes('search')) {
                    if (data.total_results > 0) {
                        getMyInfosFromApi(data);
                    }
                } else if (endPoint.includes('credits')) {
                    getMyCastFromApi(data);
                } else {
                    getMyGenresFromApi(data);
                }
                // console.log(data);
            },
            'error': function() {
                alert('error');
            }
        });
    };

    //funzione repuerare il cast
    function getMyCastFromApi (array) {
        // recupero l'id:
        var idSubject = array.id;
        // scorro l'array col for per recuperarmi tutti i nomi:
        var castSubject = array.cast;
        // dato che devo concatenare delle stringhe mi inizializzo una variabile vuota:
        var listacast = '';
        for (var i = 0; i < castSubject.length; i++) {
            var subjectI = castSubject[i]
            var nameSubject = subjectI.name;
            if (i < 5) {
                listacast += nameSubject  + ', ' ;
            }
        };

        $('.card-film[data-id="' + idSubject + '"]').find('.cast').text('Cast: ' + listacast)
    };

    // funzione per recuperare il genere

    function getMyGenresFromApi(array) {
        var subject = array.genres;
        for (var i = 0; i < subject.length; i++) {

            var idGenres = subject[i].id;
            var nameGenres = subject[i].name;

            console.log(idGenres);
            console.log(nameGenres);

            // creo il template per le variabili di handlebars:
            var templateVariabili = {
                genres: nameGenres,
                idGenre: idGenres
            }

            // infine faccio append:
            var htmlGenres = template(templateVariabili);
            $('#pickGenre').append(htmlGenres);
        }



    }

    // creo una funzione che mi permetta di generalizzare la ricerca:
    function getMyInfosFromApi (array) {
        var subject = array.results;
        for (var i = 0; i < subject.length; i++) {
            var subjcetI = subject[i]
            // vado a vedere se esiste la proprietà title, se non esiste, vuol dire che è una serie, e quindi cambia la dot notation
            // mi definisco l'id prima altrimenti la condizione successiva non avrebbe senso:
            var idSubject = subject[i].id;
            // ho definito l'endPoint della chiamata ajax per il cast, perchè solo all'interno di questa funzione avevo la variabile con l'id del soggetto:
            if (subjcetI.hasOwnProperty('title')) {
                var titleSubject = subject[i].title;
                var endPointCast = 'movie/' + idSubject + '/credits';
                var endPointGenres = 'genre/movie/list';

            } else {
                var titleSubject = subject[i].name;
                var endPointCast = 'tv/' + idSubject + '/credits';
                var endPointGenres = 'genre/tv/list';
            }

            if (subjcetI.hasOwnProperty('original_title')) {
                var originalTitleSubject = subject[i].original_title;
            } else {
                var originalTitleSubject = subject[i].original_name;
            }

            var languegeSubject = subject[i].original_language;
            var voteSubject = subject[i].vote_average;
            // controllo sulla presenza o meno delle img nell'api, così da mettere una 404 nel caso non siano disponibili:
            if (subject[i].poster_path == null) {
                var linkImg = "img/err.jpg";

            } else {
                var posterSubject = subject[i].poster_path;
                var linkImg = apiUrlImg + 'w342' + posterSubject;
            }
            // mi recupero l'overview

            if (overviewSubject == '') {
                var classe = 'hidden';
            }

            var overviewSubject = subject[i].overview;

            var idGenresSubject = subject[i].genre_ids;

            // creo il template per le variabili di handlebars:
            var templateVariables = {
                id: idSubject,
                posterImg: linkImg,
                title: titleSubject,
                originalTitle: originalTitleSubject,
                language: flagLanguage(languegeSubject),
                vote: starVote(voteSubject),
                overview: overviewSubject,
                overviewClass: classe,
                genresId: idGenresSubject
            }

            // infine faccio append:
            var htmlFilm = template(templateVariables);
            $('.container').append(htmlFilm);
            // vado a fare la seconda chiamata ajax all'interno della ricerca della prima, questo perchè altrimenti non sarei in grado di utilizzare la variabile endpoint:
            // il problema però sta nella gestione delle chiamate
            tmdbApiCall ('', endPointCast);

            tmdbApiCall ('', endPointGenres);

        }
    };


    // Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
    // permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
    // lasciando le restanti vuote (troviamo le icone in FontAwesome)

    function starVote (number) {
        //trasformo il numero in uno tra 1 e 5
        var roundedNumber = Math.round(number / 2);
        // al valore del numero, corrisponderanno stelle piene: quindi icone di FA.
        // mentre quelle vuote saranno rispettivamente 5 - numero
        var fullStar = '<i class="fas fa-star"></i>';
        var emptyStar = '<i class="far fa-star"></i>';

        return fullStar.repeat(roundedNumber) + emptyStar.repeat(5 - roundedNumber);
    };

    function starVoteFor (nStelline) {
        // alternativa con un for:
        // ne dovrò avere sempre 5, n piene e 5-n vuote.
        // uso for per 5 star:
        // inizializzo la stringa vuota di modo da poterci aggiungere le mie stringhe/stars:
        var stars = '';
        for (var i = 0; i < 5; i++) {
            // tramite la i capisco a che stellina sono
            if (i < nStelline) {
                // nStelline saranno piene,
                stars += '<i class="fas fa-star"></i>';
            } else {
                // nStelline vuote:
                stars += '<i class="far fa-star"></i>';
            }
            // fino a che il n di stars è minore di i le mette piene, poi mi aggiungo le stelle vuote
            return stars;
        };
    }

    // Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API.

    // mi creo un'altra funzione che mi permetta di gestire i casi delle lingue più conosciute:

    function flagLanguage (input) {
        //creo dei casi in cui al variare del valore dell'inpput, mi cambi anche la relativa icona:
        if (input == 'en') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/united_kingdom_flags_flag_17079.png" alt="ENG">'
        } else if (input == 'it') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/italy_flags_flag_17018.png" alt="ITA">'
        } else if (input == 'de') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/germany_flags_flag_17001.png" alt="DE">'
        } else if (input == 'es') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/spain_flags_flag_17068.png" alt="ES">'
        } else if (input == 'fr') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/france_flags_flag_16999.png" alt="FR">'
        } else if (input == 'zh') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/china_flags_flag_16985.png" alt="ZH">'
        } else if (input == 'pt') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/portugal_flags_flag_17054.png" alt="PT">'
        } else if (input == 'ja') {
            return '<img src="https://icon-icons.com/icons2/97/PNG/32/japan_flags_flag_17019.png" alt="JA">'
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
        selectedPosterCard.addClass('hidden')
        selectedTextCard.addClass('active')
    });

    $(document).on('mouseleave', '.card-film', function(){
        // mi seleziono i soggetti corretti con cui lavorare
        var selectedPosterCard = $(this).children('img');
        var selectedTextCard = $(this).children('ul');
        // pongo le conzioni
        selectedPosterCard.removeClass('hidden')
        selectedTextCard.removeClass('active')
    });


    //Creare una lista di generi richiedendo quelli disponibili all'API e creare dei filtri con i generi tv e movie per mostrare/nascondere le schede ottenute con la ricerca.

    //trovare nell'api DOVE sono ubicati i genere
    // ci sono due diverse destinazioni per i generi dei film e delle serie:
    // Movies: /genre/movie/list
    // TV: /genre/tv/list
    // capire come estrapolarli
    // dove inserirli

});
