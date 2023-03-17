const emailInput = document.getElementById('email');
const pseudoInput = document.getElementById('pseudo');
function saveInfo() {
  if(emailInput.value != '' && pseudoInput != ''){
    let user = {
      pseudo: pseudo.value,
      email: emailInput.value
    };

    let userJSON = JSON.stringify(user);

    localStorage.setItem("user", userJSON);
  }
}
