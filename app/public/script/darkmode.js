document.addEventListener('DOMContentLoaded', function() {
  const darkModeBtn = document.querySelector('a i.fas.fa-moon').parentElement;
  
  initializeDarkMode();
  
  darkModeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleDarkMode();
  });
  
  function initializeDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }
  
  function toggleDarkMode() {
    if (document.body.classList.contains('dark')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  }
  
  function enableDarkMode() {
    document.body.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
    updateElements(true);
    console.log('Dark mode enabled');
  }

  function disableDarkMode() {
    document.body.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
    updateElements(false);
    console.log('Dark mode disabled');
  }
  
  function updateElements(isDarkMode) {
    // Bouton soleil/lune
    const moonIcon = document.querySelector('a i.fas.fa-moon, a i.fas.fa-sun');
    if (isDarkMode) {
      moonIcon.classList.remove('fa-moon');
      moonIcon.classList.add('fa-sun');
      if (moonIcon.nextElementSibling) {
        moonIcon.nextElementSibling.textContent = 'Light Mode';
      }
    } else {
      moonIcon.classList.remove('fa-sun');
      moonIcon.classList.add('fa-moon');
      if (moonIcon.nextElementSibling) {
        moonIcon.nextElementSibling.textContent = 'Dark Mode';
      }
    }
    
    // Timeline main content (milieu)
    const mainContent = document.getElementById('tl_main');
    if (mainContent) {
      if (isDarkMode) {
        mainContent.classList.remove('bg-white');
        mainContent.classList.add('bg-black', 'text-black', 'border', 'border-gray-700');
      } else {
        mainContent.classList.remove('bg-black', 'text-black', 'border', 'border-gray-700');
        mainContent.classList.add('bg-white');
      }
    }

    const mainBackground = document.getElementById('mainBackground');
    if (mainBackground) {
      if (isDarkMode) {
        mainBackground.classList.remove('bg-blue-50');
        mainBackground.classList.add('bg-black');
      } else {
        mainBackground.classList.remove('bg-black');
        mainBackground.classList.add('bg-blue-50');
      }
    }

    // Left sidebar
    const leftSidebar = document.getElementById('leftSidebar');
    if (leftSidebar) {
      if (isDarkMode) {
        leftSidebar.classList.remove('bg-blue-50');
        leftSidebar.classList.add('bg-black');
      } else {
        leftSidebar.classList.remove('bg-black');
        leftSidebar.classList.add('bg-blue-50');
      }
    }
    
    // Right sidebar
    const rightSidebar = document.getElementById('rightSidebar');
    if (rightSidebar) {
      if (isDarkMode) {
        rightSidebar.classList.remove('bg-blue-50');
        rightSidebar.classList.add('bg-black');
      } else {
        rightSidebar.classList.remove('bg-black');
        rightSidebar.classList.add('bg-blue-50');
      }
    }
    
    // Tendances
    const trendingBox = document.querySelector('.trending-box');
    if (trendingBox) {
      if (isDarkMode) {
        trendingBox.classList.remove('bg-white', 'text-blue-700');
        trendingBox.classList.add('bg-black', 'text-white', 'border', 'border-gray-700');
      } else {
        trendingBox.classList.remove('bg-black', 'text-white', 'border', 'border-gray-700');
        trendingBox.classList.add('bg-white', 'text-blue-700');
      }
    }
    
    // Message box background
    const messageBoxBackground = document.getElementById('messageBoxBackground');
    if (messageBoxBackground) {
      if (isDarkMode) {
        messageBoxBackground.classList.remove('bg-white');
        messageBoxBackground.classList.add('bg-black', 'text-white', 'border', 'border-gray-700');
      } else {
        messageBoxBackground.classList.remove('bg-black', 'text-white', 'border', 'border-gray-700');
        messageBoxBackground.classList.add('bg-white');
      }
    }
  
    // Message box button
    const messageBoxBtn = document.querySelector('#messageBoxBackground button');
    if (messageBoxBtn) {
      if (isDarkMode) {
        messageBoxBtn.classList.remove('text-blue-600', 'hover:text-blue-800');
        messageBoxBtn.classList.add('text-white');
      } else {
        messageBoxBtn.classList.remove('text-white');
        messageBoxBtn.classList.add('text-blue-600', 'hover:text-blue-800');
      }
    }
    
    // Tweet form
    const tweetForm = document.getElementById('tweetForm');
    if (tweetForm) {
      const tweetInput = document.getElementById('tweetPost');
      if (tweetInput) {
        if (isDarkMode) {
          tweetInput.classList.add('bg-black', 'text-white');
          tweetInput.classList.remove('border-gray-300');
          tweetInput.classList.add('border-gray-700');
        } else {
          tweetInput.classList.remove('bg-black', 'text-white');
          tweetInput.classList.remove('border-gray-700');
          tweetInput.classList.add('border-gray-300');
        }
      }
      
      const postButton = document.getElementById('PostButton');
      if (postButton) {
        if (isDarkMode) {
          postButton.classList.remove('bg-grey-500');
          postButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
        } else {
          postButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
          postButton.classList.add('bg-grey-500');
        }
      }
    }
    
    // Barre rechercher
    const searchInputs = document.querySelectorAll('input[placeholder="Chercher"], input[placeholder="Search messages"]');
    searchInputs.forEach(input => {
      if (isDarkMode) {
        input.classList.add('bg-black', 'text-white', 'border-gray-700');
        input.classList.remove('border-gray-300');
      } else {
        input.classList.remove('bg-black', 'text-white', 'border-gray-700');
        input.classList.add('border-gray-300');
      }
    });
    
    // User info
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      if (isDarkMode) {
        userInfo.classList.remove('hover:bg-blue-100');
        userInfo.classList.add('hover:bg-gray-800');
        
        const userName = userInfo.querySelector('.userNameAff');
        if (userName) {
          userName.classList.remove('text-gray-500');
          userName.classList.add('text-gray-400');
        }
      } else {
        userInfo.classList.remove('hover:bg-gray-800');
        userInfo.classList.add('hover:bg-blue-100');
        
        const userName = userInfo.querySelector('.userNameAff');
        if (userName) {
          userName.classList.remove('text-gray-400');
          userName.classList.add('text-gray-500');
        }
      }
    }
    
    const displayNameAff = document.querySelectorAll('.displayNameAff');
    displayNameAff.forEach(displayName => {
      if (isDarkMode) {
        displayName.classList.remove('text-black');
        displayName.classList.add('text-white');
      } else {
        displayName.classList.remove('text-white');
        displayName.classList.add('text-black');
      }
    });

    // Sidebar links
    const sidebarLinks = document.querySelectorAll('#leftSidebar a');
    sidebarLinks.forEach(link => {
      if (isDarkMode) {
        link.classList.remove('text-blue-600');
        link.classList.add('text-white');
      } else {
        link.classList.remove('text-white');
        link.classList.add('text-blue-600', 'hover:text-blue-800');
      }
    });
    
    // Trend links dans tendances
    const trendLinks = document.querySelectorAll('.trending-box a');
    trendLinks.forEach(link => {
      if (isDarkMode) {
        link.classList.remove('text-blue-600');
        link.classList.add('text-white', 'hover:text-blue-800');
        
        const tweetCount = link.querySelector('.text-gray-500');
        if (tweetCount) {
          tweetCount.classList.remove('text-gray-500');
          tweetCount.classList.add('text-gray-400');
        }
      } else {
        link.classList.remove('text-blue-400', 'hover:text-blue-300');
        link.classList.add('text-blue-600', 'hover:text-blue-800');
        
        const tweetCount = link.querySelector('.text-gray-400');
        if (tweetCount) {
          tweetCount.classList.remove('text-gray-400');
          tweetCount.classList.add('text-gray-500');
        }
      }
    });
    
    // Message box
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
      if (isDarkMode) {
        messageBox.classList.add('bg-black', 'text-white');
      } else {
        messageBox.classList.remove('bg-black', 'text-white');
      }
    }
    
    // Logout popup
    const logoutPopup = document.querySelector('.popup');
    if (logoutPopup) {
      if (isDarkMode) {
        logoutPopup.classList.remove('border-gray-200');
        logoutPopup.classList.add('border-gray-700', 'bg-gray-800', 'text-white');
        
        const logoutButton = document.getElementById('logOutAff');
        if (logoutButton) {
          logoutButton.classList.remove('hover:bg-blue-200');
          logoutButton.classList.add('hover:bg-gray-700');
        }
      } else {
        logoutPopup.classList.remove('border-gray-700', 'bg-gray-800', 'text-white');
        logoutPopup.classList.add('border-gray-200');
        
        const logoutButton = document.getElementById('logOutAff');
        if (logoutButton) {
          logoutButton.classList.remove('hover:bg-gray-700');
          logoutButton.classList.add('hover:bg-blue-200');
        }
      }
    }
    
    // Home main text
    const homeHeading = document.querySelector('#tl_main h2');
    if (homeHeading) {
      if (isDarkMode) {
        homeHeading.classList.remove('text-blue-700');
        homeHeading.classList.add('text-white');
      } else {
        homeHeading.classList.remove('text-white');
        homeHeading.classList.add('text-blue-700');
      }
    }
    
    // Message text
    const messageHeading = document.querySelector('#messageBoxBackground h3');
    if (messageHeading) {
      if (isDarkMode) {
        messageHeading.classList.remove('text-blue-700');
        messageHeading.classList.add('text-white');
      } else {
        messageHeading.classList.remove('text-white');
        messageHeading.classList.add('text-blue-700');
      }
    }
  }

  // Tweets
  const tweets = document.getElementById('tweet-mode');
  if (tweets) {
    if (isDarkMode) {
      tweets.classList.remove('bg-blue-50');
      tweets.classList.add('bg-black', 'text-black', 'border', 'border-gray-700');
    } else {
      tweets.classList.remove('bg-black', 'text-black', 'border', 'border-gray-700');
      tweets.classList.add('bg-white');
    }
  }
});