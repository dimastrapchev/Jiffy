const API_KEY = 'sK1l4VgJnDoYfh8ww54VU0c5AIf52iBM';
const searchHintEl = document.querySelector('.search-hint');
const searchEl = document.querySelector('.search-input');
const videosEl = document.querySelector('.videos');
const clearEl = document.querySelector('.search-clear');

function createVideo(src){
  const video = document.createElement('video');
  video.src = src;
  video.loop = true;
  video.autoplay = true;
  video.className = "video";
  return video;
}

const randomChoice = arr => {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
};

const toggleLoading = state => {
    if (state) {
      document.body.classList.add('loading');
    } else {
      document.body.classList.remove('loading');
    }
};

const searchGiphy = searchTerm => {
  toggleLoading(true);

  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`)

  .then(response => {
  	// Convert to JSON
  	return response.json();
  })

  .then(json => {
    const data = randomChoice(json.data);
    const src = data.images.original.mp4;
    const video = createVideo(src);

    videosEl.appendChild(video);

    video.addEventListener('loadeddata', event => {
      video.classList.add('visible');
      document.body.classList.add('has-results');
      searchHintEl.innerHTML = `Hit enter to search for more ${searchTerm}`;
    })

    toggleLoading(false);
  })

  .catch(error => {
    toggleLoading(false);
    searchHintEl.innerHTML = `Nothing found for ${searchTerm}`;
  });
}

const doSearch = (event) => {
  const searchTerm = searchEl.value;

  if (searchTerm.length > 2){
    document.body.classList.add('show-hint');
    searchHintEl.innerHTML = `Hit enter to search for ${searchTerm}`;
  } else {
    document.body.classList.remove('show-hint');
  }

  if (event.key === 'Enter' && searchTerm.length > 2){
    searchGiphy(searchTerm);
  }
}

const clearSearch = event => {
  document.body.classList.remove('has-results');
  videosEl.innerHTML = '';
  searchHintEl.innerHTML = '';
  searchEl.value = '';
  searchEl.focus();
}

searchEl.addEventListener('keyup', doSearch);
clearEl.addEventListener('click', clearSearch);
document.addEventListener('keyup', event => {
  if (event.key === 'Escape'){
    clearSearch();
  }
})
