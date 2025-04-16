document.addEventListener('DOMContentLoaded', function() {
    // Handle profile picture upload
    const ppUploadInput = document.getElementById('ppUpload');
    const profileImages = document.querySelectorAll('img[src="../assets/default_avatar.png"]');
    
    // Check if the user already has a profile picture
    function updateProfilePictureSrc() {
      fetch('../api/profile.php')
        .then(response => response.json())
        .then(data => {
          const userInfo = data[3][0]; // User info is in the fourth array element
          if (userInfo && userInfo.picture) {
            // Update all profile picture instances
            profileImages.forEach(img => {
              img.src = "../" + userInfo.picture;
            });
          }
        })
        .catch(error => console.error('Error loading profile picture:', error));
    }
    
    // Call on page load
    updateProfilePictureSrc();
    
    // Handle file selection
    if (ppUploadInput) {
      ppUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Show loading state
        profileImages.forEach(img => {
          img.classList.add('opacity-50');
        });
        
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        // Send the file to the server
        fetch('../api/profile.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            // Update profile picture on success
            profileImages.forEach(img => {
              img.src = result.path;
              img.classList.remove('opacity-50');
            });
            // Show success message
            alert('Profile picture updated successfully!');
          } else {
            alert('Error: ' + result.message);
            profileImages.forEach(img => {
              img.classList.remove('opacity-50');
            });
          }
        })
        .catch(error => {
          console.error('Error uploading profile picture:', error);
          alert('Failed to upload profile picture. Please try again.');
          profileImages.forEach(img => {
            img.classList.remove('opacity-50');
          });
        });
      });
    }
  });