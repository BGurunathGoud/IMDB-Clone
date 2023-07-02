// API Search link: http://www.omdbapi.com/?s=spiderman&apikey=2dd9f93a
// Details of API link: http://www.omdbapi.com/?i=tt3896198&apikey=2dd9f93a
const key = '2dd9f93a';
var inputSearch = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('mylist-container');
fetch('http://www.omdbapi.com/?i=tt3896198&apikey=2dd9f93a')
    .then(res => res.json())
    .then(data => console.log(data));

// When user presses on Key then the searchMovies function is initiated
inputSearch.addEventListener('input', searchMovies);

async function MovieDetail() {
    // Finding id of a movie using link
    var queryUrlParam = new URLSearchParams(window.location.search);
    var id = queryUrlParam.get('id')
    console.log(id);
    const link = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${link}`);
    const data = await res.json();
    console.log(data);
    console.log(link);

    //Using string interpolition making movieCard for HTML.
    var movieCard = `
    <div class="film-poster">
        <img src=${data.Poster} alt="Film Poster">
    </div>
    <div class="film-detail">
        <div class="detail-head">
            <div class="div-h2">
                <h2>${data.Title}</h2>
            </div>
            <div class="div-heart">
            <i class="fa-regular fa-heart fa-beat" onClick=addToMyList('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italic-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 16px; font-weight: 700;">${data.imdbRating}</span>/10 </i></span>
        <ul class="detail-list">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="detail-list">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 16px; margin-top:15px;">${data.Plot}</p>
        <p style="font-size: 20px; font-style: oblique; color: yellowgreen; margin-top: 12px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `
    //MovieCard Append's here..
    document.querySelector('.film-container').innerHTML = movieCard

}

async function addToMyList(id) {
    console.log("mylist-item", id);

    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);// Math.random is used for unique key and value pair
    alert('!..Movie is Added to My List Successfully..!');
}

//Deleting the movie from MyList and also from the local-storage
async function deleteFromMyList(id) {
    console.log(id);
    for (i in localStorage) {
        //It removes the movie which match's the Passed ID.with any other key value in it.1 
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    //Alert's the user for deleting the movie from MyList and refresh's the page
    alert('Movie is deleted from My List...');
    window.location.replace('myList.html');
}

//Display's the movie list on Search page as per search item in list.
async function movieListDisplay(Movies) {
    var movieCard = '';
    for (i of Movies) {
        var img = '';
        if (i.Poster != 'N/A') {
            img = i.Poster;
        }
        else {
            img = 'images/Movie-Not-Found.jpg';
        }
        var id = i.imdbID;

        //Using string interpolition append's the moviecard.
        movieCard += `

        <div class="mylist-item">
            <div class="mylist-poster">
            <a href="movies.html?id=${id}"><img src=${img} alt="favourite Poster"></a>
            </div>
            <div class="mylist-detail">
                <div class="mylist-detail-box">
                    <div>
                        <p class="mylist-film-name"><a href="movies.html?id=${id}">${i.Title}</a></p>
                        <p class="mylist-film-rating"><a href="movies.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                    <i class="fa-regular fa-heart fa-beat" style="cursor:pointer;" onClick=addToMyList('${id}')></i>
                    </div>
                </div>
            </div>
        </div>`
    }

    //Appending this to the film-display class of our html page
    document.querySelector('.mylist-container').innerHTML = movieCard;
    console.log("My Favorite list...", Movies);
}


//When the user is searching for the movie then a list of the related movie will be displayed and that list is fetched
async function searchMovies() {
    const link = `https://www.omdbapi.com/?s=${(inputSearch.value).trim()}&page=1&apikey=${key}`
    const res = await fetch(`${link}`);
    const data = await res.json();

    if (data.Search) {
        //Calling the function to display list of the movies related to the user search
        movieListDisplay(data.Search)
    }
}

//Favorites movies are loaded on to the fav page from localstorage
async function myListMovieLoader() {
    var movieCard = ''
    //Traversing all over movies into the localstorage
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
            //Fetch's the movie by id 
            const link = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${link}`);
            const data = await res.json();
            console.log(data);

            var img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { img = data.Title }
            var Id = data.imdbID;

            //Add's all the movie details in html in the movieCard using interpolition
            movieCard += `
        
        <div class="mylist-item">
            <div class="mylist-poster">
                <a href="movies.html?id=${id}"><img src=${img} alt="favourites Poster"></a>
            </div>
            <div class="mylist-detail">
                <div class="mylist-detail-box">
                    <div>
                        <p class="mylist-film-name">${data.Title}</p>
                        <p class="mylist-film-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash-can fa-beat" style="cursor:pointer;" onClick=deleteFromMyList('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>
        
       `;
        }
    }
    //Append's the html to the movie-display class in MyList page 
    document.querySelector('.mylist-container').innerHTML = movieCard;
}