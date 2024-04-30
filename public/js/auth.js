const myForm = document.querySelector("form");

const url = "http://localhost:8080/api/auth/";

function handleCredentialResponse(response) {
  // Google Token: ID_TOKEN

  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then(({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("email", user.email);
    })
    .catch(console.warn);
}

myForm.addEventListener("submit", (e = Event) => {
  e.preventDefault();

  const { email, password } = e.target;

  const formData = {
    email: email.value,
    password: password.value,
  };

  fetch(url + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

const button = document.getElementById("google_signout");
button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("email") || "", (done) => {
    localStorage.clear();
    location.reload();
  });
};
