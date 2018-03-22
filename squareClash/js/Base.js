class Base extends Forme{

    constructor(posX ,posY, couleur, width, height){
        super(posX, posY, couleur, 0, 0, width, height);
        this.pv = 200;
    }

    baisserPv(degat){
        this.pv -= degat;
    }

    drawVie(ctx){
        ctx.save();
        ctx.font = 'bold 16pt Helvetica';
        ctx.fillStyle = "white";
        ctx.textAlign = 'center';
        ctx.fillText("Pv : "+this.pv, this.posX+50, this.posY-5);
        ctx.restore();
    }
}