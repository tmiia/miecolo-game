
const listStates = ['harvest', 'threat'],
      interactions = ['smoke', 'rain', 'harvest', 'repair'],
      maxHives = 8,
      listHives = [],
      listInteractions = [];


let play = true,
    interaction = null,
    isScaleSelected = false,
    score = 0,
    isSmoke = false,
    timeToGenerateHive = 20000,
    timeToChangeState = 7000,
    nbHive = 0,
    winPoints = 300,
    lives = 3,
    honeyPot = 0;

let timer1,
    timer2;

const actionBtn =  document.querySelectorAll(".game__action"),
      scale = document.querySelector('.game__scale');

const hiveTemplate = document.getElementById("template-hive"),
      hiveContainer = document.querySelector(".game__hives-container");

let scoreInterface = document.querySelector("#score");
let honeyPotInterface = document.querySelector('.honey-pot');
// let hiveInfo = document.querySelectorAll('.hive-info');

class Hive {
  constructor(id){
    this.id = id;
    this.isActive = false,
    this.state = {
      type : null,
      name : null,
      startTime: null,
    },
    this.timeLoose = 5000,
    this.looseTimer = null,
    this.isDone = false,
    this.isDead = false,
    this.scale = false
  }

  changeHiveState = function() {
    if(!this.isActive) {
      this.isActive = true;
      // DONNE VALEUR STATE DE MANIÈRE ALÉATOIRE :
      this.state.type = listStates[Math.floor(Math.random() * listStates.length)];
      // MARQUE LA DATE DE REF DU CHANGEMENT D'ETAT
      this.state.startTime = new Date().getTime();

      if(this.state.type === 'threat' ){
        let sortedListInte = interactions.filter(interaction => interaction !== 'smoke' && interaction !== 'harvest');
        this.state.name = sortedListInte[Math.floor(Math.random() * sortedListInte.length)];
        console.log(this.state.name);
      }
      else{
        console.log(this.state.type)
      }

      // TEST (A SUPP)
      let hiveElColor = document.querySelector("[data-id='"+ this.id +"']");
      let hives = document.querySelectorAll(".hives");
      hives.forEach(hive =>{
        hive.className = "hives";
      })

      if (this.state.type === 'harvest') {
        hiveElColor.classList.add("harvest");
      }
      else{
        if(this.state.name === 'rain'){
          hiveElColor.classList.add("rain");
        }
        else{
          hiveElColor.classList.add("repair");
        }
      }


      this.looseTimer = setTimeout(() => {
        if (this.isDone === false) {

          this.loose();
        }
        else{

          clearTimeout(this.looseTimer);
        }
      }, 4000);

    }
    else{

      this.isActive = false;
      this.state.type = null;
      this.state.name = null;
    }
  };

  checkHiveState = function() {
    if(this.state.type === 'threat'){
      if(this.state.name === 'rain'){
        return 'rain'
      }
      else{
        return 'repair'
      }
    }
    else if (this.state.type === 'harvest'){
      return "harvest"
    }
  }

  win = function(){
    const now = new Date().getTime();


    this.isDone = true;
    this.isActive = false;
    clearTimeout(this.looseTimer);


    // A SUPP
    document.querySelector("[data-id='"+ this.id +"']").className = "hives";

    return (now - this.state.startTime) / 1000;
  }

  loose = function() {
    this.isActive = false;
    lives --;
    this.isDead = true;
    destroyHive(this.id);
    if (lives < 1) {
      play = false;
      clearInterval(timer1);
      clearInterval(timer2);
      alert("finito pipot !!!");
      score = 0
      clearInterval(scoreInterval);
    }
  }

  action = function (hive, hiveState){
      if(hiveState === 'harvest'){
        if (interaction === 'smoke') {
          isSmoke = true;
          score += winPoints/2;
          document.querySelector(`[data-id='${hive.id}']`).classList.add("smoked");
          updateScore();
        }
        else if (interaction === 'harvest'){
          if(isSmoke){
            isSmoke = false;
            updateHoneyPot();
            let ratio = this.win(hive);
            ratioScore(ratio);
            console.log(ratio);
            updateScore();
          }
          else{
            // changeColorScore();
            if(score >= 150){
            score -= winPoints/2;
            }else{
              score=0;
            }
            updateScore();
          }
        }
        else{
          // changeColorScore();
          if(score >= 150){
            score -= winPoints/2;
            }else{
              score=0;
            }
          updateScore();
        }

      }
      else{
        if (hiveState === 'rain' && interaction === hiveState){
          ratio = this.win(hive);
          ratioScore(ratio);
          updateScore();
        }
        else if (hiveState === 'repair' && interaction === hiveState){
          ratio = this.win(hive);
          ratioScore(ratio);
          updateScore();
        }
        else{
          // changeColorScore();
          if(score >= 150){
            score -= winPoints/2;
            }else{
              score=0;
            }
          updateScore();

        }
      }
  }
};


