// Select the form
const loginForm = document.getElementById('login-form');

// Add eventListener to handle login process
loginForm.addEventListener('submit', handleLogin);

function handleLogin(event) {
  event.preventDefault();
  const userData = {};

  const formInputs = [...loginForm.elements];
  formInputs.forEach((input) => {
    userData[input.name] = input.value;
  });
  console.log(userData)

  fetch('/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'credentials': 'include',
    },
    body: JSON.stringify(userData)
  }).then((res) => res.json())
    .then((res) => {
      if (res.status === 200) {
        // storing userId in local storage, coming from login route
        localStorage.setItem("token", res.token);
        window.location = '/host_login';
      }
    })
    .catch((err) => console.log(err));
};