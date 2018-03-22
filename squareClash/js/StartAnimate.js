window.onload = init;
let canvas, ctx;
let x = 500;
let y = 160;
let vitesseX, vitesseY;

    function init() {
        canvas = document.querySelector("#Canvas");
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;

        requestAnimationFrame(anime);
    }

    function anime(){

        ctx.save();

        var img = new Image();
        img.src = '../img/blue_card.png';
        img.onload = function () {
            var pattern = ctx.createPattern(img,'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(500,160,30,30);
        };
        move();
        ctx.restore();

        //requestAnimationFrame(anime);
    }

    function move(e){

    }

