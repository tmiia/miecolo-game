
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
    timeToGenerateHive = 10000,
    timeToChangeState = 5000,
    nbHive = 0,
    winPoints = 300,
    lives = 3,
    isAllHivesCreated=false,
    honeyPot = 3;
    chrono = 300000;

let timer1,
  timer2;

const actionBtn = document.querySelectorAll(".game__action"),
  scale = document.querySelector('.game__scale');

const hiveTemplate = document.getElementById("template-hive"),
  hiveContainer = document.querySelector(".game__hives-container");

let scoreInterface = document.querySelector("#score");
let honeyPotInterface = document.querySelector('.honey-pot');
let lifeInterface = document.querySelector('#lives');
// let hiveInfo = document.querySelectorAll('.hive-info');

class Hive {
  constructor(id) {
    this.id = id;
    this.isActive = false,
    this.state = {
      type : null,
      name : null,
      startTime: null,
    },
    this.timeLoose = 4500,
    this.looseTimer = null,
    this.isDone = false,
    this.isDead = false,
    this.scale = false
  }

  changeHiveState = function () {
    if (!this.isActive) {
      this.isActive = true;
      // DONNE VALEUR STATE DE MANIÈRE ALÉATOIRE :
      this.state.type = listStates[Math.floor(Math.random() * listStates.length)];
      // MARQUE LA DATE DE REF DU CHANGEMENT D'ETAT
      this.state.startTime = new Date().getTime();

      this.looseTimer = setTimeout(() => {
        if (this.isDone === false) {
          console.log("une ruche de -");
          this.loose();
        }
        else{

          clearTimeout(this.looseTimer);
        }
      }, this.timeLoose);

      if(this.state.type === 'threat' ){
        let sortedListInte = interactions.filter(interaction => interaction !== 'smoke' && interaction !== 'harvest');
        this.state.name = sortedListInte[Math.floor(Math.random() * sortedListInte.length)];

      }
      else{
        console.log(this.state.type)
      }

      let hiveElColor = document.querySelector("[data-id='"+ this.id +"']");
      let hives = document.querySelectorAll(".hives");
      hives.forEach(hive => {
        hive.className = "hives";
        hive.querySelector('img').style.display = "none";
        
      })

      if (this.state.type === 'harvest') {
        hiveElColor.classList.add("harvest");
        hiveElColor.style.backgroundImage = "url('../../assets/img-hives/ruche_mielAbeille.svg')";

      }
      else {
        if (this.state.name === 'rain') {
          hiveElColor.classList.add("rain");
          hiveElColor.querySelector('img').src = "../../assets/img-hives/pluie.svg";
          hiveElColor.querySelector('img').style.display = "block";

        }
        else {
          hiveElColor.classList.add("repair");
          hiveElColor.querySelector('img').src = "../../assets/img-hives/voleur.svg";
          hiveElColor.querySelector('img').style.display = "block";
        }
      }


      

    }
    else {

      this.isActive = false;
      this.state.type = null;
      this.state.name = null;
    }
  };

  checkHiveState = function () {
    if (this.state.type === 'threat') {
      if (this.state.name === 'rain') {
        return 'rain'
      }
      else {
        return 'repair'
      }
    }
    else if (this.state.type === 'harvest') {
      return "harvest"
    }
  }

  win = function () {
    const now = new Date().getTime();


    this.isDone = true;
    this.isActive = false;
    clearTimeout(this.looseTimer);

    // A SUPP
    document.querySelector("[data-id='"+ this.id +"']").className = "hives";
    document.querySelector("[data-id='"+ this.id +"']").style.backgroundImage = "url('../../assets/img-hives/ruche_normale.svg') "
    console.log('je suis là')
    

    return (now - this.state.startTime) / 1000;
  }

  loose = function () {
    this.isActive = false;
    lives--;
    this.isDead = true;
    updateLives();
    document.querySelector("[data-id='"+ this.id +"']").style.backgroundImage = "url('../../assets/img-hives/ruche_normale.svg')";
    console.log("omg");
    destroyHive(this.id);

    if (lives < 1) {
      play = false;
      clearInterval(timer1);
      clearInterval(timer2);

      document.querySelector(".result").style.display = "block";
      

      alert("GameOver... Merci d'avoir joué !");
      window.scrollTo(0, 300);
      score = 0
      clearInterval(scoreInterval);
    }
  }

