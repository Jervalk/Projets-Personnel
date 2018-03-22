window.onload = init;

var gameFramework;
var cercle;



function init(){

    gameFramework = new GameFramework();

    gameFramework.init();

}
//on place ces variables en dehors du bloc GameFameWork car on les appelle aussi en dehors de ce block
let graphiqueArray = [];
let colorArray = ['#5C4B51','#8CBEB2','#F2EBBF','#F3B562','#F06060'];
let colorArray2 = ['#2C3E50','#FC4349','#D7DADB','#6DBCDB','#D0BDFF'];

function GameFramework(){
    let canvas,ctx,w,h;
    //let graphiqueArray = [];

    function init(){

        console.log("La page est chargée correctement");
        canvas = document.querySelector("#myCanvas");
        ctx = canvas.getContext("2d");
        w = canvas.width;
        //console.log(w);
        h = canvas.height;
        //cercle = gameFramework.creerCercle();
        //console.log(cercle);
        requestAnimationFrame(animate);

    }
//Fonction qui va permettre d'animer le canvas, de creer les elements à partir du tableau graphiqueArray
    function animate(){

        ctx.clearRect(0,0,w,h);

        //cercle.draw(ctx);
        //cercle.move();
        //cercle.colisions(w,h);
        //console.log(cercle);

        graphiqueArray.forEach(function(i) {

            ctx.save();
            i.draw(ctx);
            i.move();
            i.colisions(w, h);
            i.interationsMouse();
            i.colisionCercles();


            ctx.restore();

        });
        requestAnimationFrame(animate);
    }
//Fonction qui creer un cercle et qui le place dans le tableau
    function creerCercle(n){
        for(var i = 0; i < n ; i++){

            //let radius =  (Math.random() * 20)  + 3;
            let radius = Math.random() *15 + 3;
            let x = randomIntFromRange(radius, w - radius);
            let y = randomIntFromRange(radius, h - radius);
            //let x = w * Math.random();
            //let y = h * Math.random();
            //let r = Math.round(255 * Math.random());
            //let g = Math.round(255 * Math.random());
            //let b = Math.round(255 * Math.random());
            //let couleur = 'rgb(' + r + ',' + g + ',' + b + ')';
            //console.log("couleur =" + couleur);
            let couleur = colorArray[Math.floor(Math.random() * colorArray.length)];

            //let vx = Math.random();
            //let vy = Math.random();

            if( i !== 0){
                for(let j = 0; j < graphiqueArray.length ; j++){
                    if(distance(x,y, graphiqueArray[j].y, graphiqueArray[j].y) - radius * 2 < 0){
                        x = randomIntFromRange(radius,w - radius);
                        y = randomIntFromRange(radius, h - radius);

                        j=-1;
                    }
                }
            }
            //return new Cercles(x,y,couleur,radius,vx,vy);
            //console.log(vx);
            let cercle = new Cercles(x,y,couleur,radius);
            graphiqueArray.push(cercle);
            //console.log(cercle);
            //console.log(graphiqueArray.length);
        }
    }
    function reset(){
        //on réinitialise le tableau => objet = 0
        //Utilisé dans la fonction animationCercles()
        graphiqueArray = [];
    }
    //retourne les méthodes API et les attributs utilisés en dehors du blocks GameFrameWork
    return{
        init:init,
        creerCercle:creerCercle,
        reset:reset,
    }
}

class ObjetsGraphiques{

    constructor(posX, posY, color,w, h){
        this.x = posX;
        this.y = posY;
        this.couleur = color;
        //this.vitesseX = vx;
        //this.vitesseY = vy;
        this.width = w;
        this.height = h;

    }

    draw(ctx){
        ctx.save();

        ctx.restore();
    }

}

class Cercles extends ObjetsGraphiques {
    constructor(posX, posY, color, r) {
        super(posX, posY, color, 2 * r, 2 * r);
        this.radius = r;
        this.minimunRadius = r;
        this.velocite = {
            x: Math.random()- 0.5,
            y: Math.random()- 0.5,
        };

        this.mass = 1;
    }
//Fonction qui dessine un cercle selon les parametres de l'objet cercle qui est une extension d'objetGraphique
    draw(ctx) {

        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        //ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        //draw(ctx);
        super.draw(ctx);
    }
//Fonction qui permet de faire bouger les cercles
    move(){
        this.x += this.velocite.x;
        this.y += this.velocite.y;
    }
// Fonction qui detecte les collisions entre les cercles et les contours du canvas.
    colisions(w, h) {
        if ((this.x + this.width / 2) > w) {
            this.x = w - this.width / 2;
            this.velocite.x = - this.velocite.x;
        }

        if ((this.x - this.width / 2) < 0) {
            this.x = this.width / 2;
            this.velocite.x = - this.velocite.x;
        }

        if ((this.y + this.height / 2 ) > h) {
            this.y = h - this.height / 2;
            this.velocite.y = - this.velocite.y;
        }

        if ((this.y - this.height / 2) < 0) {
            this.y = this.height / 2;
            this.velocite.y = - this.velocite.y;
        }
    }
//Fonction qui appelle une fonction qui calcule la collision entre plusieurs cercles
// qui prend en parametres le cercle courant et un autre cercle genere dans le canvas.
    colisionCercles(){

        for(let k = 0; k < graphiqueArray.length ; k++){
            if(this === graphiqueArray[k]) continue;
            console.log()
            if(distance(this.x ,this.y, graphiqueArray[k].x, graphiqueArray[k].y)
                - this.radius * 2 < 0){
                //console.log('Collision detectée');
                problemeCollision(this, graphiqueArray[k]);

            }

        }
    }
//Fonction qui va permettre d'augmenter la taille des cercles selon un rayon
    interationsMouse() {
        if (mouse.x - this.x < 60 && mouse.x - this.x > -60
            && mouse.y - this.y < 60 && mouse.y - this.y > -60
        ) {
            if (this.radius < 40) {
                this.radius += 1;
            }
        }
        else if (this.radius > this.minimunRadius) {
            this.radius -= 1;
        }
    }
}

