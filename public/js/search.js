document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchResultsContainer = document.getElementById('searchResultsContainer');

    if(searchInput){
  searchInput.addEventListener('input', async (e) => {
      const query = searchInput.value.trim();
      if (!query) {
          searchResults.innerHTML = ''; // Clear results if input is empty
          searchResultsContainer.classList.add('d-none')
          return;
      }
      
          const response = await fetch(`/campgrounds/search?query=${encodeURIComponent(query)}`);
          const data = await response.json();
        if(data.results.length==0){
            document.getElementById('but').disabled=true

        }else{
        document.getElementById('but').disabled=false

          if (data.results.length > 0) {
            document.getElementById('first').action=(`/campgrounds/${data.results[0]._id}`)
            document.getElementById('first').addEventListener('submit', (e) => {
                })
            searchResults.innerHTML = data.results
                .map(campground => 
                    `<div>
                    <li class="list-group-item">
                        <a href="/campgrounds/${campground._id}" target=_blank>
                    <img src="${campground.images[0].url}" class="img-thumbnail vh-5" alt="...">
                    </a>

                        <a href="/campgrounds/${campground._id}" class="text-decoration-none text-dark">
                            ${campground.title}
                        </a>
                    </li>
                    </div>`
                    
                ).join('');
                

            
            // Show the results container
            searchResultsContainer.classList.remove('d-none');
        } else {
            searchResults.innerHTML = '<li class="list-group-item">No campgrounds found</li>';
            searchResultsContainer.classList.remove('d-none');
        }
}})}
searchResultsContainer.addEventListener('scroll', async () => {
    // Check if user scrolled to the bottom of the container
    if (searchResultsContainer.scrollTop + searchResultsContainer.clientHeight >= searchResultsContainer.scrollHeight) {
        const response = await fetch('/campgrounds/all'); // Fetch all campgrounds
        const data = await response.json();

        // Append all campgrounds to the container
        searchResults.innerHTML = data.results
            .map(campground =>
                `<li class="list-group-item">
                <a href="/campgrounds/${campground._id}">
                    <img src="${campground.images[0].url}" class="img-thumbnail vh-5" alt="...">
                    </a>
                    <a href="/campgrounds/${campground._id}" class="text-decoration-none text-dark">
                        ${campground.title}
                    </a>
                </li>`
            ).join('');
    }
});

    if(searchInput){
    document.addEventListener('click', (event) => {
        if ( !searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
            searchResultsContainer.classList.add('d-none');
        }
    })}    })

