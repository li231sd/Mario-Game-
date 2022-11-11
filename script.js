// javascript ES6 //

//Decoration / Game images
const platform = document.querySelector('.platform').src = './img/platform.png';
const hills = document.querySelector('.hills').src = './img/hills.png';
const background = document.querySelector('.background').src = './img/background.png';
const platformSmallTall = document.querySelector('.platformSmallTall').src = './img/platformSmallTall.png';

//Character
const spriteRunLeft = document.querySelector('.spriteRunLeft').src = './img/spriteRunLeft.png';
const spriteRunRight = document.querySelector('.spriteRunRight').src = './img/spriteRunRight.png';
const spriteStandLeft = document.querySelector('.spriteStandLeft').src = './img/spriteStandLeft.png';
const spriteStandRight = document.querySelector('.spriteStandRight').src = './img/spriteStandRight.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
    constructor() {
        this.speed = 10;
        this.position = {x: 100, y: 100};
        this.velocity = {x: 0, y: 0};

        this.width = 66;
        this.height = 150;

        this.image = createImage(spriteStandRight);
        this.frames = 0; 
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },

            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        };

        this.currentSprite = this.sprites.stand.right;
        this.currentCropWIdth = 177;   
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWIdth * this.frames,
            0,
            this.currentCropWIdth,
            400, 
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.frames++;

        if (this.frames > 59 && (this.currentSprite 
            === this.sprites.stand.right || this.
                currentSprite === this.sprites.
                stand.left)) {
            this.frames = 0;
        } else if (this.frames > 29 && (this.currentSprite 
            === this.sprites.run.right || this.currentSprite 
            === this.sprites.run.left)) {
                this.frames = 0;
            }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.draw();

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }
    }
};

class Platform {
    constructor( {x, y, image} ) {
        this.position = {
            x,
            y
        };

        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x,
            this.position.y);
    }
};

class GenericObjects {
    constructor( {x, y, image} ) {
        this.position = {
            x,
            y
        };

        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x,
            this.position.y);
    }
};

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
};

let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);

    let player = new Player();
    let platforms = [];

let genericObjects = [];

let lastKey;
const keys = {
    right: {
        pressed: false
    },

    left: {
        pressed: false
    }
};

let ScrollOffset = 0; 

function init() {
    platformImage = createImage(platform);

    player = new Player();
    platforms = [
        new Platform({x: platformImage.width * 4 + 250 - 2 + platformImage.width - 2, y: 370, image: platformSmallTallImage}),
        new Platform({x: -1, y: 470, image: platformImage}),
        new Platform({x: platformImage.width - 3, y: 470, image: platformImage}),
        new Platform({x: platformImage.width * 2 + 100, y: 470, image: platformImage}),
        new Platform({x: platformImage.width * 3 + 250, y: 470, image: platformImage}),
        new Platform({x: platformImage.width * 4 + 250 - 2, y: 470, image: platformImage}),
        new Platform({x: platformImage.width * 5 + 700 - 2, y: 470, image: platformImage})
    ];

    genericObjects = [
        new GenericObjects({
            x: -1,
            y: -1,
            image: createImage(background)
        }),

        new GenericObjects({
            x: -1,
            y: -1,
            image: createImage(hills)
        })
    ];

    ScrollOffset = 0;   
};

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach(genericObject => {
        genericObject.draw();
    });

    platforms.forEach(platform => {
        platform.draw();
    });

    player.update();

    if (keys.right.pressed &&
        player.position.x < 400) {
        player.velocity.x = player.speed;
    } else if ((keys.left.pressed &&
        player.position.x > 100) || (keys.left.pressed
        && ScrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            ScrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            });

            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66;
            });
        } else if (keys.left.pressed && ScrollOffset > 0) {
            ScrollOffset -= player.speed;

            platforms.forEach(platform => {
                platform.position.x += player.speed;;
            });

            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66;
            });
        }
    }

    //console.log(ScrollOffset);

    platforms.forEach(platform => {
        //Platform collision detection!
        if (player.position.y + player.height 
            <= platform.position.y && 
            player.position.y + player.height + 
            player.velocity.y >= platform.position.y
            && player.position.x + player.width 
            >= platform.position.x && player.position.x
            <= platform.position.x + platform.width) {
                player.velocity.y = 0;
        }
    });

    if (
        keys.right.pressed &&
        lastKey === 'right' && 
        player.currentSprite !== player.sprites.run.right
        ) {
            player.frames = 1;
            player.currentSprite = player.sprites.run.right;
            player.currentCropWIdth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
    } 
    
    else if (
        keys.left.pressed &&
        lastKey === 'left' && 
        player.currentSprite !== player.sprites.run.left
        ) {
            player.currentSprite = player.sprites.run.left;
            player.currentCropWIdth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
    }

    else if (
        !keys.left.pressed &&
        lastKey === 'left' && 
        player.currentSprite !== player.sprites.stand.left
        ) {
            player.currentSprite = player.sprites.stand.left;
            player.currentCropWIdth = player.sprites.stand.cropWidth;
            player.width = player.sprites.stand.width;
    }

    else if (
        !keys.right.pressed &&
        lastKey === 'right' && 
        player.currentSprite !== player.sprites.stand.right
        ) {
            player.currentSprite = player.sprites.stand.right;
            player.currentCropWIdth = player.sprites.stand.cropWidth;
            player.width = player.sprites.stand.width;
    }

    //Win Condition
    if (ScrollOffset > platformImage.width * 5 + 700 - 2) {
        //console.log("WInner");
        alert("You Win! Please refresh the page!");
    }

    //Lose Condition
    if (player.position.y > canvas.height) {
        init();
    }
};

init();
animate();

window.addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = true;
            lastKey = 'left';
            break;
        
        case 83:
            console.log('down');
            break;
            
        case 68:
            console.log('right');
            keys.right.pressed = true;
            lastKey = 'right';
            break;

        case 87:
            console.log('up');
            player.velocity.y -= 20;
            break;
    };
});

window.addEventListener("keyup", ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = false;
            break;
        
        case 83:
            console.log('down');
            break;
            
        case 68:
            console.log('right');
            keys.right.pressed = false;
            break;

        case 87:
            console.log('up');
            break;
    };
});
