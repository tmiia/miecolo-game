const emailInput = document.getElementById('email');
const pseudoInput = document.getElementById('pseudo');
const scoreInput = document.getElementById('score');
function saveInfo() {
  scoreInput.value = score;
  if(emailInput.value != '' && pseudoInput != ''){
    let user = {
      pseudo: pseudo.value,
      email: emailInput.value,
        score: scoreInput
    };

    let userJSON = JSON.stringify(user);

    localStorage.setItem("user", userJSON);

    do_request();
  }
}


// function do_request() {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const score = JSON.parse(localStorage.getItem('score'));
//   jQuery.ajax({
//     type: "POST",
//     url: "http://localhost/miecolo/wp-admin/admin-ajax.php",
//     data: {
//       action: 'rush_simulator_get_rank',
//       pseudo: user.pseudo,
//       email: user.email,
//       score: score
//     },
//     success: function (output) {
//       console.log("output success=", output);
//     },
//     error : function(error){ console.log("output error=", error) }
//   });
// }