var mouse = {
    x:undefined,
    y:undefined
}
//On recupere la position actuelle de la souris grace à l'objet event

window.addEventListener('mousemove',
    function(event) {
    //console.log(event);
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse);

});


//Fonction qui va permettre d'éviter l'apparition cercles à l'exterieux du canvas.
function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1 ) + min);
}
//Fonction qui calcule la distance entre deux points en x et en y .
function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
}

//Fonction qui va créer des cercles selon le nombre etant dans l'input : de base il est de 100
function animationCercle(nb){

    gameFramework.reset();

    gameFramework.creerCercle(nb);
    //gameFramework.colisionCercle();


}
// On augmente la vitesse de l'element avec l'event listener oniput situé dans l'index
function changerVitessePlus(){

    for (let i = 0 ; i < graphiqueArray.length ; i ++){
        if((graphiqueArray[i].velocite.x <= 6) && (graphiqueArray[i].velocite.y <= 6)){
            graphiqueArray[i].velocite.x += 2;
            graphiqueArray[i].velocite.y += 2;
        }
        else
            graphiqueArray[i].velocite.x = 0.5;
            graphiqueArray[i].velocite.y = 0.5;
    }
}
// On réduit la vitesse de l'element avec l'event listener oniput situé dans l'index
function changerVitesseMoins(){
    for(let i = 0 ; i < graphiqueArray.length ; i ++){
        if((graphiqueArray[i].velocite.x > 0.5) || (graphiqueArray[i].velocite.y > 0.5)) {
            graphiqueArray[i].velocite.x -= 0.5;
            graphiqueArray[i].velocite.y -= 0.5;
        }
        else
            graphiqueArray[i].velocite.x = 0.5;
            graphiqueArray[i].velocite.y = 0.5;
    }
}


/*Fonction qui va permettre de changer de couleur selon le choix cliqué dans le navigateur
* Selon le choix 1 : l'acces couleur du tableau graphiqueArray va prendre comme valeur aléatoire une valeur
* du tableau1 colorArray.
* Même chose pour le choix 2 : colorArray2
*/
function changerCouleur(value){

    var select = document.getElementById("toto");
    var option = select.options[select.selectedIndex].value;
     //console.log(option);

     if (select.options[select.selectedIndex].value != 1){
         for(let i = 0 ; i < graphiqueArray.length; i ++){
             graphiqueArray[i].couleur = colorArray2[Math.floor(Math.random() * colorArray2.length)];
         }
     }
     else{
         for(let j = 0 ; j < graphiqueArray.length; j ++){
             graphiqueArray[j].couleur = colorArray[Math.floor(Math.random() * colorArray.length)];
         }
     }


}

//Fonction d'angle de rotation selon la vitesse
function rotate(velocite, angle) {
    const rotationRapportAngleVitesse = {
        x: velocite.x * Math.cos(angle) - velocite.y * Math.sin(angle),
        y: velocite.x * Math.sin(angle) + velocite.y * Math.cos(angle)
    };

    return rotationRapportAngleVitesse;
}
//Fonction qui permet de resoudre les problemes de collisions entre cercles, notamment de les faire rebondir entre eux
//selon l'angle de collision
function problemeCollision(element, autreElement) {
    const velociteDiffx = element.velocite.x - autreElement.velocite.x;
    const velociteDiffy = element.velocite.y - autreElement.velocite.y;

    const xDist = autreElement.x - element.x;
    const yDist = autreElement.y - element.y;

    // Condition qui permettra d'éviter que les cercles se superposent.
    if (velociteDiffx * xDist + velociteDiffy * yDist >= 0) {

        // Variable qui prend l'angle entre les deux cercles lors de la collision.
        const angle = -Math.atan2(autreElement.y - element.y, autreElement.x - element.x);

        // On stocke la masse dans une varible pour un meilleurs effet de collision entre les cercles
        const mass1 = element.mass;
        const mass2 = autreElement.mass;

        // Vitesse de deplacement avant l'équation
        const u1 = rotate(element.velocite, angle);
        const u2 = rotate(autreElement.velocite, angle);

        // Vitesse de deplement après la premiere collision de l'équation
        const v1 = { x: u1.x * (mass1 - mass2) / (mass1 + mass2) + u2.x * 2 * mass2 / (mass1 + mass2), y: u1.y };
        const v2 = { x: u2.x * (mass1 - mass2) / (mass1 + mass2) + u1.x * 2 * mass2 / (mass1 + mass2), y: u2.y };

        // Vitesse finale après rotation de l'axe vers l'emplacement d'origine
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Effet rebond
        element.velocite.x = vFinal1.x;
        element.velocite.y = vFinal1.y;

        autreElement.velocite.x = vFinal2.x;
        autreElement.velocite.y = vFinal2.y;
    }
}



