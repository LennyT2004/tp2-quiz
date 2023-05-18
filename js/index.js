// -------------------- VARIABLES
//Position associée à une question dans le tableau
let tabPositions = [];
let positionAleatoire;

//Nombre de questions répondus
let nbQuestionsRepondus = 0;
//Nombre de bonne réponses
let nbBonnesReponses = 0;

//Zone d'affichage du quiz
let zoneQuiz = document.querySelector(".quiz");

//Section contenant une question du quiz
let sectionQuestion = document.querySelector("section");
//Opacité de la section contenant la question
let opaciteSection = 0;
//Position X de la section contenant la question
let positionX = 0;

//Conteneurs des titres des questions et choix de réponses
let titreQuestion = document.querySelector(".titre-question");
let choixReponses = document.querySelector(".choix-de-reponse");

//Titre animé du quiz
let titreIntro = document.querySelector(".anim-titre-intro");

//Zone de fin du quiz
let zoneFin = document.querySelector(".fin");
let piedDePage = document.querySelector("footer");

//Bouton faisant recommencer le quiz
let btnRecommencer = document.querySelector('main.fin .btn-recommencer');

// -------------------- ÉVÈNEMENTS
//Affichage des consignes à la fin de l'animation de l'apparition
titreIntro.addEventListener("animationend", afficherConsignesPourDebutJeu);
//Bouton de redémarrage du quiz (affiché à la fin du quiz)
btnRecommencer.addEventListener('click', recommencer);

//-------------------- Local Storage - Enregistrement du meilleur score
let meilleurScore = localStorage.getItem("leMeilleurScore") || 0;

/**
 * Afficher les consignes pour débuter le jeu
 * 
@param {Event} event : objet AnimationEvent de l'événement distribué 
 */
//Affichage des consignes
function afficherConsignesPourDebutJeu(event) {
    //Si l'animation d'apparition se termine
    if (event.animationName == "apparition-titre-intro") {
        titreIntro.removeEventListener("animationend", afficherConsignesPourDebutJeu);
        //Affichage des consignes
        piedDePage.innerHTML = "<h1>Cliquer sur l'écran pour débuter le quiz</h1>";
        piedDePage.classList.add("apparition-instructions");
        //Mise d'un écouteur permettant de quitter l'intro et commencer le quiz
        document.addEventListener("click", disparaitreIntro);
    }
}

//Disparition de l'intro
function disparaitreIntro() {
    titreIntro.classList.add("disparition-titre-intro-anim");
    piedDePage.classList.add("disparition-consignes-intro-anim");

    titreIntro.addEventListener('animationend', debuterQuiz);
}

//Début du quiz
function debuterQuiz() {
    //Retrait des textes d'intro
    document.querySelector("main.intro").remove();
    //Enlèvement de l'écouteur démarrant le quiz
    document.removeEventListener("click", debuterQuiz);
    //Disposition du conteneur du quiz
    zoneQuiz.style.display = "flex";
    //Remplissage du tableau des questions
    remplirTableauPositions();
    //Affichage des questions
    afficherQuestions();
}

//Remplissage du tableau des positions des questions
function remplirTableauPositions() {
    for(let i=0; i<lesQuestions.length; i++) {
        tabPositions[i] = i;
    }
    console.log('Tableau des positions : ', tabPositions);
}

//Affichage des questions
function afficherQuestions() {
    //Nombre entier aléatoire correspondant à une position du tableau des questions
    positionAleatoire = (Math.floor(Math.random() * tabPositions.length));
    console.log('Position choisie aléatoirement : ', positionAleatoire);
    //Récupération de la question aléatoire
    let questionChoisie = lesQuestions[positionAleatoire];

    // Supprimer cette position des positions permises
    tabPositions.splice(positionAleatoire, 1);
    console.log('Tableau des positions après choix aléatoire : ', tabPositions);
    
    //Affichage du titre de la question
    titreQuestion.innerText = questionChoisie.question;
    //Création et affichage des balises choix de réponses vides au début
    choixReponses.innerHTML = "";

    //Remplissage des balises
    let unChoix;
    for (let i = 0; i < questionChoisie.choix.length; i++) {
        //Création de la balise div et affectation de la classe CSS
        unChoix = document.createElement("div");
        unChoix.classList.add("choix");
        //Intégration de la valeur du choix de réponse
        unChoix.innerText = questionChoisie.choix[i];
        //Affectation dynamique de l'index de chaque choix
        unChoix.indexChoix = i;
        //Ajout d'un évènement vérifiant la réponse choisie
        unChoix.addEventListener("mousedown", verifierReponse);
        //Affichage des choix
        choixReponses.append(unChoix);
        //Écouteurs sur les choix modifiant le style du curseur personalisé
        unChoix.addEventListener('mouseover', changerCurseurSurvole);
        unChoix.addEventListener('mouseout', changerCurseurSurvole);
    }
    //Mise de l'opacité à 0 pour l'animation d'apparition
    opaciteSection = 0;
    //Requête d'animation pour faire apparaître la question
    requestAnimationFrame(apparaitreQuestion);
}

//Vérification des réponses
function verifierReponse(event) {
    //Bloquage de la possibilité de cliquer sur un choix
    choixReponses.classList.toggle('desactiver');
    //Augmentation de 1 du nombre de questions répondus
    nbQuestionsRepondus++;
    
    //Si la réponse est bonne
    if (event.target.indexChoix == lesQuestions[positionAleatoire].reponse) {
        /* Ajout d'une bonne réponse dans la variable calculant le nombre de bonnes réponses */
        nbBonnesReponses++;
        //Animation de bonne réponse sur la boîte de choix
        event.target.classList.add("bonne-reponse");
    }
    else {
        //Aniamtion de la mauvaise réponse sur la boîte de choix
        event.target.classList.add("mauvaise-reponse");
    }
    event.target.addEventListener('animationend', disparaitreQuestion);
}