  action = function (hiveState){

    let hiveElColor = document.querySelector("[data-id='"+ this.id +"']");
    
      if(hiveState === 'harvest'){
        if (interaction === 'smoke') {
          isSmoke = true;
          score += winPoints/2;
          // document.querySelector(`[data-id='${hive.id}']`).classList.add("smoked");
          hiveElColor.querySelector('img').src = "../../assets/img-hives/fumée.svg";
          hiveElColor.style.backgroundImage = "url('../../assets/img-hives/ruche_miel.svg')" ;
          hiveElColor.querySelector('img').style.display = "block";

          updateScore();
        }
        else if (interaction === 'harvest'){
          if(isSmoke){
            isSmoke = false;
            updateHoneyPot();
            let ratio = this.win(selectHive(this.id));
            ratioScore(ratio);
            

            hiveElColor.querySelector('img').style.display = "none";
            // hiveElColor.style.backgroundImage = "url('../../assets/img-hives/ruche_normale.svg')" ;
            updateScore();
          }
          else{
            if(score >= 150){
            score -= winPoints/2;
            }else{
              score=0;
            }
            updateScore();

            this.loose();
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

            this.loose();

        }
    }
    else {
      if (hiveState === 'rain' && interaction === hiveState){
          
          let ratio = this.win(selectHive(this.id));
          ratioScore(ratio);
          hiveElColor.querySelector('img').style.display = "none";
          updateScore();
        }
        else if (hiveState === 'repair' && interaction === hiveState){

          let ratio = this.win(selectHive(this.id));
          ratioScore(ratio);
          hiveElColor.querySelector('img').style.display = "none";
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
          this.loose();
        }
      }
    }
};



function game() {
  initHive();
  buyScale();
  toggleScale();
  document.querySelector('.btn-start').style.display = "none";

    chronoGlobal = setInterval(() => {
      chrono -= 60000;
      if(chrono <= 0){
     
        endGame();
        alert('gameover');
        clearInterval(chronoGlobal);
      } 
    },60000);


    //score augmente tous les 7 millièmes de secondes
    scoreInterval = setInterval(() => {
      updateScore();
      score ++;

    }, 700);

    // changement d'état des ruches
    timer1 = setInterval(() => {
      let min = Math.ceil(1);
      currentId = Math.round(Math.random() * (Math.floor(listHives.length) - min) + min)
      if(selectHive(currentId).isActive === false){
        selectHive(currentId).changeHiveState();
      }
    }, timeToChangeState);

    // créer les ruches
    timer2 = setInterval(() => {
      if (nbHive < maxHives && isAllHivesCreated === false) {
        createHive(listHives.length + 1);
      }
    }, timeToGenerateHive);


  actionBtn.forEach(action => {
    action.addEventListener('click', () => {
      interaction = action.dataset['type'];
      cursorAnim(interaction);
    })
  })
}


function buyScale() {
  scale.addEventListener('click', () => {
    if (honeyPot >= 3) {
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
  honeyPot++;
  toggleScale();
  honeyPotInterface.innerText = `HoneyPot : ${honeyPot}`;
}

function updateScore() {
  scoreInterface.innerHTML = `Score : ${score}`;
}

function updateLives(){
  lifeInterface.innerHTML = `Life : ${lives}`;
}

function ratioScore(ratio) {
  if (ratio < 2) {
    score += winPoints * 2, 5;
    console.log('moins de 1 seconde');
  }
  else if (2 <= ratio < 3) {
    score += winPoints * 2;
    console.log('moins de 3 secondes');
  }
  else {
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
  nbHive === maxHives ? isAllHivesCreated = true : isAllHivesCreated = false;
  

  const hive = new Hive(newId);
  listHives.push(hive);
  let hives = document.querySelectorAll(".hives");
  hives.forEach(hive =>{
    hive.style.backgroundImage = "url('../../assets/img-hives/ruche_normale.svg')";
    hive.style.backgroundRepeat = "no-repeat";
    hive.style.backgroundPosition = "center";
  })


  newHive.addEventListener('click', ()=>{
    let currentHive = selectHive(parseInt(newHive.dataset['id']));
    cursorAnim(null)
    if (interaction != null && currentHive.isActive) {
      currentHive.action(currentHive.checkHiveState());
    }
    else if (isScaleSelected) {
      currentHive.scale = true;
      toggleScale();
      isScaleSelected = false;
      // A SUPP
      newHive.classList.add('scale');
      currentHive.timeLoose += 2000;
    }
  })
}

function destroyHive(id) {
  document.querySelector(`[data-id='${id}']`).classList.add("destroy");
  console.log('ruche destroy');
}

function initHive() {
  for (let i = 0; i < 2; i++) {
    createHive(i + 1);
  }
}

function selectHive(id) {
  for (var i = 0; i < listHives.length; i++) {
    if (listHives[i].id === id) {
      return listHives[i];
    }
  }
}

function cursorAnim(inteName) {
  document.querySelector(".game").className = "game";
  document.querySelector(".game").classList.add(inteName);
  actionBtn.forEach(action => {
    const imgEl = action.querySelector('img');
    if (imgEl) {
      imgEl.style.visibility = "visible";
    }
  });
  scale.querySelector('img').style.visibility = "visible";
  if(inteName != "scale" && inteName != null){
    document.querySelector(`[data-type='${inteName}']`).querySelector('img').style.visibility = "hidden";
  }
  else if (inteName === 'scale') {
    console.log('cursor scale');
    scale.querySelector('img').style.visibility = "hidden";
  }
}
