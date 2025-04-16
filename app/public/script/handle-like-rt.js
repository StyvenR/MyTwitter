// Fonction like
export function handleLike(event) {
  console.log(event);
  const tweetId = event.currentTarget.dataset.tweetId;
  const likeButton = event.currentTarget;

  const userId = getCookie("UserID");
  if (!userId) {
    console.error("UserID not found in cookie");
    return;
  }

  fetch("../api/like.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId: tweetId, userId: userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success data:", data.like_count);
      if (data.success) {
        likeButton.innerHTML = `<i class="far fa-heart"></i> Like ${data.like_count}`;
        if (data.liked) {
          likeButton.querySelector("i").classList.remove("far");
          likeButton.querySelector("i").classList.add("fas");
          likeButton
            .querySelector("i")
            .parentNode.classList.add("text-red-500");
        } else {
          likeButton.querySelector("i").classList.remove("fas");
          likeButton
            .querySelector("i")
            .parentNode.classList.remove("text-red-500");
          likeButton.querySelector("i").classList.add("far");
        }
      } else {
        console.error("Error liking/unliking tweet:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Fonction retweet
export function handleRetweet(event) {
  const tweetId = event.currentTarget.dataset.tweetId;
  const retweetButton = event.currentTarget;

  const userId = getCookie("UserID");
  if (!userId) {
    console.error("UserID not found in cookie");
    return;
  }

  fetch("../api/retweet.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tweetId: tweetId, userId: userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        retweetButton.innerHTML = `<i class="fas fa-retweet"></i> Retweet ${data.retweet_count}`;
        if (data.retweeted) {
          retweetButton
            .querySelector("i")
            .parentNode.classList.add("text-green-500");
        } else {
          retweetButton
            .querySelector("i")
            .parentNode.classList.remove("text-gre-500");
        }
      }
    })
    .catch((error) => console.error("Error:", error));
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
