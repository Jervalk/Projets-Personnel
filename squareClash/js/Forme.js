class Forme{

    constructor(posX ,posY, couleur, vitesseX, vitesseY, width, height){
        this.posX = posX;
        this.posY = posY;
        this.couleur = couleur;
        this.vitesseX = vitesseX;
        this.vitesseY = vitesseY;
        this.width = width;
        this.height = height;
    }

    draw(ctx){
        ctx.save();

        ctx.translate(this.posX, this.posY);
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    move() {
        this.posX += this.vitesseX;
        this.posY += this.vitesseY;
    }

    inverseSensDeplacementX() {
        this.vitesseX = -this.vitesseX;
    }

    stopX(){
        this.posX = 0;
    }

    stopY(){
        this.posY = 0;
    }

    inverseSensDeplacementY() {
        this.vitesseY = -this.vitesseY;
    }

    testeCollisionZone(w, h) {

        if(((this.posX+this.width) >  w)) {
            //this.inverseSensDeplacementX();
            this.posX = w-this.width;

        }else if(this.posX <= 0){
            this.stopX();
        }

        if(((this.posY+this.height) >  h)) {
            this.posY = h-this.height;
        }else if(this.posY < 0){
            this.stopY();
        }
    }
}

class Missile extends Forme{
    constructor(couleur, defPosX, defPosY, width, height, vitesseX, vitesseY, angle, degat){
        super(defPosX+Math.sin(angle) - Math.cos(angle), defPosY - Math.cos(angle) - Math.sin(angle), couleur, 10*Math.cos(angle-Math.PI/2), 10*Math.sin(angle-Math.PI/2), width, height);
        this.angle = angle;
        this.degat = degat;
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle);
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    move(){
        //console.log("vitesse x : "+this.vitesseX);
        this.posX += this.vitesseX;
        this.posY += this.vitesseY;
    }

    testCollisionEnnemi(ennemis, missiles){
        //console.log('posX : '+this.posX);
        for(let i=0; i<ennemis.length ; i++){
            if(!((this.posX >= ennemis[i].posX + ennemis[i].width) || (this.posX + this.width <= ennemis[i].posX) || (this.posY >= ennemis[i].posY + ennemis[i].height) || (this.posY + this.height <= ennemis[i].posY))){

                ennemis[i].baisserVie(this.degat);
                missiles.splice(this, 1);

                if(ennemis[i].isDead()){
                    ennemis.splice(ennemis.indexOf(ennemis[i]), 1);
                    startDoubleExplosion(this.posX, this.posY);
                }
            }
        }
    }

    testeCollisionZone(w, h) {

        if(((this.posX+this.width) >  w) || (this.posX <= 0) || ((this.posY+this.height) >  h) || (this.posY < 0)) {
            return true;
        }
    }
}
