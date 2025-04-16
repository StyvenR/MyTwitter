import {handleLike,handleRetweet} from "./handle-like-rt.js";
import {updateUserInfo} from "./user-display.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#user-info").addEventListener("click", function () {
    document.querySelector(".popup").classList.toggle("hidden");
  });

  document
    .getElementById("open-edit")
    .addEventListener("click", function (event) {
      document.getElementById("edit").classList.remove("hidden");
    });

  document.getElementById("close-edit").addEventListener("click", function () {
    document.getElementById("edit").classList.add("hidden");
  });

  // Switch tweets
  setupTabSwitching();

  // Fetch user profile data
  fetchProfileData();
});

function setupTabSwitching() {
  // Récupérer les conteneurs
  const tweetsContainer = document.getElementById("tweetsContainer");
  const tweetsLikedContainer = document.getElementById("tweetsLikedContainer");
  const tweetsMediaContainer = document.getElementById("tweetsMediaContainer");

  // Récupérer les onglets
  const tabElements = document.querySelectorAll(".flex.justify-evenly h2");
  const tweetsTab = tabElements[0];
  const mediasTab = tabElements[1];
  const likesTab = tabElements[2];

  // Fonction pour réinitialiser l'affichage
  function resetDisplay() {
    // Cacher tous les conteneurs
    tweetsContainer.style.display = "none";
    tweetsLikedContainer.style.display = "none";
    tweetsMediaContainer.style.display = "none";

    // Réinitialiser le style des onglets
    tweetsTab.classList.remove("border-b-2", "border-blue-600");
    mediasTab.classList.remove("border-b-2", "border-blue-600");
    likesTab.classList.remove("border-b-2", "border-blue-600");
  }

  // Par défaut, afficher les tweets
  resetDisplay();
  tweetsContainer.style.display = "block";
  tweetsTab.classList.add("border-b-2", "border-blue-600");

  // Ajouter des écouteurs d'événements pour les onglets
  tweetsTab.addEventListener("click", function () {
    resetDisplay();
    tweetsContainer.style.display = "block";
    tweetsTab.classList.add("border-b-2", "border-blue-600");
  });

  mediasTab.addEventListener("click", function () {
    resetDisplay();
    tweetsMediaContainer.style.display = "block";
    mediasTab.classList.add("border-b-2", "border-blue-600");
  });

  likesTab.addEventListener("click", function () {
    resetDisplay();
    tweetsLikedContainer.style.display = "block";
    likesTab.classList.add("border-b-2", "border-blue-600");
  });
}

function fetchProfileData() {
  fetch("/app/api/profile.php/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.status === 204 || response.status === 205) {
        return [];
      }
      return response.json();
    })
    .then((data) => {
      editProfileForm(data);
      updateUserInfo(data[3][0]);
      displayTweets(data);
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });
}

function editProfileForm(data) {
  document.getElementById("birthdate").value = data[3][0].birthdate || "";
  document.getElementById("display_name").value = data[3][0].display_name || "";
  document.getElementById("biography").value = data[3][0].biography || "";
  document.getElementById("city").value = data[3][0].city || "";
  document.getElementById("country").value = data[3][0].country || "";
  document.getElementById("url").value = data[3][0].url || "";
}

function displayTweets(data) {
  const tweetsContainer = document.querySelector("#tweetsContainer");
  displayTweetsList(data[0], tweetsContainer);

  const tweetsLikedContainer = document.querySelector("#tweetsLikedContainer");
  displayTweetsList(data[1], tweetsLikedContainer);

  const tweetsMediaContainer = document.querySelector("#tweetsMediaContainer");
  displayTweetsList(data[2], tweetsMediaContainer);
}

function displayTweetsList(tweets, container) {
  tweets.forEach((tweet) => {
    const tweetElement = document.createElement("div");
    tweetElement.classList.add(
      "mb-4",
      "p-4",
      "bg-blue-50",
      "border",
      "border-gray-200",
      "rounded-lg"
    );

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
    tweetElement.innerHTML = `
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
    container.appendChild(tweetElement);
    const likeButton = tweetElement.querySelector(".like-button");
    const retweetButton = tweetElement.querySelector(".retweet-button");

    likeButton.addEventListener("click", handleLike);
    retweetButton.addEventListener("click", handleRetweet);
  });
}
