// the search animation
document.addEventListener('DOMContentLoaded', (event) => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.querySelector('.search-container');

    // Listen for search button click
    searchButton.addEventListener('click', function() {
        // Toggle to active
        searchContainer.classList.toggle('active');

        //auto focus
        if (searchContainer.classList.contains('active')) {
            searchInput.style.visibility = 'visible';
            searchInput.value = ''; // Clear the input value
            searchInput.focus();
        } else {
            //if not active clear
            searchInput.value = '';
        }
    });

    // hiding input when not active
    searchInput.addEventListener('blur', function() {
        searchContainer.classList.remove('active');
        setTimeout(() => {
            searchInput.style.visibility = 'hidden';
        }, 500); 
    });
});
function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
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
    // Previous code for search animation and background color change here

    // Redirect to login page
    const signInButton = document.querySelector('.sign-in-btn'); // Make sure this class matches your "Sign in" button
    if (signInButton) {
        signInButton.addEventListener('click', function() {
            window.location.href = '/M00864763/login';
        });
    }
    function loadLoginForm() {
        document.getElementById('main-content').innerHTML = `
          <div class="login-form">
            <h2>Sign in</h2>
            <form id="loginForm">
              <input type="text" id="username" placeholder="User name or email">
              <input type="password" id="password" placeholder="Password">
              <input type="submit" value="SIGN IN">
              <div class="alternative-actions">
                <a href="#">Register</a>
                <a href="#">Password reset</a>
                <a href="#">Log in by email</a>
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
