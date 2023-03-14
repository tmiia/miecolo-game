const listStates = ['harvest', 'threat'];
const interactions = ['smoke', 'hornet', 'harvest', 'repair'];
let nbHive = 0;
const listHives = [];
const listInteractions = [];
let score = 0;
let isSmoke = false;
const actionBtn =  document.querySelectorAll(".game__action");
const hiveTemplate = document.getElementById("template-hive");
const hiveContainer = document.querySelector(".game__hives-container");

class Hive {
  constructor(id){
    this.id = id;
    this.isActive = false,
    this.state = {
      type : 'harvest',
      name : 'harvest'
    },
    this.timer = null,
    this.timeLoose = 5,
    this.isDone = false,
    this.isDead = false
  }
  changeHiveState = function() {
    if(!this.isActive) {
      console.log("isActive : false");
      this.isActive = true;
      let looseCountdown = new Date().setSeconds(new Date().getSeconds() + this.timeLoose);
      let looseInterval;



      countdown(looseCountdown, looseInterval);
      looseInterval = setInterval(() => {
        countdown(looseCountdown, looseInterval);
      }, 1000);
      console.log("finito masterclass");

      looseDelay = setTimeout(() => {
        console.log("finito");
        if(!this.isDone){
          console.log("c'est la loooooooooooooooose");
          this.isDead = true;
        }
        clearTimeout(looseDelay);
      }, (this.timeLoose * 1000));
    }
    else{
      console.log("isActive : true");
      this.isActive = false;
      this.state.type = null;
      this.state.name = null;
    }
  };
};

class Interaction {
  constructor(id, type, point){
    this.id = id,
    this.type = type,
    this.point = point  // J'ai finalment mis ça dans l'objet parce que je me dis que pour on gagne plus de bonus qu'on récolte du miel
  }
  checkHiveState(hive){
    if(hive.state.type === 'threat'){
      if(hive.state.name === 'hornet'){
        return 'hornet'
      }
      else{
        return 'repair'
      }
    }
    else if (hive.state.type === 'harvest'){
      console.log('récolte');
      return "harvest"
    }
  }
  action(hive, hiveState){

    if(hiveState === 'harvest'){
      if (this.type === 'smoke') {
        isSmoke = true;
        console.log("j'ai smoke ou quoi ??")
      }
      else if (this.type === 'harvest'){
        if(isSmoke){
          console.log(this.point + " miel récolté");
          hive.isDone = true;
          isSmoke = false;
        }
        else{
          console.log("-" + (this.point/2) + " miel pas récolté");
        }
      }
      else{
        console.log("-" + (this.point/2) + " miel pas récolté pas du tout la bonne interaction connard");
      }

    }
    else{
      if (hiveState === 'hornet' && this.type === hiveState){
          console.log('hornet cleared');
          hive.isDone = true;
      }
      else if (hiveState === 'repair' && this.type === hiveState){
        console.log('hive repaired');
          hive.isDone = true;
      }
      else{
        console.log('mauvaise intérction connard on perd des points');
      }
    }
  }
}

// COUNTDOWN


function countdown(countdownInterval, countdownIntervalName) {
  const now = new Date().getTime();
  const countdown = new Date(countdownInterval).getTime();
  const difference = (countdown - now) / 1000;

  if(difference < 1){
    if (countdownIntervalName) {
      endCountdown(countdownIntervalName);
    }
  }

  let minutes = Math.floor((difference % (60 * 60)) / 60);
  let secondes = Math.floor(difference % 60);

  console.log(secondes);
}

function endCountdown(countdownIntervalName) {
  clearInterval(countdownIntervalName)
}

// window.addEventListener('load', () => {
//   countdown(countdownInterval);
//   timerInterval = setInterval(() => {
//     countdown(countdownInterval);
//   }, 1000);
// })

// HANDLE HIVE

function createHive(newId) {
  const newHive = hiveTemplate.content.firstElementChild.cloneNode(true);
  newHive.dataset.id = newId;
  hiveContainer.appendChild(newHive);
}

function initHive() {
  for (let i = 0; i < 2; i++) {
    createHive(i + 1);
    const hive = new Hive(i + 1);
    listHives.push(hive);
  }
}
initHive();

function selectHive(id) {
  for (var i = 0; i < listHives.length; i++){
    if(listHives[i].id === id){
      return listHives[i];
    }
  }
}



// HANDLE INTERACTION
function initInteractions() {
  for (var i = 0; i < interactions.length; i++){
    const interaction = new Interaction(i + 1 ,interactions[i], interactions[i] === 'harvest' ? 300 : 200);
    listInteractions.push(interaction);
  }
}
initInteractions()

function selectInteraction(type) {
  for (var i = 0; i < listInteractions.length; i++){
    if(listInteractions[i].type === type){
      return listInteractions[i];
    }
  }
}
actionBtn.forEach(action =>{
  action.addEventListener('click', ()=>{
    const btnType = action.dataset['type'];
    const currentHive = selectHive(parseInt(action.dataset['hive']));
    const interaction = selectInteraction(btnType);
    const hiveState = interaction.checkHiveState(currentHive);
    interaction.action(currentHive, hiveState);
  })
})

function toggleInteractions(idHive) {
  actionBtn.forEach(action =>{
    action.disabled === true ? action.disabled = false : action.disabled = true;
    action.dataset['hive'] = idHive;
  })
}

document.querySelectorAll(".hives").forEach(hive =>{
  hive.addEventListener('click', ()=>{
    toggleInteractions(hive.dataset['id']);
  })
})




// -----------------------------------------------
// Je t'ai mis là quelques fonction que tu pourras tester avec des console.log() déjà pour commencer

function updateScoreByInteraction(point, ratio) {
  score += point * ratio;
  // Je mets ça comme ça, mais ce n'est pas figé sens toi libre de modifier
  // Cette fonction sera appellé dans checkHiveState
}

function updateScoreByTimeByInteraction(time) {
  // Cette fonction va incrémenter le score également, mais par rapport au temps prit pour gérer l'états d'une ruche
}

function updateScoreByTime() {
  // Cette fonction va incrémenter le score plus le temps passe
}




const test = selectHive(1);
test.changeHiveState();



//   JEUX D'ESSAI

// const amountOfHives = 3;
// // create hives
// for (var i = 0; i < amountOfHives; i++){
//   const hive = new Hive(i + 1);
//   listHives.push(hive);
// }

// selectInteraction(3).checkHiveState(selectHive(2).changeHiveState());

// iterate over the array of listHives created and log their id
// for (var i = 0; i < listHives.length; i++){
//   console.log(listHives[i].id);
// }
