window.onload = init;

function MenuAnimation(){

    let canvas, ctx, width, height;

    function init() {
        canvas = document.querySelector("#game");
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;

        requestAnimationFrame(anime);
    }

    function anime(){
        ctx.clearRect(0, 0, width, height);


        requestAnimationFrame(anime);
    }

}
