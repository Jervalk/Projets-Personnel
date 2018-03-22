class Monstre extends Forme{

    constructor(name, posX ,posY, couleur, vitesseX, vitesseY, width, height, degat, cout, pv, card){
        super(posX, posY, couleur, vitesseX, vitesseY, width, height);
        this.name = name;
        this.degat = degat;
        this.cout = cout;
        this.card = card;
        this.pv = pv;
        //this.src = this.loadSrc();
    }

    loadSrc(){
        return Assets.getSrcImage(this.name);
    }

    testCollision(touche){
        if(!((this.posX >= touche.posX + touche.width) || (this.posX + this.width <= touche.posX) || (this.posY >= touche.posY + touche.height) || (this.posY + this.height <= touche.posY))){
            //console.log("vrai");
            attaquant.monstres.splice(attaquant.monstres.indexOf(this), 1);
            this.attaquer(touche);
            if(this.degat <= 10)
                startDoubleExplosion(this.posX, this.posY, this.couleur);
            else if(this.degat > 10)
                startBigExplosion(this.posX, this.posY);
        }
    }

    isDead(){
        return (this.pv <= 0);
    }

    baisserVie(degats){
        this.pv -= degats;
    }

    attaquer(touche){
        touche.pv -= this.degat;
    }

    setPositions(x, y){
        this.posX = x;
        this.posY = y;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.posX, this.posY);
        //ctx.fillStyle = this.couleur;
        ctx.fillText(this.pv, 15, 0);
        ctx.drawImage(this.card ,0, 0, this.width, this.height);

        ctx.restore();
    }



    getSrc(){
        return this.src;
    }
}


class Follower extends Monstre{
    constructor(name, posX ,posY, couleur, vitesseX, vitesseY, width, height, degat, cout, pv, card){
        super(name, posX, posY, couleur, vitesseX, vitesseY, width, height, degat, cout, pv, card);
        this.angle = 0;
    }

    suivre(posX, posY){

        this.angle = this.calculerAngle(posX, posY);
        if (posX < this.posX) this.angle += Math.PI;

        this.posX += Math.cos(this.angle) * this.vitesseX;
        this.posY += Math.sin(this.angle) * this.vitesseY;
        //console.log(this.angle);
    }

    calculerAngle(posX, posY){
        return  Math.atan((this.posY - posY)/(this.posX - posX));
    }

    whosFollowed(){
        if(this.vitesseX < 1 || this.vitesseY < 1) //se dirige vers la base
            return 0;
        else
            return 1; //se dirige vers le défenseur
    }
}