import { handleLike, handleRetweet } from "./handle-like-rt.js";
import { updateUserInfo } from "./user-display.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#user-info").addEventListener("click", function () {
    document.querySelector(".popup").classList.toggle("hidden");
  });

  fetchTimelineData();
});

// Fetch data de la timeline
function fetchTimelineData() {
  fetch("../api/tweets.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data[1]);

      // Update user information
      updateUserInfo(data[1]);

      // Display tweets
      displayTweets(data[0]);

      // Display liked retweeted
    })
    .catch((error) => console.error("Error fetching tweets:", error));
}

//Affichage des tweets dans la timeline
function displayTweets(tweets) {
  const postsContainer = document.querySelector("#tl_main");
  tweets.slice(0, 50).forEach((tweet) => {
    console.log(tweet.likes);
    const postElement = document.createElement("div");
    postElement.classList.add(
      "mb-4",
      "p-4",
      "bg-blue-50",
      "border",
      "border-gray-200",
      "rounded-lg",
      "tweet-mode"
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

    postElement.innerHTML = `
      <div class="flex items-start ">
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
    postsContainer.appendChild(postElement);

    const likeButton = postElement.querySelector(".like-button");
    const retweetButton = postElement.querySelector(".retweet-button");

    likeButton.addEventListener("click", handleLike);
    retweetButton.addEventListener("click", handleRetweet);
  });
}
