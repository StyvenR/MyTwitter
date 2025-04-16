import {handleLike,handleRetweet} from "./handle-like-rt.js";
import {updateUserInfo} from "./user-display.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#user-info").addEventListener("click", function () {
    document.querySelector(".popup").classList.toggle("hidden");
  });
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");
  const searchResults = document.querySelector("#searchResults");
  const searchTypeButtons = document.querySelectorAll(".search-type-btn");
  let currentSearchType = "content";

  searchTypeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      searchTypeButtons.forEach((btn) =>
        btn.classList.remove("bg-blue-600", "text-white")
      );
      this.classList.add("bg-blue-600", "text-white");
      currentSearchType = this.dataset.type;
      updatePlaceholder(currentSearchType);
    });
  });

  function updatePlaceholder(type) {
    switch (type) {
      case "hashtag":
        searchInput.placeholder = "Rechercher un hashtag...";
        break;
      case "user":
        searchInput.placeholder = "Rechercher un utilisateur...";
        break;
      default:
        searchInput.placeholder = "Rechercher dans les tweets...";
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();

      if (searchTerm === "") {
        return;
      }

      searchResults.innerHTML =
        '<div class="flex justify-center p-4"><i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i></div>';

      const searchData = {
        searchTerm: searchTerm,
        searchType: currentSearchType,
      };
      // Envoie de la data + affichage
      fetch("../api/search.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          updateUserInfo(data);
          displaySearchResults(data);
        })
        .catch((error) => {
          console.error("Error searching tweets:", error);
          searchResults.innerHTML =
            '<div class="text-center p-4 text-red-500">Une erreur est survenue. Veuillez réessayer.</div>';
        });
    });
  }

  // Fonction d'affichage
  function displaySearchResults(results) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="text-center p-4 text-gray-500">Aucun résultat trouvé</div>';
      return;
    }

    results.forEach((tweet) => {
      let mediaHTML = "";
      if (tweet.media1) {
        mediaHTML += `<div class="mt-2"><img src="${tweet.media1}" alt="Tweet media" class="rounded-lg max-h-64 max-w-full"></div>`;
      }

      if (tweet.media2 || tweet.media3 || tweet.media4) {
        mediaHTML = '<div class="mt-2 grid grid-cols-2 gap-2">';
        if (tweet.media1) {
          mediaHTML += `<img src="${tweet.media1}" alt="Tweet media" class="rounded-lg h-48 w-full object-cover">`;
        }
        if (tweet.media2) {
          mediaHTML += `<img src="${tweet.media2}" alt="Tweet media" class="rounded-lg h-48 w-full object-cover">`;
        }
        if (tweet.media3) {
          mediaHTML += `<img src="${tweet.media3}" alt="Tweet media" class="rounded-lg h-48 w-full object-cover">`;
        }
        if (tweet.media4) {
          mediaHTML += `<img src="${tweet.media4}" alt="Tweet media" class="rounded-lg h-48 w-full object-cover">`;
        }
        mediaHTML += "</div>";
      }

      let content = tweet.content;
      if (currentSearchType === "content" && searchInput.value.trim() !== "") {
        const searchTerm = searchInput.value.trim();
        const regex = new RegExp(`(${searchTerm})`, "gi");
        content = content.replace(
          regex,
          '<span class="bg-yellow-200">$1</span>'
        );
      }

      const postElement = document.createElement("div");
      postElement.classList.add(
        "mb-4",
        "p-4",
        "bg-blue-50",
        "border",
        "border-gray-200",
        "rounded-lg"
      );

      postElement.innerHTML = `
      <div class="flex items-start">
        <img src="../assets/default_avatar.png" alt="Avatar" class="w-12 h-12 rounded-full mr-4">
        <div>
          <h3 class="text-lg font-semibold">${tweet.display_name}</h3>
          <p class="text-gray-500">@${tweet.username}</p>
          <p class="text-gray-700 mt-2">${tweet.content}</p>
          ${mediaHTML}
          <div class="flex mt-2 text-gray-500">
            <button class="mr-4 hover:text-blue-500"><i class="far fa-comment"></i> Comment</button>
            <button class="mr-4 hover:text-green-500 retweet-button" data-tweet-id="${tweet.id}"><i class="fas fa-retweet"></i> Retweet ${tweet.retweet_count}</button>
            <button class="mr-4 hover:text-red-500 like-button" data-tweet-id="${tweet.id}"><i class="far fa-heart"></i> Like ${tweet.like_count}</button>
            <button class="hover:text-blue-500"><i class="far fa-share-square"></i> Share</button>
          </div>
        </div>
      </div>
    `;

      searchResults.appendChild(postElement);
      const likeButton = postElement.querySelector(".like-button");
      const retweetButton = postElement.querySelector(".retweet-button");
    
      likeButton.addEventListener("click", handleLike);
      retweetButton.addEventListener("click", handleRetweet);
    });
  }
  updatePlaceholder(currentSearchType);
});
