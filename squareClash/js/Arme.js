class Arme extends Forme{

    constructor(name, posXJoueur, posYJoueur, couleur, degat, capacite, intervalleTir){
        super(posXJoueur, posYJoueur, couleur, 0, 0, 30, 10);
        this.name = name;
        this.degat = degat;
        this.intervalleTir = intervalleTir;
        this.capaciteChargeur = capacite;
        this.ballesDispo = capacite;
        this.son = this.loadSrc();
        this.missiles = [];
    }

    loadSrc(){
        return Assets.getSrcAudio(this.name);
    }

    tirer(x, y, angle){
        //console.log(this.posX);
        if(this.ballesDispo !== 0){
            //console.log("balles dispo "+this.ballesDispo);
            this.missiles.push(new Missile(this.couleur, x, y, 12, 12, defenseur.vitesseX, defenseur.vitesseY, angle, this.degat));
            this.ballesDispo -= 1;
            this.jouerSon();
        }else{
            this.recharger();
        }
    }

    draw(ctx){
        ctx.save();

        ctx.translate(this.posX+15, this.posY-10);
        ctx.fillStyle = this.couleur;
        ctx.translate(defenseur.centreX-15, defenseur.centreY+10);
        ctx.rotate(defenseur.angle);
        ctx.translate(-defenseur.centreX+15, -defenseur.centreY-10);
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.restore();
    }

    drawSpawned(ctx){
        ctx.save();

        ctx.translate(this.posX, this.posY);
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.restore();
    }

    static getArmes(){
        return [new Arme("PISTOLET" ,0, 0, "rgb(255, 255, 255)", 10, 10, 500),
            new Arme("DESTRUCTOR" ,0, 0, "rgb(150,134,253)", 100, 5, 1000)
        ];
    }

    getIntervalleTir(){
        return this.intervalleTir;
    }

    updatePos(x, y){
        this.posX = x;
        this.posY = y;
    }

    recharger(){
        this.ballesDispo = this.capaciteChargeur;
    }

    jouerSon(){
        let audio = new Audio(this.son);
        audio.play();
    }
}
