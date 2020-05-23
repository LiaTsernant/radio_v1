
// gets register form
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', handleRegister);

function handleRegister(event) {
  event.preventDefault();
  const userData = {};

  // creates array from form input values
  const formInputs = [...registerForm.elements];

  formInputs.forEach((input) => {
    userData[input.name] = input.value;
  });

  console.log(userData)
  fetch('/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
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