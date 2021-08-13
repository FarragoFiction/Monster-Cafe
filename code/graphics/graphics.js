/*
WHAT WE NEED HERE:

-keep ingame coordinates separate from the game's resolution
-function for rotating drawings
-easing functions

-'GraphicEntity' class (for animating characters)
    -stores frames of the animation, how long to spend on each frame
    -can have different states for different animations
*/

import { Ease } from './easing.js';

export class GraphicsController {
    constructor(canvas, entities = []) {
        this.canvas = canvas;
        this.entities = entities;

        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;
        this.queue = [];
    }

    //draws an image on the canvas,
    //converting relative coordinates to the position on the canvas
    drawSprite(img, x, y, scale = 1, r = 0) {
        const tX = x * this.width;
        const tY = y * this.height;

        this.ctx.setTransform(scale, 0, 0, scale, tX, tY);
        this.ctx.rotate(r);
        this.ctx.drawImage(img, - (img.width / 2), -(img.height / 2));
    }

    getSortedEntityList(entities = this.entities) {
        var list = [];
        for(var ent in entities) {
            list.push(entities[ent].graphics);
        }
        var ret = this.sortEntityGraphics(list);
        return ret;
    }

    //sorts entity graphics by layer.
    //recursive merge sort implementation.
    sortEntityGraphics(entityGraphics){
        if(entityGraphics.length <= 1) {
            return entityGraphics;
        }

        const middle = Math.floor(entityGraphics.length / 2);

        const left = entityGraphics.slice(0, middle);
        const right = entityGraphics.slice(middle);

        return this.mergeHelper(this.sortEntityGraphics(left), this.sortEntityGraphics(right));
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
        this.queue = this.getSortedEntityList();
        for(var i = 0; i < this.queue.length; i++) {
            var entG = this.queue[i];
            entG.update(time);
        }
    }

    render() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.rotate(0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(var i = 0; i < this.queue.length; i++) {
            var ent = this.queue[i];
            this.drawSprite(ent.img, ent.x, ent.y, ent.scale, ent.r);
        }
    }
}

export class GraphicsEntity {
    constructor(animations, x = 0.5, y = 0.5, layer = 1, r = 0, scale = 1) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.scale = scale;
        this.animations = animations;
        this.animState = "idle";
        this.img = this.animations[this.animState].frames[0].img;
        this.elapsed = 0;
        this.layer = layer;
        this.changes = {};
    }

    update(time) {
        this.elapsed += time;

        for(var change in this.changes) {
            this[change] = this.changes[change].update(time);
            //when the change has gone on long enough, set the value to it's final destination & remove the change.
            if(this.changes[change].elapsed >= this.changes[change].duration) {
                this[change] = this.changes[change].finalValue;
                delete this.changes[change];
            }
        }

        this.img = this.animations[this.animState].getFrame(this.elapsed);
    }

    addChange(change) {
        this.changes[change.type] = change;
    }

    makeChange(type, finalValue, duration = 0, ease = Ease.linear, callback = null) {
        if(duration == 0) {
            this[type] = finalValue;
        } else {
            var change = new Change(type, this[type], finalValue, duration, ease, callback);
            this.addChange(change);
        }
    }

    goto(x, y, duration = 0, ease = Ease.linear, callback = null) {
        if(duration == 0) {
            this.x = x;
            this.y = y;
        } else {
            var cX = new Change("x", this.x, x, duration, ease);
            var cY = new Change("y", this.y, y, duration, ease, callback); //only need to put the callback on one of them
            this.addChange(cX);
            this.addChange(cY);
        }
    } 
}

//
export class Change {
    constructor(type, startValue, finalValue, duration,  ease = Ease.linear, callback = null) {
        this.type = type;
        this.startValue = startValue;
        this.finalValue = finalValue;
        this.ease = ease;
        this.duration = duration;
        this.callback = callback;
        this.elapsed = 0;
    }

    update(time) {
        this.elapsed += time;
        console.log(Ease.lerp(this.startValue, this.finalValue, this.ease(this.elapsed / this.duration)));
        return Ease.lerp(this.startValue, this.finalValue, this.ease(this.elapsed / this.duration));
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