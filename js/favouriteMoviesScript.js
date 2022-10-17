// reteriving session details and thus the passed array from homegage
var storageString = localStorage.getItem("MovieArray");
var myListArray = JSON.parse(storageString);

//for each list item
myListArray.forEach(async (id) => {
  let url = `https://www.omdbapi.com/?i=${id}&apikey=f1e6e478`;
  await apiFunctionCall(url, id);
});

// creating function using xml http request to make changes in the website without loading whole website 
function apiFunctionCall(url, id) {
  const xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.send();
  xhr.onload = function () {
    var resp = xhr.response;
    var jsonResp = JSON.parse(resp);
    renderListItems(jsonResp, id);

    console.log(jsonResp);
  };
}

// function to set html content of the list item
function renderListItems(jsonResp, id) {
  var eachListItem = document.createElement("div");
  eachListItem.classList.add("list-item");
  eachListItem.innerHTML = `
        <div class="movie-details">
            <div class="thumbnail">
                <img src=${jsonResp.Poster} alt="Thumbnail">
            </div>
                <div class="title">
                    <a href="index.html"><b><i class="fa-light fa-popcorn"></i></b>${jsonResp.Title} </a> 
                    <span> | <b><i class="fas fa-clock"></i></b> ${jsonResp.Runtime}</span>
                    <span> | ${jsonResp.imdbRating}&nbsp<b><i class = "fas fa-star"></i></b></span>
                    <span> | <b><i class="fa-light fa-screen-users"></i></b>Popularity: ${jsonResp.imdbVotes}</span>
                </div>
                
        </div>
        <div class="remove-movie" id='${id}' onclick="deleteItemFromList(${id})">
            <i class="far fa-trash-alt"></i>
        </div>
    `;
  document.getElementById("list-container").appendChild(eachListItem);
}

// clear localStorage i.e. deleting complete list
document.getElementById("clear-whole-list")
  .addEventListener("click", function () {
    if (window.confirm("Clear Whole List?")) {
      localStorage.clear();
      window.location.reload();
    }
  });

//delete a specific movie from list
async function deleteItemFromList(id) {
  if (window.confirm("Delete Movie from List?")) {
    console.log(id);
    var tempArr = await JSON.parse(localStorage.getItem("MovieArray"));
    var index = await tempArr.indexOf(id.toString());
    await tempArr.splice(index, 1);
    await localStorage.setItem("MovieArray", JSON.stringify(tempArr));
    await window.location.reload();
  }
}
