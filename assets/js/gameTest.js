const listStates = ['harvest', 'threat'];
const interactions = ['smoke', 'hornet', 'harvest', 'repair'];
let nbHive = 2;
const maxHives = 8;
const listHives = [];
const listInteractions = [];
let score = 0;
let isSmoke = false;
let timeToGenerateHive = 20000;
let timeToChangeState = 7000;
const actionBtn =  document.querySelectorAll(".game__action");
const hiveTemplate = document.getElementById("template-hive");
const hiveContainer = document.querySelector(".game__hives-container");

class Hive {
  constructor(id){
    this.id = id;
    this.isActive = false,
    this.state = {
      type : null,
      name : null
    },
    this.timer = null,
    this.timeLoose = 5000,
    this.isDone = false,
    this.isDead = false,
    this.startActiveDate = null,
    this.listTimeout = []
  }

  onChange(){
    myTimeRef = new Date().getTime();
    myState = rand(4); // mise à jour de l'état de la ruche parmis (repos, recolte, réparation, killthemAll)
    upDateRender();// mis à jour de l'allure de la ruche
    myTimer = setTimeout(() => {
      onChange();
    }, tpsRand);
  }

  // activePeriod = function() {
  //   let activePeriod;
  //   activePeriod = setTimeout(() => {
  //    this.listTimeout.push(activePeriod);
  //     sleepTimeout();
  //   }, this.timeLoose);
  // }
  // sleepTimeout = function(){
  //   let sleepingPeriod;
  //   sleepingPeriod = setTimeout(() => {
  //     this.listTimeout.push(sleepingPeriod);
  //     activePeriod()
  //   }, timeToChangeState);
  // }
  startInterval =  function() {
    // if(this.sleepingPeriod && this.activePeriod){
    //   clearTimeout(this.sleepingPeriod);
    //   clearTimeout(this.activePeriod);
    // }
    let sleepingPeriod,
        activePeriod;
    sleepingPeriod = setTimeout(() => {
      if(!this.listTimeout.includes(sleepingPeriod)){
        this.listTimeout.push(sleepingPeriod);
      }
      this.changeHiveState()
      this.startActiveDate = new Date().getTime();
      activePeriod = setTimeout(() => {
        if(!this.listTimeout.includes(activePeriod)){
          this.listTimeout.push(activePeriod);
        }
        clearTimeout(activePeriod);
        clearTimeout(sleepingPeriod);
        console.log("you loose man");
        this.startInterval();
      }, this.timeLoose);
    }, timeToChangeState);
  }
  endInterval = function() {
    console.log("enfait jsuis trop nul jsuis censé clear putain")
    for (let i = 0; i < this.listTimeout.length; i++) {
      console.log(this.listTimeout[i]);
      clearTimeout(this.listTimeout[i]);
    }
  }
  changeHiveState = function() {
    if(!this.isActive) {
      console.log("isActive : false");
      this.isActive = true;
      // let looseCountdown = new Date().setSeconds(new Date().getSeconds() + this.timeLoose);
      // let looseInterval;
      // let looseDelay;

      this.state.type = listStates[Math.floor(Math.random() * listStates.length)];
      console.log(`la state de la hive ${this.state.type}`)

      if(this.state.type === 'threat' ){
        let sortedListInte = interactions.filter(interaction => interaction !== 'smoke' && interaction !== 'harvest');
        this.state.name = sortedListInte[Math.floor(Math.random() * sortedListInte.length)];
        console.log(`Voici notre liste triée avec la methode filter() ${sortedListInte} et voici name :  ${this.state.name}`);
      }

      // TEST (A SUPP)
      let hiveElColor = document.querySelector("[data-id='"+ this.id +"']");
      let hives = document.querySelectorAll(".hives");
      hives.forEach(hive =>{
        hive.className = "hives";
      })

      if (this.state.type === 'harvest') {
        console.log("test le truc harvest là");
        hiveElColor.classList.add("harvest");
      }
      else{
        console.log("test le truc threat là");
        if(this.state.name === 'hornet'){
          hiveElColor.classList.add("hornet");
        }
        else{
          hiveElColor.classList.add("repair");
        }
      }
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
          let now = new Date().getTime();
          hive.endInterval();
          let reactionTime = (now - hive.startActiveDate) / 1000;
          hive.startInterval();
          console.log(reactionTime);
          console.log(this.point + " miel récolté");
          hive.isDone = true;
          isSmoke = false;

          // A SUPP
          document.querySelector("[data-id='"+ hive.id +"']").className = "hives";
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
          let now = new Date().getTime();
          hive.endInterval();
          let reactionTime = (now - hive.startActiveDate) / 1000;
          hive.startInterval();
          console.log(reactionTime);
          // A SUPP
          document.querySelector("[data-id='"+ hive.id +"']").className = "hives";
      }
      else if (hiveState === 'repair' && this.type === hiveState){
        console.log('hive repaired');
          hive.isDone = true;
          let now = new Date().getTime();
          hive.endInterval();
          let reactionTime = (now - hive.startActiveDate) / 1000;
          hive.startInterval();
          console.log(reactionTime);
          // A SUPP
          document.querySelector("[data-id='"+ hive.id +"']").className = "hives";
      }
      else{
        console.log('mauvaise intérction connard on perd des points');
      }
    }
  }
}

// HANDLE HIVE

function createHive(newId) {
  const newHive = hiveTemplate.content.firstElementChild.cloneNode(true);
  newHive.className = "hives";
  newHive.dataset.id = newId;
  hiveContainer.appendChild(newHive);

  const hive = new Hive(i + 1);
  listHives.push(hive);

  document.querySelectorAll(".hives").forEach(hive =>{
    newHive.addEventListener('click', ()=>{
      console.log("click");
      toggleInteractions(hive.dataset['id']);
    })
  })
}

function initHive() {
  for (let i = 0; i < 2; i++) {
    createHive(i + 1);
  }
}
initHive();

/*Genereta hive by time*/
// let generateHiveCountdown = new Date().setSeconds(new Date().getSeconds() + this.timegenerateHive);
// let generateHiveInterval;

// generateHiveInterval = setInterval(() => {
//   countdown(generateHiveCountdown, generateHiveInterval);
//   createHive(listHives.length + 1);
//   const hive = new Hive(listHives.length + 1);
//   listHives.push(hive);
//   nbHive ++;
//   if(nbHive == maxHives){
//     clearInterval(generateHiveInterval);
//   }
// }, timeToGenerateHive);

// /* Change hive state by time */
// changeHiveStateInterval = setInterval(() => {
//   let min = Math.ceil(1);
//   currentId = Math.round(Math.random() * (Math.floor(listHives.length) - min) + min)
//   if(selectHive(currentId).isActive === false){
//     hiveToChange = selectHive(currentId);
//     hiveToChange.changeHiveState();
//   }
// }, timeToChangeState)


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




// const test = selectHive(1);
selectHive(1).startInterval();



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
