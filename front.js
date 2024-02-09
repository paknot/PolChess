//Redirection to home page after clicking on logo
document.addEventListener('DOMContentLoaded', (event) => {
    loadBackgroundColor();
   //big brother listens
    const logoLink = document.getElementById('home');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
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
    searchButton.addEventListener('click', function() {
        
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
    searchInput.addEventListener('blur', function() {
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

document.addEventListener('click', function(event) {
  // Only add/remove spin class if clicked element is the settings button
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

document.addEventListener('DOMContentLoaded', (event) => {
    loadBackgroundColor();

    // Redirect to login page
    const signInButton = document.querySelector('.sign-in-btn'); 
    if (signInButton) {
        signInButton.addEventListener('click', function() {
            window.location.href = '/M00864763/login';
        });
    }
    function loadLoginForm() {
        document.getElementById('login').innerHTML = `
          <div class="login-form">
            <h2>Sign in</h2>
            <form id="loginForm">
              <input type="text" id="username" placeholder="User name or email">
              <input type="password" id="password" placeholder="Password">
              <input type="submit" value="SIGN IN">
              <div class="alternative-actions">
                <a href="#">Register</a>
                
              </div>
            </form>
          </div>
        `;
    }
    // Load the login form if on the login page
    if (window.location.pathname === '/M00864763/login') {
        loadLoginForm();
    } else {
        console.log("Error max");
    }
});

function loadUserProfile() {
    const pathSegments = window.location.pathname.split('/');
    const username = pathSegments[pathSegments.length - 1]; // Gets the last segment of the path
  
    // check if path for user
    if (pathSegments.length === 3 && pathSegments[1].toLowerCase() === 'm00864763' && username) {
      fetch(`/api/users/${username}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(user => {
          if (user.username) {
            document.getElementById('profile-name').textContent = `Welcome to the profile of ${user.username}`;
          } else {
            document.getElementById('profile-name').textContent = 'Username property not found';
          }
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('profile-name').textContent = 'Error loading profile';
        });
    }
  }
  //load user profile prototype
  document.addEventListener('DOMContentLoaded', () => {
    loadBackgroundColor(); //load bg
  
    
    if (window.location.pathname.startsWith('/M00864763/') && !window.location.pathname.endsWith('/login')) {
        loadUserProfile();
      }
  
   
  });