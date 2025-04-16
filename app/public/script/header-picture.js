document.addEventListener('DOMContentLoaded', function() {
    const headerUploadInput = document.getElementById('headerUpload');
    const headerImages = document.querySelectorAll('img[alt="Banner"]');
    
    // Check si l'utilisateur a déjà une photo de profile
    function updateHeaderPictureSrc() {
      fetch('../api/profile.php')
        .then(response => response.json())
        .then(data => {
          const userInfo = data[3][0]; 
          if (userInfo && userInfo.header) {
            headerImages.forEach(img => {
              img.src = "../" + userInfo.header;
            });
          }
        })
        .catch(error => console.error('Error loading header:', error));
    }
    
    updateHeaderPictureSrc();
    
    // Selection de fichier
    if (headerUploadInput) {
      headerUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        headerImages.forEach(img => {
          img.classList.add('opacity-50');
        });
        
        const formData = new FormData();
        formData.append('headerPicture', file);
        
        fetch('../api/profile.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            headerImages.forEach(img => {
              img.src = result.path;
              img.classList.remove('opacity-50');
            });
            alert('Header picture updated successfully!');
          } else {
            alert('Error: ' + result.message);
            headerImages.forEach(img => {
              img.classList.remove('opacity-50');
            });
          }
        })
        .catch(error => {
          console.error('Error uploading header:', error);
          alert('Failed to upload header. Please try again.');
          headerImages.forEach(img => {
            img.classList.remove('opacity-50');
          });
        });
      });
    }
  });