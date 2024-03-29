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

// Creating an account
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault(); // Prevent default form submission behavior

      // Dynamically collect form data entered by the user
      const formData = new FormData(registerForm);
      const userData = {
        username: formData.get('user'), // User input for username
        email: formData.get('email'), // User input for email
        password: formData.get('password') // User input for password
      };

      // Send the user data to the backend using fetch
      try {
        const response = await fetch('/M00864763/addUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Convert user data into JSON
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const result = await response.json();
        alert('Registration successful!');
        console.log('Success:', result);

        // Optionally, close the popup and reset the form
        document.getElementById('registerPopup').style.display = 'none';
        registerForm.reset();
      } catch (error) {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {

  // Fetch and display posts when the page loads
  try {
    const response = await fetch('/M00864763/getAllPosts');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const posts = await response.json();
    posts.forEach(post => {
      appendPostToFeed(post);
    });
  } catch (error) {
    console.error('Error:', error);
  }
});


function appendPostToFeed(postData) {
  const feedContainer = document.querySelector('.feed-container');
  const postElement = document.createElement('div');

  postElement.className = 'post-container';
  postElement.innerHTML = `
    <article class="post">
      <div class="post-header">
        <img alt="User Avatar" class="post-avatar">
        <div class="post-info">
          <strong>${postData.username}</strong>
        </div>
      </div>
      <div class="post-content">
        <p>${postData.textContent}</p>
        ${postData.imageURL ? `<img src="${postData.imageURL}" alt="Post Image" class="post-image">` : ''}
      </div>
      <div class="post-actions">
        <button class="likeBTN">
          <i class="fa fa-heart"></i> Like
        </button>
        <button class="commentBTN">
          <i class="fa fa-comment"></i> Comment
        </button>
      </div>
    </article>
  `;

  // Assuming the user's ID is stored in `postData.userId`
  const avatarImage = postElement.querySelector('.post-avatar');
  if (postData.userId) {
    avatarImage.src = `/M00864763/profilePicture/${postData.userId}`;
  } else {
    avatarImage.src = '../images/avatar.jpg'; // Fallback avatar
  }

  // Insert the new post element at the beginning of the feed container
  feedContainer.insertBefore(postElement, feedContainer.firstChild);
}


//Login in
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('signInForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const formData = new FormData(event.target);
    const user = formData.get('user');
    const password = formData.get('password');

    try {
      const response = await fetch('/M00864763/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.loggedIn) {
          // Update the UI to reflect the logged-in state
          document.querySelector('.logReg').innerHTML = `<button class="signBTN">${result.username}</button>`;
          // Optionally close the signInPopup
          document.getElementById('signInPopup').style.display = 'none';
          alert(`Login successful. Welcome back, ${result.username}!`);
        }

      } else {
        alert('Login failed: Invalid username or password.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again.');
    }
  });
});
// Display posts
async function fetchAndDisplayPosts() {
  try {
    const response = await fetch('/M00864763/getAllPosts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const posts = await response.json();
    posts.forEach(appendPostToFeed);
  } catch (error) {
    console.error('Error:', error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayPosts(); // Fetch and display posts
});

//Post creation
document.addEventListener('DOMContentLoaded', (event) => {
  // This is the actual file input, which is hidden
  const imageInput = document.getElementById('imageUpload');
  // The button that users will click, which is a label styled as a button
  const imageLabel = document.querySelector('.image-label');
  const submitButton = document.querySelector('.post-submit-btn');

  // When the hidden file input changes (after a file selection), update the text to show the file name
  imageInput.addEventListener('change', function () {
    const fileNameDisplay = document.querySelector('.image-input'); // This should be the element where you want to show the file name
    const file = imageInput.files[0];
    fileNameDisplay.value = file ? file.name : ''; // Update the text to show the file name
  });

  // When the submit button is clicked, send the form data
  submitButton.addEventListener('click', async function () {
    const textContent = document.querySelector('.post-input').value;
    const formData = new FormData();
    formData.append('textContent', textContent);

    // Only add the image file to formData if a file was selected
    if (imageInput.files.length > 0) {
      const imageFile = imageInput.files[0];
      formData.append('image', imageFile); // Append file to the form data
    }

    // Send the post request to create a new post with the image and text content
    try {
      const response = await fetch('/M00864763/createPost', {
        method: 'POST',
        body: formData, // Send form data
        credentials: 'include' // Important for cookies/session to work with fetch
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message

        // Clear the textarea and any other fields as necessary
        document.querySelector('.post-input').value = '';
        imageInput.value = ''; // Reset file input

      } else {
        const errorResult = await response.json();
        alert(errorResult.message); // Show error message from server
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again.');
    }
  });
});


// user stays logged in until they log out
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/M00864763/checkLogin', { credentials: 'include' });
    if (response.ok) {
      const result = await response.json();
      if (result.loggedIn) {
        // User is logged in, adjust UI accordingly
        document.querySelector('.logReg').innerHTML = `<button class="signBTN">${result.username}</button>`;
        // If you have a greeting placeholder or want to update the post input placeholder:
        document.querySelector('.post-input').placeholder = `What's on your mind, ${result.username}?`;
      }
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
});
// login check and dropdown menu
document.addEventListener('DOMContentLoaded', async () => {

  try {

    const response = await fetch('/M00864763/checkLogin', { credentials: 'include' });
    if (response.ok) {
      const result = await response.json();
      if (result.loggedIn) {
        // Update the UI to reflect the logged-in state
        document.querySelector('.logReg').innerHTML = `
            <button class="signBTN">${result.username} &#x25BC;</button>
            <div id="dropdownMenu" class="dropdown-content" style="display:none;">
              <a href="" id="updateProfile">Update Profile</a>
              <a href="#" id="logout">Log Out</a>
            </div>
          `;
        setupDropdown();
      }
    }

  } catch (error) {
    console.error('Error checking login status:', error);
  }
});

function setupDropdown() {
  const usernameButton = document.querySelector('.signBTN');
  const dropdownMenu = document.getElementById('dropdownMenu');

  // Simply attach the event listeners, no need to remove them.
  if (usernameButton && dropdownMenu) {
    usernameButton.addEventListener('click', () => {
      // Toggle the dropdown menu
      dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    });
    const updateProfileLink = document.getElementById('updateProfile');
    if (updateProfileLink) {
      updateProfileLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the link from navigating.
        document.getElementById('updateProfilePopup').style.display = 'block'; // Show the update profile popup
      });
    }

    // Logout event logic
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          const logoutResponse = await fetch('/M00864763/logout', { method: 'POST', credentials: 'include' });
          if (logoutResponse.ok) {
            window.location.reload(); // Reload the page to update the UI
          }
        } catch (logoutError) {
          console.error('Logout failed:', logoutError);
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const updateProfileForm = document.getElementById('updateProfileForm');

  if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent the default form submission

      const formData = new FormData(updateProfileForm);
      try {
        const response = await fetch('/M00864763/updateProfile', {
          method: 'POST',
          body: formData, // Send the form data directly
          credentials: 'include' // Include cookies for session management
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Show success message
          document.getElementById('updateProfilePopup').style.display = 'none'; // Close the popup
          updateProfileForm.reset(); // Optionally, reset the form fields
        } else {
          const error = await response.json();
          alert(error.message); // Show error message from the server
        }
      } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Close popup logic
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('updateProfilePopup').style.display = 'none';
  });
});



