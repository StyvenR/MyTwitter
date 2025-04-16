document.addEventListener("DOMContentLoaded", function () {
  const tweetInput = document.getElementById("tweetPost");
  if (tweetInput) {
    tweetInput.addEventListener("input", updatePostButtonState);
  }

  const imageUpload = document.getElementById("imageUpload");
  if (imageUpload) {
    imageUpload.addEventListener("change", function () {
      previewImages(this);
      document.getElementById("tweetPost").dispatchEvent(new Event("input"));
    });
    document.getElementById("tweetPost").dispatchEvent(new Event("input"));
  }
});

// Preview uploaded images
function previewImages(input) {
  const container = document.getElementById("imagePreviewContainer");
  container.innerHTML = "";

  if (input.files) {
    const fileCount = Math.min(input.files.length, 4);

    for (let i = 0; i < fileCount; i++) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const preview = document.createElement("div");
        preview.className = "relative mr-2 mb-2";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "h-16 w-16 object-cover rounded-lg";

        const removeBtn = document.createElement("button");
        removeBtn.innerHTML = "&times;";
        removeBtn.className =
          "absolute top-1 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs";
        removeBtn.onclick = function () {
          preview.remove();
        };

        preview.appendChild(img);
        preview.appendChild(removeBtn);
        container.appendChild(preview);
      };

      reader.readAsDataURL(input.files[i]);
    }
  }
}

// Update post button 
function updatePostButtonState() {
  const tweetButton = document.querySelector("#PostButton");
  tweetButton.disabled = this.value.trim() === "";

  if (tweetButton.disabled) {
    tweetButton.classList.add("bg-blue-200");
    tweetButton.classList.remove("hover:bg-blue-400");
    tweetButton.classList.add("cursor-default");
    tweetButton.classList.remove("bg-blue-500");
  } else {
    tweetButton.classList.remove("bg-blue-200");
    tweetButton.classList.add("hover:bg-blue-400");
    tweetButton.classList.add("cursor-pointer");
    tweetButton.classList.remove("cursor-default");
    tweetButton.classList.add("bg-blue-500");
  }
}
