const TXT_DRAGGABLE = "Zone de dépôt";

class Player extends Forme{

    constructor(posX ,posY, couleur, vitesseX, vitesseY, width, height, pv){
        super(posX, posY, couleur, vitesseX, vitesseY, width, height);

    }

}

class Attaquant{

    constructor(assets){
        this.assets = assets;
        this.mana = 10;
        this.monstres = [];
        this.zoneDraggable = [width/2, height];
        this.allMonsters = this.createMonster();
    }

    baisserMana(perte){
        this.mana -= perte;
    }

    regenererMana(){

        let intervalle = null;
        let self = this;

        if(this.mana !== 10){
            intervalle = setInterval(function () {
                if(pauseState)
                    return;
                if(self.mana < 10){
                    self.incrementerMana();
                }
            }, 2500);
        }else{
            console.log("pas regenerer...");
            if(intervalle !== null)
                clearInterval(intervalle);
        }
    }

    getMana(){
        return this.mana;
    }

    incrementerMana(){
        this.mana += 1;
    }

    ajouterMonstre(monstre, x, y){

        monstre.setPositions(x, y);

        if(monstre.cout > this.mana || this.mana === 0){
            console.log("mana trop faible");
        }else{
            this.baisserMana(monstre.cout);
            this.monstres.push(monstre);
        }
    }

    drawZoneNonDraggable(ctx) {
        ctx.save();
        ctx.fillText(TXT_DRAGGABLE, this.zoneDraggable[0]/2, this.zoneDraggable[1]/2);
        ctx.fillStyle = "rgb(125,125,125)";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, this.zoneDraggable[0], this.zoneDraggable[1]);
        ctx.restore();
    }

    iCanDrag(x, y){
        return !((x > this.zoneDraggable[0]) || (y > this.zoneDraggable[1]));
    }

    getMonstres(nom){

        for(let i=0; i<this.allMonsters.length; i++){
            if(this.allMonsters[i].name === nom){
                return this.allMonsters[i];
            }
        }
        return null;
    }

    createMonster() {

        let tab = [];

        for(let i=0; i<this.assets.length; i++){

            if (this.assets[i].name === "BUFFATATOR") {
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 0.5, 0.5, 40, 40, 10, 3, 250 ,this.assets[i]));
            } else if(this.assets[i].name === "DONATELLO"){
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 0.5, 0.5, 40, 40, 60, 7, 500 ,this.assets[i]));
            } else if (this.assets[i].name === "DUBOITAGE") {
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 2, 2, 40, 40, 5, 2, 75, this.assets[i]));
            } else if (this.assets[i].name === "FUKOUSHIMA") {
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 1, 1, 40, 40, 39, 6, 300, this.assets[i]));
            } else if (this.assets[i].name === "KARIBOUCHON") {
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 0.5, 0.5, 40, 40, 4, 2, 60, this.assets[i]));
            }else if(this.assets[i].name === "MIRANDALOUSE"){
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 1.5, 1.5, 40, 40, 8, 3, 100, this.assets[i]));
            } else if (this.assets[i].name === "TETTAMINATOR") {
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 1, 1, 40, 40, 50, 5, 150, this.assets[i]));
            } else if (this.assets[i].name === "TOUNSISAILLE") {
                tab.push(new Follower(this.assets[i].name, 0, 0, "rgb(0, 0, 255)", 3, 3, 40, 40, 7, 2, 90, this.assets[i]));
            }
        }

        console.log(tab);
        return tab;

    }
}

class Defenseur extends Player{

    constructor(posX ,posY, couleur, vitesseX, vitesseY, width, height, pv, assets){
        super(posX, posY, couleur, vitesseX, vitesseY, width, height);
        this.pv = pv;
        this.armeActive = {};
        //this.armes = Defenseur.getArmes();
        this.armes = [];
        this.setArmeActive(Arme.getArmes()[0]);
        this.centreX = this.width/2;
        this.centreY = this.height/2;
        this.angle = 0;
        this.indexArmeActive = 0;
        this.base = new Base(1100, 150, "rgb(141, 200, 175)", 100, 300);
        this.assets = assets;
    }


    drawVie(ctx){
        ctx.save();
        ctx.font = 'bold 16pt Helvetica';
        ctx.fillText(this.pv, this.posX+25, this.posY+70);
        ctx.restore();
    }

    getArmeActive(){
        return this.armeActive;
    }

    setArmeActive(armeSet){
        this.armeActive = armeSet;
        this.armes.push(armeSet);
        this.indexArmeActive +=1;
        //console.log(this.armeActive);
    }

    ramasserArme(arme){

        let checked = this.check(arme);
        if(checked === -1){
            this.armes.push(arme);
        }else{
            checked.recharger();
            console.log(checked.ballesDispo);
        }
        console.log(this.armes);
    }

    changerArme(){

        if(this.indexArmeActive === this.armes.length)
            this.indexArmeActive = 0;

        this.armeActive = this.armes[this.indexArmeActive];
        this.indexArmeActive +=1;

        console.log("degat --> "+this.degat);
    }

    check(arme){
        for(let i=0; i<this.armes.length ; i++){
            if(this.armes[i].name === arme.name){
                return this.armes[i];
            }
        }
        return -1;
    }

    draw(ctx){
        ctx.save();

        ctx.translate(this.posX, this.posY);
        ctx.fillStyle = this.couleur;

        ctx.translate(this.centreX, this.centreY);
        ctx.rotate(this.angle);
        ctx.translate(-this.centreX, -this.centreY);
        //ctx.fillRect(0, 0, this.width, this.height);

        //on s'est assuré que l'image est bien chargée
        ctx.drawImage(this.assets[0], 0, 0, this.width, this.height);

        ctx.restore();
    }

    tourner(x, y){
        this.angle = Math.atan2(x,-y);
    }

    tirer(){
        this.armeActive.tirer(this.posX, this.posY, this.angle);
        //console.log(this.armeActive.posX);
    }

    collisionArme(armes){
        //console.log(armes);
        for(let i=0; i<armes.length; i++){
            if(!((this.posX >= armes[i].posX + armes[i].width) || (this.posX + this.width <= armes[i].posX) || (this.posY >= armes[i].posY + armes[i].height) || (this.posY + this.height <= armes[i].posY))){

                this.ramasserArme(armes[i]);
                armes.splice(armes.indexOf(armes[i]), 1)
                //console.log("oiu");
                let timeout = setTimeout(function () {
                    armeOnPitch = false;
                }, 10000);
            }
        }

    }

}