function game() {
  initHive();
  buyScale();

    //score augmente toutes les secondes
    scoreInterval = setInterval(() => {
      updateScore();
      score ++;
    }, 1000);

    timer1 = setInterval(() => {
      let min = Math.ceil(1);
      currentId = Math.round(Math.random() * (Math.floor(listHives.length) - min) + min)
      if(selectHive(currentId).isActive === false){
        selectHive(currentId).changeHiveState();
        document.querySelector(`[data-id='${currentId}']`).querySelector('.hive-info-time').innerText = selectHive(currentId).timeLoose;
      }
    }, timeToChangeState);

    timer2 = setInterval(() => {
      if (nbHive < maxHives) {
        createHive(listHives.length + 1);
      }
    }, timeToGenerateHive);


  actionBtn.forEach(action =>{
    action.addEventListener('click', ()=>{
      interaction = action.dataset['type'];
      cursorAnim(interaction);
    })
  })
}



function buyScale() {
  scale.addEventListener('click', ()=>{
    if(honeyPot >= 3){
      honeyPot -= 3;
      isScaleSelected = true;
      interaction = null;
      honeyPotInterface.innerText = `HoneyPot : ${honeyPot}`;
      cursorAnim('scale');
    }
  })
}

function toggleScale() {
  honeyPot >= 3 ? scale.disabled = false : scale.disabled = true;
}

function updateHoneyPot() {
  honeyPot ++;
  toggleScale();
  honeyPotInterface.innerText = `HoneyPot : ${honeyPot}`;
}

function updateScore(){
  scoreInterface.innerHTML = `Score : ${score}`;

}

function ratioScore(ratio){
  if(ratio < 2){
    score += winPoints*2,5;
    console.log('moins de 1 seconde');
  }
  else if(2 <= ratio < 3){
    score += winPoints*2;
    console.log('moins de 3 secondes');
  }
  else{
    score += winPoints;
    console.log('plus de 3 secondes');
  }
}

// function changeColorScore(){
//   scoreInterface.style.color = "red";
//   colorScore = setTimeout(() => {
//     scoreInterface.style.color = "black";
//     console.log('mettre en noir');
//   },1000);
//   clearTimeout(colorScore);
// }

function createHive(newId) {
  const newHive = hiveTemplate.content.firstElementChild.cloneNode(true);
  newHive.className = "hives";
  newHive.dataset.id = newId;
  hiveContainer.appendChild(newHive);
  nbHive ++;

  const hive = new Hive(newId);
  listHives.push(hive);

  newHive.addEventListener('click', ()=>{
    let currentHive = selectHive(parseInt(newHive.dataset['id']));
    cursorAnim(null)
    if (interaction != null && currentHive.isActive) {
      currentHive.action(currentHive, currentHive.checkHiveState());
    }
    else if(isScaleSelected){
      currentHive.scale = true;
      toggleScale();

      // A SUPP
      newHive.classList.add('scale');
      currentHive.timeLoose += 2000;
    }
  })
}

function destroyHive(id) {
  document.querySelector(`[data-id='${id}']`).classList.add("destroy");
}

function initHive() {
  for (let i = 0; i < 2; i++) {
    createHive(i + 1);
  }
}

function selectHive(id) {
  for (var i = 0; i < listHives.length; i++){
    if(listHives[i].id === id){
      return listHives[i];
    }
  }
}

function cursorAnim(inteName){
  document.querySelector(".game").className = "game";
  document.querySelector(".game").classList.add(inteName);
  console.log(inteName)
  actionBtn.forEach(action => {
    const imgEl = action.querySelector('img');
    if (imgEl) {
      imgEl.style.visibility = "visible";
    }
  });
  scale.style.visibility = "visible"
  if(inteName != "scale" && inteName != null){
    document.querySelector(`[data-type='${inteName}']`).querySelector('img').style.visibility = "hidden";
  }
  else if(inteName === 'scale'){
    console.log('cursor scale');
    scale.querySelector('img').style.visibility = "hidden";
  }
}
