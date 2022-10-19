// creating constant variables
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=f1e6e478`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True") displayMovieList(data.Search);
}

// function to search movies
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// function to display movie list in search bar
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

// getting search result by using fetch request
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=f1e6e478`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

// function to display movie details in the result content section
function displayMovieDetails(details){

    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "../resource/image_not_found.png"}" alt = "movie poster">
    </div>
    
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <button type ="button" class="add-movie-to-list"  id="${details.imdbID}" onclick="addingMovieToList(${details.imdbID})">Add to Favourites &nbsp
              <i class="fas fa-plus"></i>
        </button>
        
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>

        <p class = "Runtime"><b>Runtime:</b> ${details.Runtime}</p>
        <p class = "imdbRating"><b>IMDB:</b> ${details.imdbRating}&nbsp<b><i class = "fas fa-star"></i></b></p>
        <p class = "rottenTomato"><b>Rotten Tomato:</b> ${details.Ratings[2].Value}&nbsp<b><i class = "fas fa-star"></i></b></p>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        
    </div>
    `;
}

// to hide search results after selecting a movie
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

// using localStorage to store favourite movies

// array containing id's of all movies which are added to My List we will use this array to display content of My List Page
var myMovieList = [];
var oldArray = [];

// adding functionality to Add Movie to list button
function addingMovieToList(element) {
    // getting id from the div
    const buttonID = element.getAttribute('id');
    // setTimeout function to change innerHtml to shadow changes in the add favourite button
    setTimeout(() => {document.getElementById(buttonID).innerHTML = 'Added to Favourites &nbsp<i class="fas fa-check"></i>';}, 500);
    
  // to add the movie only once into list
  if (!myMovieList.includes(buttonID.toString())) {
    myMovieList.push(buttonID.toString());
  }

  //first we need to check if local storafe is empty, if yes then push data directly; if not, then first reterive that data, modify it and then append modified data to localstorage;
  oldArray = JSON.parse(localStorage.getItem("MovieArray"));
  if (oldArray == null) {
    localStorage.setItem("MovieArray", JSON.stringify(myMovieList));
  } else {
    // appending only new entries in old array
    myMovieList.forEach((item) => {
      if (!oldArray.includes(item)) {
        oldArray.push(item);
      }
    });
    localStorage.setItem("MovieArray", JSON.stringify(oldArray));
  }
  console.log(oldArray);
}


