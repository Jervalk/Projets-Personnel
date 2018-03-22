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
            ctx.save();
            i.draw(ctx);
            i.move();
            i.colisions(w, h);
            //i.colisionCanvas();
            i.colisionCercles();
            i.interationsMouse();

            ctx.restore();

        });


        requestAnimationFrame(animate);
    }

    function creerCercle(){
        for(var i = 0; i < 100 ; i++){

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

            //console.log(vy);
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

            //console.log(graphiqueArray.length);
        }
    }
    return{
        init:init,
        creerCercle:creerCercle,
        //colisionCercle:colisionCercle
    }
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
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

    /*move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }

    deplacementX(){
        this.vitesseX = - this.vitesseX;
    }
    deplacementY(){
        this.vitesseY = - this.vitesseY;
    }*/

    /*colisions(w,h){
        if(((this.x + this.width)>w) || (this.x < 0)){
            this.velocity.x = - this.velocity.x;

        }

        if(((this.y + this.height)>h) || (this.y < 0)){
            this.velocity.y = - this.velocity.y;
        }
    }*/
}

class Cercles extends ObjetsGraphiques {
    constructor(posX, posY, color, r) {
        super(posX, posY, color, 2 * r, 2 * r);
        this.radius = r;
        this.minimunRadius = r;
        this.velocity = {
            x: Math.random()- 0.5,
            y: Math.random()- 0.5,
        };
        this.mass = 1;
    }

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

    move(){
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    colisions(w, h) {
        if ((this.x + this.width / 2) > w) {
            this.x = w - this.width / 2;
            this.velocity.x = - this.velocity.x;
        }

        if ((this.x - this.width / 2) < 0) {
            this.x = this.width / 2;
            this.velocity.x = - this.velocity.x;
        }

        if ((this.y + this.height / 2 ) > h) {
            this.y = h - this.height / 2;
            this.velocity.y = - this.velocity.y;
        }

        if ((this.y - this.height / 2) < 0) {
            this.y = this.height / 2;
            this.velocity.y = - this.velocity.y;
        }
    }

    colisionCercles(){

        for(let k = 0; k < graphiqueArray.length ; k++){
            if(this === graphiqueArray[k]) continue;
            console.log()
            if(distance(this.x ,this.y, graphiqueArray[k].x, graphiqueArray[k].y)
                - this.radius * 2 < 0){
                //console.log('Collision detectée');
                resolveCollision(this, graphiqueArray[k]);

            }

        }
    }

    interationsMouse() {
        if (mouse.x - this.x < 40 && mouse.x - this.x > -40
            && mouse.y - this.y < 40 && mouse.y - this.y > -40
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
window.addEventListener('mousemove', function(event) {
    //console.log(event);
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse);

});


function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1 ) + min);
}

function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
}

function animationCercle(){

    gameFramework.creerCercle();
    //gameFramework.colisionCercle();

}


