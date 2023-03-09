const listStates = ['harvest', 'threat']
const interactions = ['smoke', 'hornet', 'harvest', 'repair']
let nbHive = 0;
const listHives = [];
const listInteractions = [];
let score = 0;

class Hive {
  constructor(id){
    this.id = id;
    this.isActive = false,
    this.state = {
      type : null,
      name : null
    },
    this.timer = null,
    this.timeLoose = 15,
    this.isDone = false
  }
  changeHiveState = function() {
    if(!this.isActive) {
      console.log("isActive : false");
      this.isActive = true;
      // De manière aléatoire, state.type prend une des valeur de listStates et ensuite selon si c'est un harvest ou une threat lui donner une intéraction
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
      console.log('menace');
      // Ici on va update le score selon le type d'intéraction et le l'état de la ruche
    }
    else if (hive.state.type === 'harvest'){
      console.log('récolte');
      // Pareil ici on gère aussi le score et le nb de pots miel
    }
    else{
      console.log("erreur : la ruche n'est pas active");
      // Normalement on n'est jamais censé arriver à ce cas là mais bon
    }
  }
}

function initInteractions() {
  for (var i = 0; i < interactions.length; i++){
    const interaction = new Interaction(i + 1 ,interactions[i], interactions[i] === 'harvest' ? 300 : 200);
    listInteractions.push(interaction);
  }
}
initInteractions()

function selectInteraction(id) {
  for (var i = 0; i < listInteractions.length; i++){
    if(listInteractions[i].id === id){
      return listInteractions[i];
    }
  }
}

function selectHive(id) {
  for (var i = 0; i < listHives.length; i++){
    if(listHives[i].id === id){
      return listHives[i];
    }
  }
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







//   JEUX D'ESSAI

const amountOfHives = 2;
// create hives
for (var i = 0; i < amountOfHives; i++){
  const hive = new Hive(i + 1);
  listHives.push(hive);
}

selectInteraction(3).checkHiveState(selectHive(2).changeHiveState());

// iterate over the array of listHives created and log their id
// for (var i = 0; i < listHives.length; i++){
//   console.log(listHives[i].id);
// }
