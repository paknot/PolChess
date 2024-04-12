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
  //Setup search
  setupSearch();
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

  if (searchInput) {
    searchInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault(); //no deafult
        performUserSearch(searchInput.value.trim());
      }
    });
  }


}

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
      e.preventDefault(); //no empty submissions

      const formData = new FormData(registerForm);
      const email = formData.get('email');
      const password = formData.get('password');
      const username = formData.get('user');

      // Validate email
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address (e.g., user@user.com).');
        return; // stop submission
      }

      // Validate password
      if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and include both letters and numbers.');
        return; // Stop submission
      }

      // Validate username for special characters
      if (!isValidUsername(username)) {
        alert('Username must contain only alphanumeric characters.');
        return; // Stop submission
      }

      const userData = {
        username: username,
        email: email,
        password: password
      };

      // Send the user data to the backend using fetch
      try {
        const response = await fetch('/M00864763/addUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), //JSON
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const result = await response.json();
        alert('Registration successful!');
        console.log('Success:', result);

        //PopUp close
        document.getElementById('registerPopup').style.display = 'none';
        registerForm.reset();
      } catch (error) {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
});

//Username is only letters and 
function isValidUsername(username) {
  return /^[a-zA-Z0-9]+$/.test(username);
}

//Valid password (letters and numbers)
function isValidPassword(password) {
  return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

//Valid email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add posts to feed
async function appendPostToFeed(postData) {
  const feedContainer = document.querySelector('.feed-container');
  const postElement = document.createElement('div');
  postElement.className = 'post-container';


  let profilePictureURL = '../images/avatar.jpg'; // A default avatar in case something doesnt work / user dont have their own
  try {
    const response = await fetch(`/M00864763/getUserProfilePicture/${postData.username}`);
    if (response.ok) {
      const blob = await response.blob();
      profilePictureURL = URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
  }

  const timeAgo = timeSince(postData.createdAt); // Calculate time since post was created
  //Dynamicly display posts
  postElement.innerHTML = `
    <article class="post">
      <div class="post-header">
        <img src="${profilePictureURL}" alt="User Avatar" class="post-avatar">
        <div class="post-info">
          <strong class="username">${postData.username}</strong>
          <span class="time-ago">${timeAgo} ago</span>
        </div>
      </div>
      <div class="post-content">
        <p>${postData.textContent}</p>
        ${postData.imageURL ? `<img src="${postData.imageURL}" alt="Post Image" class="post-image">` : ''}
      </div>
      <div class="post-actions">
        <button class="likeBTN" data-post-id="${postData._id}">
          <i class="fa fa-heart"></i> Like <span class="like-count">${postData.likeCount}</span>
        </button>
        <button class="commentBTN">
          <i class="fa fa-comment"></i> Comment
        </button>
      </div>
    </article>
  `;

  feedContainer.appendChild(postElement);

  //Listen for like button clicks
  const likeButton = postElement.querySelector('.likeBTN');
  likeButton.addEventListener('click', async function(event) {
    const postId = this.dataset.postId;
    try {
      const response = await fetch('/M00864763/likePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
        credentials: 'include' // Include cookies
      });
      if (response.ok) {
        const likeCountSpan = this.querySelector('.like-count');
        likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
      } else if (response.status === 401) {
        //Must be logged in
        alert('You must be logged in to like a post.');
      } else {
        throw new Error('Failed to like the post.');
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  });
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
          // Update UI
          document.querySelector('.logReg').innerHTML = `<button class="signBTN">${result.username}</button>`;
          //close pop up
          document.getElementById('signInPopup').style.display = 'none';
          alert(`Login successful. Welcome back, ${result.username}!`);
          // Refresh page
          window.location.reload();
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
//Get and display posts
async function fetchAndDisplayPosts() {
  try {
    const response = await fetch('/M00864763/getAllPosts', {
      credentials: 'include' // Include session cookies with the request
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    let posts = await response.json();

    // Sort posts by createdAt date in descending order (newest first)
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Clear current posts
    const feedContainer = document.querySelector('.feed-container');
    feedContainer.innerHTML = '';

    // Use for...of loop to append each post to the feed
    for (const post of posts) {
      await appendPostToFeed(post, feedContainer);
    }
  } catch (error) {
    console.error('Error fetching or displaying posts:', error);
  }
}
// Listem for username hovers or clicks
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayPosts().then(() => {

    setupUsernameHover();
  });
  setupUsernameClicks();
});

//Post creation / createing posts
document.addEventListener('DOMContentLoaded', (event) => {
  const submitButton = document.querySelector('.post-submit-btn');

  submitButton.addEventListener('click', async function () {
    const textContent = document.querySelector('.post-input').value;
    const imageInput = document.getElementById('imageUpload');

    // Validation: Check if both the text content is empty and no image is selected
    if (!textContent.trim() && imageInput.files.length === 0) {
      alert('Put some moves on your post, pal.');
      return; // No empty posts
    }

    const formData = new FormData();
    formData.append('textContent', textContent);

    // Only add the image file to formData if a file was selected
    if (imageInput.files.length > 0) {
      const imageFile = imageInput.files[0];
      formData.append('image', imageFile); // Append file to the form data
    }

    // Send the post request 
    try {
      const response = await fetch('/M00864763/createPost', {
        method: 'POST',
        body: formData, // Send form data
        credentials: 'include' // Cookies for session
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message

        // Clear the textarea and any other fields as necessary
        document.querySelector('.post-input').value = '';
        imageInput.value = ''; // Reset file input

        // Refresh the page to show the new post
        window.location.reload();
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

// Show uploaded file name
document.addEventListener('DOMContentLoaded', (event) => {
  const imageInput = document.getElementById('imageUpload');
  const fileNameDisplay = document.getElementById('file-name-display'); // The element where the file name will be displayed

  imageInput.addEventListener('change', function () {
    if (this.files.length > 0) {
      const file = this.files[0];
      fileNameDisplay.textContent = file.name; // Display the file name in the designated span
    } else {
      fileNameDisplay.textContent = ''; // Clear the text if no file is selected
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
        //UI update
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

//Setting the mini menu after loggin in
function setupDropdown() {
  const usernameButton = document.querySelector('.signBTN');
  const dropdownMenu = document.getElementById('dropdownMenu');

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
            window.location.reload(); //Reload page
          }
        } catch (logoutError) {
          console.error('Logout failed:', logoutError);
        }
      });
    }
  }
}
//Updating a profile
document.addEventListener('DOMContentLoaded', () => {
  const updateProfileForm = document.getElementById('updateProfileForm');

  if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent the default form submission

      // Custom validation for max length
      const bio = document.getElementById('bio');
      const location = document.getElementById('location');
      const chessRating = document.getElementById('ChessRating');

      if (bio.value.length > 50) {
        alert('Bio cannot be longer than 50 characters.');
        return; // Stop the form submission
      }

      if (location.value.length > 30) {
        alert('Location cannot be longer than 30 characters.');
        return; // Stop the form submission
      }

      // Check chess rating only if a value is provided
      if (chessRating.value && (chessRating.value < 1000 || chessRating.value > 2800)) {
        alert('Chess rating must be between 1000 and 2800.');
        return; // Stop the form submission
      }

      // Create a new FormData object and append only non-empty and valid fields
      const cleanFormData = new FormData();
      ['bio', 'location'].forEach(fieldId => {
        const fieldValue = document.getElementById(fieldId).value;
        if (fieldValue) { // Checks if the field is not empty
          cleanFormData.append(fieldId, fieldValue);
        }
      });

      //ChessRating that exists
      const chessRatingValue = chessRating.value;
      if (chessRatingValue && !isNaN(chessRatingValue) && chessRatingValue >= 1000 && chessRatingValue <= 2800) {
        cleanFormData.append('ChessRating', chessRatingValue);
      }

      // Append file if selected
      const profilePicture = document.getElementById('profilePicture').files[0];
      if (profilePicture) {
        cleanFormData.append('profilePicture', profilePicture);
      }

      try {
        const response = await fetch('/M00864763/updateProfile', {
          method: 'POST',
          body: cleanFormData, // Use the cleaned FormData
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); //Success message
          document.getElementById('updateProfilePopup').style.display = 'none'; // Close the popup
          updateProfileForm.reset();
        } else {
          const error = await response.json();
          alert(error.message);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Close popup 
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('updateProfilePopup').style.display = 'none';
  });
});

//Check lenght( field, max number of chars)
function validateLength(fieldId, maxLength) {
  const field = document.getElementById(fieldId);
  if (field.value.length > maxLength) {
    alert(`The ${fieldId} cannot be longer than ${maxLength} characters.`);
    field.value = field.value.substring(0, maxLength); // Trim the value to the maximum length
  }
}
// Get and display friend list
async function fetchAndDisplayFriends() {
  try {
    const response = await fetch('/M00864763/friends', { credentials: 'include' });
    if (!response.ok) {
      console.error(`Network response was not ok: ${response.status}`);
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const friendsList = await response.json();
    const friendsContainer = document.getElementById('friends-bar');

    // Clear the current list of friends
    friendsContainer.innerHTML = '<div class="following-text">Following</div>';

    if (Array.isArray(friendsList)) {
      friendsList.forEach(friendUsername => {
        const friendElement = document.createElement('div');
        friendElement.className = 'friend';
        friendElement.textContent = friendUsername;
        friendElement.style.marginBottom = '8px';


        friendElement.addEventListener('click', function () {
          performUserSearch(friendUsername); //See their posts
        });

        friendsContainer.appendChild(friendElement);
      });
    } else {
      console.log('Friends list is not an array:', friendsList);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Toggle friends list and fetch friends when the  friends button is clicked
document.addEventListener('DOMContentLoaded', function () {
  const friendsBtn = document.getElementById('friends');

  function toggleFriendsList() {
    let friendsBar = document.getElementById('friends-bar');
    if (friendsBar) {
      friendsBar.classList.toggle('show');
    }
  }

  if (friendsBtn) {
    friendsBtn.addEventListener('click', function () {
      fetchAndDisplayFriends(); // Fetch and display friends
      toggleFriendsList();
    });
  }
});

// Fetch user information by username
async function fetchUserInfo(username) {
  try {
    const response = await fetch(`/M00864763/userInfo/${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json(); //Return bio, location and chessRating
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Display user info box on hover
function setupUsernameHover() {
  document.addEventListener('mouseover', async (event) => {
    const username = event.target.closest('.username');
    if (username) {
      //Placeholders till info is there
      displayUserInfoBox({ bio: 'Loading...', location: 'Loading...', ChessRating: 'Loading...' }, username);

      // Fetch user info asynchronously
      const userInfo = await fetchUserInfo(username.textContent);
      if (userInfo) {
        // Update box with data
        displayUserInfoBox(userInfo, username);
      } else {
        console.log(`No user info found for ${username.textContent}`);
        hideUserInfoBox();
      }
    }
  });


}

// Show the user bio, location and rating
function displayUserInfoBox(userInfo, targetElement) {
  let userInfoBox = document.getElementById('user-info-box');
  if (!userInfoBox) {
    userInfoBox = document.createElement('div');
    userInfoBox.id = 'user-info-box';
    document.body.appendChild(userInfoBox);
  }

  // Store the receiver's username in a data attribute
  userInfoBox.setAttribute('data-username', targetElement.textContent);

  //HTML for box
  userInfoBox.innerHTML = `
    <button id="follow">Follow</button>
    <p><strong>Bio:</strong> ${userInfo.bio}</p>
    <p><strong>Location:</strong> ${userInfo.location}</p>
    <p><strong>Chess Rating:</strong> ${userInfo.ChessRating}</p>
    <input type="text" id="message-input" placeholder="Type a message...">
    <button id="send-message">Send</button>
  `;

  const rect = targetElement.getBoundingClientRect();
  userInfoBox.style.position = 'absolute';
  userInfoBox.style.top = `${rect.bottom + window.scrollY}px`;
  userInfoBox.style.left = `${rect.left + window.scrollX}px`;

  userInfoBox.style.display = 'block';
  const followButton = userInfoBox.querySelector('#follow');
  followButton.onclick = async function () {
    const usernameToFollow = targetElement.textContent.trim();
    try {
      const response = await fetch('/M00864763/followUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameToFollow }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Error following user.');
    }

    const sendMessageButton = userInfoBox.querySelector('#send-message');
    const messageInput = userInfoBox.querySelector('#message-input');

    //Send message listener
    sendMessageButton.addEventListener('click', function () {
      const messageContent = messageInput.value.trim();
      if (messageContent) {

        const sender = 'currentUserUsername';
        const receiver = targetElement.textContent.trim();

        sendMessage(sender, receiver, messageContent);
        messageInput.value = ''; //Clear input after sending
      } else {
        alert('Please enter a message to send.');
      }
    });
  }
};
// Listen if clicked outside of the User box
function setupDocumentClickListener() {
  document.addEventListener('click', function (event) {
    const userInfoBox = document.getElementById('user-info-box');
    if (userInfoBox && !userInfoBox.contains(event.target)) {
      userInfoBox.style.display = 'none';
    }
  });
}

setupDocumentClickListener();

// Function to setup username click event listeners

function setupUsernameClicks() {
  const usernames = document.querySelectorAll('.username');
  usernames.forEach(username => {
    username.addEventListener('click', async (event) => {
      const userInfo = await fetchUserInfo(username.textContent);
      if (userInfo) {
        displayUserInfoBox(userInfo, username);
      } else {
        console.log(`No user info found for ${username.textContent}`);
      }
    });
  });
}

//Search for users posts
async function performUserSearch(input) {
  if (!input) {
    alert('Please enter a search term.');
    return;
  }

  let url;
  // If hashtag
  if (input.startsWith('#')) {

    const hashtag = encodeURIComponent(input.slice(1));
    url = `/M00864763/getPostsByHashtag/${hashtag}`;
  } else {
    const username = encodeURIComponent(input);
    url = `/M00864763/getPostsByUsername/${username}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    const posts = await response.json();

    // Clear the current feed
    const feedContainer = document.querySelector('.feed-container');
    feedContainer.innerHTML = '';

    // Append each post to the feed
    if (posts.length === 0) {
      feedContainer.innerHTML = '<p>No posts found.</p>';
    } else {
      posts.forEach(appendPostToFeed);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while searching: ' + error);
  }
}
// Send messages
function sendMessage(sender, receiver, messageContent) {
  const messageData = {
    sender: sender,
    receiver: receiver,
    content: messageContent,
    createdAt: new Date()
  };

  fetch('/M00864763/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Message sent:', data);

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
//listen for sending messages
document.addEventListener('click', function (event) {
  if (event.target && event.target.id === 'send-message') {
    const userInfoBox = event.target.closest('#user-info-box');
    const receiver = userInfoBox.getAttribute('data-username');
    const messageInput = document.querySelector('#message-input');
    const messageContent = messageInput.value.trim();

    if (messageContent) {
      const sender = 'currentSessionUser';
      sendMessage(sender, receiver, messageContent);
      alert("Message sent to " + receiver);
      messageInput.value = '';
    } else {
      alert('Please enter a message to send.');
    }
  }
});

//Open message bar
document.addEventListener('DOMContentLoaded', () => {
  const messagesIcon = document.getElementById('messages');
  const messageBar = document.getElementById('message-bar');

  messagesIcon.addEventListener('click', async function () {
    const messages = await fetchMessages();
    //Clear message bar if no messages
    messageBar.innerHTML = '';

    if (messages && messages.length > 0) {
      displayMessages(messages, messageBar);
    } else {

      messageBar.innerHTML = '<p>No messages found.</p>';
    }
    messageBar.style.display = 'block';
  });
});
//Get messages
async function fetchMessages() {
  try {
    const response = await fetch('/M00864763/getMessages', {
      credentials: 'include'
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Network response was not ok.');
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    alert('Failed to load messages. Please try again.');
  }
}
//Show messages
function displayMessages(messages, container) {
  container.innerHTML = '<h1>Inbox</h1>'; //If there are any messgaes
  messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    // Message html
    messageElement.innerHTML = `
      <p><strong>From:</strong> ${message.sender}</p>
      <p><strong>Message:</strong> ${message.content}</p>
      <p><strong>Sent:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
      <button class="mark-read">Mark as Read</button>
    `;
    container.appendChild(messageElement);


    const markReadButton = messageElement.querySelector('.mark-read');
    markReadButton.addEventListener('click', () => markMessageAsRead(message._id, messageElement));
  });
}

//Mark messages as read function
async function markMessageAsRead(messageId, messageElement) {
  try {
    const response = await fetch('/M00864763/markMessageAsRead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId }),
      credentials: 'include',
    });

    if (response.ok) {
      console.log('Message marked as read');

      messageElement.remove();
    } else {
      throw new Error('Failed to mark the message as read');
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}
// Get and Display user profile picture
function fetchAndDisplayUserProfilePicture(username) {
  const imageUrl = `/M00864763/getUserProfilePicture/${username}`;

  fetch(imageUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const imageObjectURL = URL.createObjectURL(blob);
      const imgElement = document.createElement('img');
      imgElement.src = imageObjectURL;
      imgElement.alt = 'Profile Picture';
      document.getElementById('profilePictureContainer').appendChild(imgElement);
    })
    .catch(error => {
      console.error('Error fetching profile picture:', error);
    });
}
//If logged in show their profile picture
document.addEventListener('DOMContentLoaded', async () => {
  //Check if user is logged in
  try {
    const loginCheckResponse = await fetch('/M00864763/checkLogin', { credentials: 'include' });
    if (loginCheckResponse.ok) {
      const loginCheckResult = await loginCheckResponse.json();
      if (loginCheckResult.loggedIn) {
        // Userlogged in, now fetch their profile picture
        const profilePicResponse = await fetch(`/M00864763/getUserProfilePicture/${loginCheckResult.username}`);
        if (profilePicResponse.ok) {
          const profilePicBlob = await profilePicResponse.blob();
          document.getElementById('userProfilePic').src = URL.createObjectURL(profilePicBlob);
        } else {
          console.error('Failed to fetch profile picture.');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Calculate the time since the post was made
function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  return Math.floor(seconds) + "s";
}
// Display the chess puzzle modal
document.addEventListener('DOMContentLoaded', (event) => {
  let modal = document.getElementById("myModal");
  let btn = document.getElementById("puzzles");
  let span = document.getElementsByClassName("close")[0];

  // Check if button exists
  if (btn) {
    btn.onclick = function () {
      modal.style.display = "block";
    }
  } else {
    console.error("Button with id 'puzzles' not found.");
  }

  span.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});



