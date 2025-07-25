const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

function emailSend() {
  const isRegister = container.classList.contains("active");
  const formBox = isRegister
    ? document.querySelector(".form-box.register")
    : document.querySelector(".form-box.login");

  const usernameInput = formBox.querySelector('input[type="text"]');
  const emailInput = formBox.querySelector('input[type="email"]');

  const name = usernameInput?.value || "User";
  const email = emailInput?.value;

  if (!email) {
    console.log("No email found. Skipping email send.");
    return;
  }

  emailjs
    .send("service_9lgtczo", "template_dme6h29", {
      user_name: name,
      user_email: email,
    })
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Confirmation email sent to your address!");
        formBox.querySelector("form")?.reset(); // Optional: clear form after sending
      },
      function (error) {
        console.log("FAILED...", error);
        alert("Error sending email.");
      }
    );
}
