let attaquant, defenseur;
let particles = [];
let padConnected = false;
let canShoot = true;
let gamepad = new Gamepad();
let width,height;
let cptDropped = 0;
let armeOnPitch = false;
let armesOnPitch = [];
let showZoneNonDraggable = false;
let pauseState = false;
let finState = false;
let imgLoaded = false;
let deckCreated = false;
let assetsLoaded = 0;
let assetsCards = [];
let assetsPlayer = [];
let assetsPersos = [];
let TXT_FIN = "";
const timeToPlay = 150000; //2 minutes 30
let cptTimer = 0;
let minuteur = timeToPlay;

let background = new Image();
const SRC = "../img/squareClashTitle.jpg";

function Engine() {

    let canvas, ctx;

    function init() {
        canvas = document.querySelector("#game");
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;

        Assets.loadImage(callbackAssetsCards, "cartes");
        Assets.loadImage(callbackAssetsPersonnages, "personnages");
        Assets.loadImage(callbackAssetsPlayer, "joueur");

        document.querySelector("#game").style.marginLeft = "30px";

        /*attaquant = creerAttaquant();
        defenseur = creerDefenseur();*/
        //creerDeck();

        background.src = SRC;

        gamepad.on('connect', function (event) {
            padConnected = true;
        });

        gamepad.on('hold', 'd_pad_up',function (event) {
            defenseur.vitesseY = -5;
        });

        gamepad.on('hold', 'd_pad_down',function (event) {
            defenseur.vitesseY = 5;
        });

        gamepad.on('hold', 'd_pad_left',function (event) {
            defenseur.vitesseX = -5;
        });

        gamepad.on('hold', 'd_pad_right',function (event) {
            defenseur.vitesseX = 5;
        });

        gamepad.on('release', 'd_pad_up',function (event) {
            defenseur.vitesseY = 0;
        });

        gamepad.on('release', 'd_pad_down',function (event) {
            defenseur.vitesseY = 0;
        });

        gamepad.on('release', 'd_pad_left',function (event) {
            defenseur.vitesseX = 0;
        });

        gamepad.on('release', 'd_pad_right',function (event) {
            defenseur.vitesseX = 0;
        });

        gamepad.on('press', 'start', function (event) {
            pauseState = !pauseState;
        });

        // PS4 : X et XBOX : A
        gamepad.on('press', 'shoulder_bottom_right',function (event) {

            if(canShoot){
                defenseur.tirer();
            }
            canShoot = false;
            //console.log(defenseur.armes);
            //console.log("defenseur pos -> "+defenseur.posX+", "+defenseur.posY);
        });

        gamepad.on('press', 'shoulder_top_right', function (event) {
            console.log(event.button);
            defenseur.changerArme(event.button);
        });

        // Joystick droit
        gamepad.on('hold', 'stick_axis_right', function (event) {
            defenseur.tourner(event.value[0], event.value[1]);
            //console.log(defenseur.posX);
        });

        window.addEventListener('keydown', function(event){
            if (event.keyCode === 81) {

                defenseur.vitesseX = 5;

            }else if (event.keyCode === 68) {

                defenseur.vitesseX = -5;

            }else if(event.keyCode === 83){

                defenseur.vitesseY = -5;

            }else if(event.keyCode === 90){

                defenseur.vitesseY = 5;
            }else if(event.keyCode === 80){
                // touche P
                pauseState = !pauseState;
            }
        }, false);

        //clavier non touché
        window.addEventListener('keyup', function(event){
            defenseur.vitesseY = 0;
            defenseur.vitesseX = 0;
        }, false);

        lancerTimer();

        requestAnimationFrame(anime);
    }

    function anime(){

        ctx.clearRect(0, 0, width, height);

        if(imgLoaded){
            jeu();
        }else{
            chargement();
        }
        requestAnimationFrame(anime);

    }

    function jeu() {
        if(pauseState){
            jeuPause();
        }else if(finState){
            lancerFinJeu();
        }else{

            drawMinuteur();
            cptTimer+=1;

            defenseur.draw(ctx);
            defenseur.drawVie(ctx);
            defenseur.testeCollisionZone(width, height);

            setTimeout(function () {
                canShoot = true;
            }, defenseur.getArmeActive().getIntervalleTir());
            defenseur.move();

            defenseur.base.draw(ctx);
            defenseur.base.drawVie(ctx);

            defenseur.armeActive.draw(ctx);
            defenseur.armeActive.updatePos(defenseur.posX, defenseur.posY);

            spawnArme();
            armesOnPitch.forEach(function (arme) {
                arme.drawSpawned(ctx);
            });

            defenseur.armeActive.missiles.forEach(function (missile) {
                missile.draw(ctx);
                missile.move();
                missile.testCollisionEnnemi(attaquant.monstres, defenseur.armeActive.missiles);
                if(missile.testeCollisionZone(width, height)){
                    defenseur.armeActive.missiles.splice(defenseur.armeActive.missiles.indexOf(missile), 1);
                }
            });

            attaquant.monstres.forEach(function (monstre) {
                monstre.draw(ctx);
                //monstre.move();
                monstre.testeCollisionZone(width, height);
                if(monstre.whosFollowed() === 1){
                    monstre.suivre(defenseur.posX, defenseur.posY);
                    monstre.testCollision(defenseur);
                }else if(monstre.whosFollowed() === 0){
                    monstre.suivre(defenseur.base.posX, defenseur.base.posY);
                    monstre.testCollision(defenseur.base);
                }

            });

            particles.forEach(function (particle) {
                if(particle.testeCollisionZone(width, height)){
                    particles.splice(particles.indexOf(particle), 1);
                }
            });

            defenseur.collisionArme(armesOnPitch);

            if(showZoneNonDraggable)
                attaquant.drawZoneNonDraggable(ctx);

            updateAndDrawParticules(10, ctx);
            if(deckCreated)
                updateMana();

            if(cptTimer === 60){
                minuteur -= 1000;
                cptTimer = 0;
            }


            checkFin();
        }

    }

    function drawMinuteur() {
        ctx.save();

        let min = Math.trunc(minuteur/60000);
        let sec = minuteur/1000%60;

        ctx.font = "bold 16pt Helvetica";
        ctx.fillStyle = "white";
        ctx.fillText(min+" : "+sec, 30, 30);

        ctx.restore();
    }
    
    function callbackAssetsCards(loaded, instanceImg) {
        //console.log(instanceImg.getAttribute("src"));
        if(loaded){
            assetsLoaded += 1;
            assetsCards.push(instanceImg);
        }
    }

    function callbackAssetsPersonnages(loaded, instanceImg) {
        //console.log(instanceImg.getAttribute("src"));
        if(loaded){
            assetsLoaded += 1;
            assetsPersos.push(instanceImg);
        }
    }

    function callbackAssetsPlayer(loaded, instanceImg) {
        //console.log(instanceImg.getAttribute("src"));
        if(loaded){
            assetsLoaded += 1;
            assetsPlayer.push(instanceImg);
        }
    }

    
    function jeuPause() {
        ctx.save();

        ctx.drawImage(background, 0, 0, width, height);

        ctx.fillStyle = 'bold 16pt Helvetica';
        ctx.fillText("PAUSE", width/2, height/2);

        ctx.restore();
    }

    function chargement() {

        //nb objets chargés sur le nombre d'objets à charger
        if(assetsLoaded / Assets.getLengthAllAssets() === 1){
            imgLoaded = true;
            attaquant = creerAttaquant();
            defenseur = creerDefenseur();
            creerDeck();
        }

        ctx.save();

        ctx.fillStyle = 'bold 16pt Helvetica';
        ctx.fillText("CHARGEMENT...", width/2, height/2);

        ctx.restore();
    }

    function creerAttaquant() {

        let x = 250;
        let y = 250;
        console.log(assetsPersos);

        return new Attaquant(assetsPersos);
    }

    function creerDefenseur() {

        let x = 250;
        let y = 250;

        return new Defenseur(x, y, "rgb(125,125,125)", 0, 0, 50, 50, 100, assetsPlayer);
    }

    function updateMana() {
        //document.querySelector("#mana").parentNode.innerHTML = "Mana : "+attaquant.mana;
        document.querySelector("#mana").value = attaquant.mana;
    }

    /**
     * S'éxecute uniquement si les ressources (cartes) sont chargées
     */
    function creerDeck() {
        let zoneAttaquant = document.querySelector("#zoneAttaquant");

        //mana
        let progressMana = document.createElement("meter");
        progressMana.id = "mana";
        progressMana.value = attaquant.mana;
        progressMana.max = attaquant.mana;
        progressMana.min = 0;

        let ul = document.createElement("ul");
        ul.id = "listeMonstres";

        for(let i=0; i<assetsCards.length; i++){
            let li = document.createElement("li");
            //var img = document.createElement("img");
            let img = assetsCards[i];
            img.setAttribute("draggable", "true");
            img.setAttribute("ondragstart", "engine.dragStartHandler(event);");
            img.setAttribute("ondragend", "engine.dragEndHandler(event);");
            img.setAttribute("data-value", assetsCards[i].name);
            //li.innerHTML = Monstre.getMonstres()[i].name;
            //img.src = Monstre.getMonstres()[i].getSrc();
            li.appendChild(img);
            ul.appendChild(li);
        }
        document.body.insertBefore(progressMana ,zoneAttaquant);

        zoneAttaquant.appendChild(ul);

        deckCreated = true;
    }

    function dragStartHandler(event) {
        event.dataTransfer.setData("monstre", event.target.dataset.value);
        console.log("start drag");
        showZoneNonDraggable = true;
    }

    function dragEndHandler() {
        showZoneNonDraggable = false;
    }
    
    function spawnArme() {
        let size = Arme.getArmes().length-1;
        if(!armeOnPitch){
            let arme = Arme.getArmes()[Math.round(Math.random()*size)];
            arme.posX = Math.round(Math.random()*width);
            arme.posY = Math.round(Math.random()*height);
            armesOnPitch.push(arme);
        }
        armeOnPitch = true;
    }
    
    function dropHandler(event) {
        let x = event.clientX;
        let y = event.clientY;
        console.log(x+" / "+event.clientY);

        showZoneNonDraggable = false;
        let data = event.dataTransfer.getData("monstre");

        if(attaquant.iCanDrag(event.clientX, event.clientY)){
            let index = getMonstreIndex(data);
            //attaquant.ajouterMonstre(attaquant.getMonstres()[index], x, y);
            attaquant.ajouterMonstre(attaquant.getMonstres(data), x, y);

            if(cptDropped === 0){
                attaquant.regenererMana();
                cptDropped += 1;
            }
        }else{
            console.log("zone de dépôt de monstre dépassé");
        }
    }

    function getMonstreIndex(name) {
        let index = 0;

        switch (name){
            case "BUFFATATOR":
                index=0;
                break;
            case "DONATELLO":
                index=1;
                break;
            case "DUBOITAGE":
                index=2;
                break;
            case "FUKOUSHIMA":
                index=3;
                break;
            case "KARIBOUCHON":
                index=4;
                break;
            case "MIRANDALOUSE":
                index=5;
                break;
            case "TETTAMINATOR":
                index=6;
                break;
            case "TOUNSISAILLE":
                index=7;
                break;
            default:
                index=0;
        }
        return index;
    }

    function lancerFinJeu() {
        ctx.save();
        ctx.font = "16pt bold Helvetica";
        ctx.fillStyle = "white";
        ctx.fillText(TXT_FIN, width/2, height/2);

        ctx.restore();
    }

    function lancerTimer() {
        let timer = setTimeout(function () {
            finState = true;
        }, timeToPlay);
        TXT_FIN = "Le défenseur a gagné";
    }

    function checkFin() {
        if(defenseur.pv <= 0 || defenseur.base.pv <= 0){
            TXT_FIN = "L'attaquant a gagné";
            finState = true;
        }
    }

    return{
        init,
        dropHandler,
        dragStartHandler,
        dragEndHandler
    }

}