//Animation d'apparition des questions
function apparaitreQuestion() {
    //Augmentation de l'opacité graduelle
    opaciteSection += 0.0075;
    sectionQuestion.style.opacity = opaciteSection;
  
    //Nouvelle requête d'animation tant que l'opacité n'est pas égale à 1
    if (opaciteSection < 1) {
      requestAnimationFrame(apparaitreQuestion);
    }
}

//Animation de disparition des questions
function disparaitreQuestion() {
    //Baisse graduelle de la position X
    positionX -= 2;
    sectionQuestion.style.transform = `translateX(${positionX}vw)`;

    //Nouvelle requête d'animation tant que la position X n'est pas égale à -200
    if (positionX > -200) {
        requestAnimationFrame(disparaitreQuestion);
    }
    else {
        //Appel de la fonction gérant la prochaine question lorsque 
        gererProchaineQuestion();
    }
}

//Gestion de la prochaine question
function gererProchaineQuestion() {
    //Remise à 0 de la position X de la question
    positionX = 0;
    sectionQuestion.style.transform = `translateX(${positionX}vw)`;
    //Débloquage de la possibilité de cliquer sur un choix
    choixReponses.classList.toggle('desactiver');
    //Affichage d'une nouvelle question tant que l'utilisateur n'en a pas répondu à 8
    if (nbQuestionsRepondus < 8) {
        afficherQuestions();
    }
    else {
        afficherFinQuiz();
    }
}

//Affichage de la fin du quiz
function afficherFinQuiz() {
    //Retrait de la zone de quiz
    zoneQuiz.style.display = "none";
    //Création dynamique de la section contenant le résultat
    let sectionResultat = document.createElement('section');
    //Recherche du meilleur score obtenu dans localStorage
    meilleurScore = Math.max(meilleurScore, nbBonnesReponses);
    localStorage.setItem("leMeilleurScore", meilleurScore);
    //Ajout du texte correspondant au score et celui du meilleur score
    sectionResultat.innerText = "Votre score : " + nbBonnesReponses + "/8" +"\n" + "Meilleur score : " + meilleurScore + "/8";
    //Ajout de la classe .resultat pour intégrer l'aniamtion d'apparition
    sectionResultat.classList.add('resultat');
    //Insertion du résultat avant le bouton pour recommencer
    btnRecommencer.before(sectionResultat);
    //Affichage de la zone de fin du quiz
    zoneFin.style.display = "flex";
    //Affichage du bouton pour recommencer à la fin de l'animation du résultat
    sectionResultat.addEventListener('animationend', afficherBtnRecommencer);
    //Écouteurs sur les choix modifiant le style du curseur personalisé
    btnRecommencer.addEventListener('mouseover', changerCurseurSurvole);
    btnRecommencer.addEventListener('mouseout', changerCurseurSurvole);
}

//Affichage du bouton pour recommencer
function afficherBtnRecommencer() {
    //L'opacité du bouton de recommencer revient à 1
    btnRecommencer.style.opacity = '1';
}

//Recommencement du quiz
function recommencer() {
    //Mise à 0 de toutes les valeurs
    nbQuestionsRepondus = 0;
    nbBonnesReponses = 0;
    //Retrait du résultat
    let classeResultat = document.querySelector('.resultat')
    if (classeResultat == 'resultat'){
        classeResultat.remove();
    }

    //Remise de l'opacité du bouton de recommencer à 0
    btnRecommencer.style.opacity = '0';
    //Réaffichage de la zone de quiz
    zoneQuiz.style.display = 'flex';
    //Retrait de la zone de fin
    zoneFin.style.display = 'none';
    //Affichage d'une question
    afficherQuestions();
    remplirTableauPositions();
}

//-------------------- Curseur personalisé
//Saisie de l'élément HTML représentant le curseur personalisé
let curseur = document.querySelector(".curseur");
//Saisie de la racine
let racine = document.querySelector(":root");
//Ajout de l'écouteur de mouvement de la souris sur l'objet window
//qui appelera la fonction gérant le déplacement du curseur personalisé
window.addEventListener('mousemove', bougerCurseur);

//Fonction gérant le déplacement du curseur personalisé
function bougerCurseur(event) {
    // Modifiez les valeurs des propriétés personnalisées définis sur la racine 
    // du document HTML
    racine.style.setProperty("--mouse-x", event.clientX + "px");
    racine.style.setProperty("--mouse-y", event.clientY + "px");
}

function retrecirCercleCurseurClic(event) {
    if (event.type == 'mousedown') {
        curseur.classList.add('clic');
    }
    else {
        curseur.classList.remove('clic');
    }
}
//Écouteurs réduisant le cercle central du curseur personalisé lors d'un clic
document.addEventListener('mousedown', retrecirCercleCurseurClic);
document.addEventListener('mouseup', retrecirCercleCurseurClic);

//Fonction modifiant la forme du curseur personalisé lorsqu'il survole un choixà
function changerCurseurSurvole(event) {
    if (event.type == 'mouseover') {
        curseur.classList.add('c-survole');
    } 
    else {
        curseur.classList.remove('c-survole');
    }
}