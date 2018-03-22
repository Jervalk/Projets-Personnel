window.onload = init;

var gameFramework;
//var cercle;

function init(){

    gameFramework = new GameFramework();

    gameFramework.init();

}

let graphiqueArray = [];
function GameFramework(){
    let canvas,ctx,w,h;
    //let graphiqueArray = [];
    let colorArray = ['#5C4B51','#8CBEB2','#F2EBBF','#F3B562','#F06060'];
    let colorArray2 = ['#2C3E50','#FC4349','#D7DADB','#6DBCDB','#D0BDFF'];
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

    function animate(){

        ctx.clearRect(0,0,w,h);

        //cercle.draw(ctx);
        //cercle.move();
        //cercle.colisions(w,h);
        //console.log(cercle);

        graphiqueArray.forEach(function(i) {
            i.draw(ctx);
            i.move();
            i.colisions(w, h);
            i.interationsMouse();
            i.colisionCercles();

        });


        requestAnimationFrame(animate);
    }

    function creerCercle(){
        for(var i = 0; i < 100 ; i++){

            //let radius =  (Math.random() * 20)  + 3;
            let radius = 10;
            let x = randomIntFromRange(radius, w - radius);
            let y = randomIntFromRange(radius, h - radius);
            //let x = w * Math.random();
            //let y = h * Math.random();
            //let r = Math.round(255 * Math.random());
            //let g = Math.round(255 * Math.random());
            //let b = Math.round(255 * Math.random());
            //let couleur = 'rgb(' + r + ',' + g + ',' + b + ')';
            //console.log("couleur =" + couleur);
            let couleur = colorArray2[Math.floor(Math.random() * colorArray.length)];


            let vx = 2 * Math.random();
            let vy = 2 * Math.random();
            //console.log(vy);
            if( i !== 0){
                for(let j = 0; j < graphiqueArray.length ; j++){
                    if(distance(x,y, graphiqueArray[j].positionX, graphiqueArray[j].positionY) - radius * 2 < 0){
                        x = randomIntFromRange(radius,w - radius);
                        y = randomIntFromRange(radius, h - radius);

                        j=-1;
                    }
                }
            }
            //return new Cercles(x,y,couleur,radius,vx,vy);
            //console.log(vx);
            let cercle = new Cercles(x,y,couleur,radius,vx,vy);
            graphiqueArray.push(cercle);
            //console.log(graphiqueArray.length);
        }
    }
    return{
        init:init,
        creerCercle:creerCercle,
        //colisionCercle:colisionCercle
    }
}

class ObjetsGraphiques{

    constructor(posX, posY, color, vx, vy, w, h){
        this.positionX = posX;
        this.positionY = posY;
        this.couleur = color;
        this.vitesseX = vx;
        this.vitesseY = vy;
        this.width = w;
        this.height = h;
        this.mass = 1;


    }
    draw(ctx){
        ctx.save();

        ctx.restore();
    }
    move() {
        this.positionX += this.vitesseX;
        this.positionY += this.vitesseY;
    }
    deplacementX(){
        this.vitesseX = - this.vitesseX;
    }
    deplacementY(){
        this.vitesseY = - this.vitesseY;
    }

    colisions(w,h){
        if(((this.positionX + this.width)>w) || (this.positionX < 0)){
            this.deplacementX();
        }

        if(((this.positionY + this.height)>h) || (this.positionY < 0)){
            this.deplacementY();
        }
    }
}

class Cercles extends ObjetsGraphiques {
    constructor(posX, posY, color, r, vx, vy) {
        super(posX, posY, color, vx, vy, 2 * r, 2 * r);
        this.radius = r;
        this.minimunRadius = r;
        this.mass = 1;
    }

    draw(ctx) {

        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        //ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        //draw(ctx);
        super.draw(ctx);
    }

    colisions(w, h) {
        if ((this.positionX + this.width / 2) > w) {
            this.positionX = w - this.width / 2;
            this.deplacementX();
        }

        if ((this.positionX - this.width / 2) < 0) {
            this.positionX = this.width / 2;
            this.deplacementX();
        }

        if ((this.positionY + this.height / 2 ) > h) {
            this.positionY = h - this.height / 2;
            this.deplacementY();
        }

        if ((this.positionY - this.height / 2) < 0) {
            this.positionY = this.height / 2;
            this.deplacementY();
        }
    }

    colisionCercles(){
        for(let k = 0; k < graphiqueArray.length ; k++){
            if(this === graphiqueArray[k]) continue;
            console.log()
            if(distance(this.positionX ,this.positionY, graphiqueArray[k].positionX, graphiqueArray[k].positionY)
                - this.radius * 2 < 0){
                //console.log('Collision detectée');
                //resolveCollision(this, graphiqueArray[k]);

            }

        }
    }

    interationsMouse() {
        if (mouse.x - this.positionX < 40 && mouse.x - this.positionX > -40
            && mouse.y - this.positionY < 40 && mouse.y - this.positionY > -40
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

function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1 ) + min);
}

function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
}



var mouse = {
    x:undefined,
    y:undefined
}
window.addEventListener('mousemove',
    function(event) {
        //console.log(event);
        mouse.x = event.x;
        mouse.y = event.y;
        //console.log(mouse);

    })


function animationCercle(){
    gameFramework.creerCercle();
    //gameFramework.colisionCercle();

}





