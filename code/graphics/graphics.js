/*
WHAT WE NEED HERE:

-keep ingame coordinates separate from the game's resolution
-function for rotating drawings
-easing functions

-'GraphicEntity' class (for animating characters)
    -stores frames of the animation, how long to spend on each frame
    -can have different states for different animations
*/

//import Ease from './easing.js';

export class GraphicsController {
    constructor(canvas, entities = []) {
        this.canvas = canvas;
        this.entities = entities;

        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;
    }

    //draws an image on the canvas,
    //converting relative coordinates to the position on the canvas
    drawSprite(img, x, y) {
        const tX = x * this.width;
        const tY = y * this.height;
        this.ctx.drawImage(img, tX, tY);
    }

    //sorts entities by layer.
    //recursive merge sort implementation.
    sortEntities(entities = this.entities){
        if(entities.length <= 1) {
            return entities;
        }

        const middle = Math.floor(entities.length / 2);

        const left = entities.slice(0, middle);
        const right = entities.slice(middle);

        return this.mergeHelper(this.sortEntities(left), this.sortEntities(right));
    }

    mergeHelper(left, right) {
        var ret = [];
        var leftIndex = 0;
        var rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if(left[leftIndex].layer < right[rightIndex].layer) {
                ret.push(left[leftIndex]);
                leftIndex++;
            } else {
                ret.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return ret.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }

    //does the update shit for every entity
    update(time) {
        this.entities = this.sortEntities();
        for(var i = 0; i < this.entities.length; i++) {
            var ent = this.entities[i];
            ent.update(time);
        }
    }

    render() {
        //this.ctx.clearRect(0, 0, this.width, this.height);
        for(var i = 0; i < this.entities.length; i++) {
            var ent = this.entities[i];
            this.drawSprite(ent.img, ent.x, ent.y);
        }
    }
}

export class GraphicsEntity {
    constructor(animations, x, y, layer = 0) {
        this.x = x;
        this.y = y;
        this.animations = animations;
        this.animState = 0;
        this.img = animations[0].frames[0].img;
        this.elapsed = 0;
        this.layer = layer;
    }

    update(time) {
        this.elapsed += time;
        this.img = this.animations[this.animState].getFrame(this.elapsed);
    }
}

export class SpriteAnimation {
    constructor(frames) {
        this.frames = frames;
        this.duration = 0;
        for(var i = 0; i < frames.length; i++) {
            this.duration += frames[i].t;
        }
    }

    getFrame(elapsed) {
        const progress = elapsed % this.duration;

        var j = this.frames[0].t;
        var i = 0;
        while(progress >= j && i < this.frames.length - 1) {
            i++;
            j += this.frames[i].t;
        }
        return this.frames[i].img;
    } 
}

export class SpriteFrame {
    constructor(img, t) {
        this.img = img; //the base image for this frame
        this.t = t; //how long this frame should last in MS.
    }
}

/*TODO
    RUN A TEST. HOOK THIS UP TO SAMPLE GRAPHICS
    MAKE A SYSTEM FOR RECORDING & PARSING FRAME DATA
    ASSET LOADING
*/