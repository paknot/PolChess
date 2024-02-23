//Redirection to home page after clicking on logo
document.addEventListener('DOMContentLoaded', (event) => {
  loadBackgroundColor();
  //big brother listens
  const logoLink = document.getElementById('home');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = '/M00864763';
    });
  }
});

// the search animation ( sliding)
document.addEventListener('DOMContentLoaded', (event) => {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const searchContainer = document.querySelector('.search-container');

  // Listen for search button click
  searchButton.addEventListener('click', function () {

    searchContainer.classList.toggle('active');

    //auto focus
    if (searchContainer.classList.contains('active')) {
      searchInput.style.visibility = 'visible';
      searchInput.value = ''; //clear value
      searchInput.focus();
    } else {
      //if not active clear
      searchInput.value = '';
    }
  });

  // removing input when not active
  searchInput.addEventListener('blur', function () {
    searchContainer.classList.remove('active');
    setTimeout(() => {
      searchInput.style.visibility = 'hidden';
    }, 500);
  });
});

//change BG color
function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
  localStorage.setItem('bgColor', color);
}
// Load the BG that was saved
function loadBackgroundColor() {
  const savedColor = localStorage.getItem('bgColor');
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
  }
}

//Settings spin
document.addEventListener('click', function (event) {
  // spin if its .settings
  if (event.target.closest('.settings')) {
    const settingsButton = event.target.closest('.settings');
    settingsButton.classList.toggle('spin');

    // Show/hide color menu on click
    const colorMenu = document.getElementById('colorMenu');
    colorMenu.style.display = colorMenu.style.display === 'none' ? 'block' : 'none';
  } else {
    // Hide color menu if clicked outside
    const colorMenu = document.getElementById('colorMenu');
    if (colorMenu.style.display === 'block') {
      colorMenu.style.display = 'none';
    }
  }

  // Change background color on colorOption click
  if (event.target.classList.contains('colorOption')) {
    const color = event.target.dataset.color;
    changeBackgroundColor(color);
  }
});

//Setting the search up
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  if (searchInput) {
    searchInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault(); //no deafult
        performUserSearch(searchInput.value.trim());
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', function () {
      performUserSearch(searchInput.value.trim());
    });
  }
}
//liking posts
document.addEventListener('DOMContentLoaded', function () {

  const likeButtons = document.querySelectorAll('.likeBTN');

  //listen to clicks
  likeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const icon = this.querySelector('.fa-heart');
      // change color
      icon.classList.toggle('liked');

      // Initialize or update the like count
      let likeCount = parseInt(this.getAttribute('data-likes') || '0');
      if (icon.classList.contains('liked')) {
        likeCount++; // Increment like count if liked
      } else {
        likeCount--;
      }
      this.setAttribute('data-likes', likeCount); // Update data

      // display number of likes
      this.innerHTML = `<i class="fa fa-heart${icon.classList.contains('liked') ? ' liked' : ''}"></i> Like (${likeCount})`;
    });
  });
});
// Message bar
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('messages').addEventListener('click', function () {
    let messageBar = document.getElementById('message-bar');
    if (messageBar.classList.contains('show')) {
      messageBar.classList.remove('show');
      setTimeout(function () {
        messageBar.style.display = 'none';
      }, 500);
    } else {
      messageBar.style.display = 'block';
      setTimeout(function () {
        messageBar.classList.add('show');
      }, 10);
    }
  });
});
// Function to toggle friends list
document.addEventListener('DOMContentLoaded', function () {

  function toggleFriendsList() {
    let friendsBar = document.getElementById('friends-bar');
    friendsBar.classList.toggle('show');
  }

  // Attach the toggle function to the friends button
  let friendsBtn = document.getElementById('friends');
  friendsBtn.addEventListener('click', toggleFriendsList);
});

//Slides comment bar
function toggleCommentInput(commentButton) {

  let postArticle = commentButton.closest('article');

  let commentContainer = postArticle.querySelector('.comments-container');

  commentContainer.style.display = commentContainer.style.display === 'block' ? 'none' : 'block';
}
// Event listener for all comments
document.addEventListener('DOMContentLoaded', function () {

  let commentButtons = document.querySelectorAll('.commentBTN');

  commentButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      toggleCommentInput(this);
    });
  });
});

// Refreshes a page
function refreshPage() {
  window.location.reload();
}

// Listen for refresh
document.addEventListener('DOMContentLoaded', function () {
  // Get the refresh button by its ID
  let refreshBtn = document.getElementById('refresh');

  refreshBtn.addEventListener('click', refreshPage);
});

// Pop up windows login/register
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('signInBtn').addEventListener('click', function () {
    document.getElementById('signInPopup').style.display = 'block';
  });

  document.getElementById('registerBtn').addEventListener('click', function () {
    document.getElementById('registerPopup').style.display = 'block';
  });

  let closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      this.closest('.popup').style.display = 'none';
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target.classList.contains('popup')) {
      event.target.style.display = 'none';
    }
  });
});