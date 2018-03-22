class Assets{

    constructor(){

    }

    playSound(src){
        if(this.isAudio()){
            //play
        }
    }

    /*
    *Code effectué par M.Buffa
    */
    isImage(src) {
        return (src.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    }

    /*
    *Code effectué par M.Buffa
    */
    isAudio(src) {
        return (src.match(/\.(mp3|ogg|wav)$/) !== null);
    }

    static createInstanceImg(toLoad){
        let imgsInstances = [];

        Assets.getObjectToLoad(toLoad).forEach(function () {
            let instance = new Image();
            instance.width = 100;
            instance.height = 130;
            imgsInstances.push(instance);
        });
        //console.log(imgsInstances);
        return imgsInstances;
    }

    static loadImage(callback, toLoad){
        let instancesImg = Assets.createInstanceImg(toLoad);
        //var booleanDeNoel = [];
        let images = Assets.getObjectToLoad(toLoad);

        //var images = document.getElementsByTagName("img");
        for(let i=0; i<instancesImg.length; i++){
            //var datavalue = images[i].getAttribute("data-value");
            instancesImg[i].addEventListener('load',  () => {
                //console.log("load");
                //booleanDeNoel.push(true);
                callback(true, instancesImg[i]);
            }, false);
            instancesImg[i].addEventListener('error', ()=> {
                //booleanDeNoel.push(false);
                callback(false);
            });
            //console.log(images[i]);
            instancesImg[i].name = Assets.getFileName(images[i]);
            instancesImg[i].src = images[i];
        }

    }

    loadAudio(){

    }

    static getObjectToLoad(toLoad){
        let images = null;
        if(toLoad === "cartes")
            images = Assets.getSrcCardImages();
        else if(toLoad === "joueur")
            images = Assets.getSrcJoueurImage();
        else if(toLoad === "personnages")
            images = Assets.getSrcPersosImages();
        return images;
    }

    static getSrcImage(nom){
        if(nom === "BUFFATATOR"){
            return Assets.getSrcCardImages()[0];
        }else if(nom === "DONATELLO"){
            return Assets.getSrcCardImages()[1];
        }else if(nom === "DUBOITAGE"){
            return Assets.getSrcCardImages()[2];
        }else if(nom === "FUKOUSHIMA"){
            return Assets.getSrcCardImages()[3];
        }else if(nom === "KARIBOUCHON"){
            return Assets.getSrcCardImages()[4];
        }else if(nom === "MIRANDALOUSE"){
            return Assets.getSrcCardImages()[5];
        }else if(nom === "TETTAMINATOR"){
            return Assets.getSrcCardImages()[6];
        }else if(nom === "TOUNSISAILLE"){
            return Assets.getSrcCardImages()[7];
        }
    }

    static getSrcAudio(nom){
        if(nom === "DESTRUCTOR" || nom === "BUFFATATOR"){
            return Assets.getSrcAudios()[0];
        }
    }

    static getSrcJoueurImage(){
        return ["../img/Personnages/HeroX.png"];
    }

    static getSrcPersosImages(){
        return [
            "../img/Personnages/Buffatator.png",
            "../img/Personnages/Donatello.png",
            "../img/Personnages/Duboitage.png",
            "../img/Personnages/Fukoushima.png",
            "../img/Personnages/Karibouchon.png",
            "../img/Personnages/Mirandalouse.png",
            "../img/Personnages/Tettaminator.png",
            "../img/Personnages/Tounsisaille.png"
        ];
    }

    static getSrcCardImages(){
        return [
            "../img/CartesPersonnages/Buffatator.jpg",
            "../img/CartesPersonnages/Donatello.jpg",
            "../img/CartesPersonnages/Duboitage.jpg",
            "../img/CartesPersonnages/Fukoushima.jpg",
            "../img/CartesPersonnages/Karibouchon.jpg",
            "../img/CartesPersonnages/Mirandalouse.jpg",
            "../img/CartesPersonnages/Tettaminator.jpg",
            "../img/CartesPersonnages/Tounsisaille.jpg"
        ];
    }

    static getFileName(name){
        let filename = name.match(/[-_\w]+[.][\w]+$/i)[0].substring(0, name.lastIndexOf('.')+1);
        return filename.split('.')[0].toUpperCase();
    }

    static getSrcAudios(){
        return[
            "../son/destructor.mp3",
        ];
    }

    static getLengthAllAssets(){
        return Assets.getSrcJoueurImage().length + Assets.getSrcCardImages().length + Assets.getSrcPersosImages().length;
    }
}