import { Ease } from './easing.js';

/*
    All the data about how to draw an entity.
*/
export class GraphicsEntity {
    constructor(animations, x = 0.5, y = 0.5, layer = 1, r = 0, scale = 1, animState = "idle", changes = []) {
        //coordinates of the entity's center relative to the canvas.
        //number between 0 and 1, with 0 being at the origin (top right corner) and 1 being at the opposite side of the canvas.
        //values above/below 0 or 1 may be used if the entity is beyond the screen. 
        this.x = x; 
        this.y = y;

        //determines the order in which entities are drawn - lower layer values are drawn before higher layer values
        //such that entities with higher layers appear on top of entities with lower layers.
        //if two layer values match, then the order in which they are drawn is arbitrary.
        this.layer = layer;

        //how many radians the entity has been rotated by.
        this.r = r;
        
        //how large the entities sprite is drawn. "1" is the same size as the origninal image.
        //IM GOING TO REWORK THIS AT SOME POINT - i want scaling to be relative to the game's resolution, not the original image.
        //but that probably won't change how it's used.
        this.scale = scale;

        //a collection of slideshow animations this sprite can flip through. 
        //ideally we'll standardize names for common animations, but
        //right now the only standard one is "idle", which is also the default animation.
        this.animations = animations;

        //the name of the current Animation playing.
        this.animState = animState;
        
        //a collection of ongoing gradual changes to any NUMERICAL values of this graphicsEntity. 
        this.changes = changes;

        //the current animation frame's image.
        this.img = this.animations[this.animState].frames[0].img;
        //used for keeping time.
        this.elapsed = 0;
    }

    //creates a Change and attaches it to this object.
    //if duration is unspecified, it just defaults to having no duration and immediately sets the value.
    makeChange(type, finalValue, duration = 0, ease = Ease.linear, callback = null) {
        if(duration == 0) {
            this[type] = finalValue;
        } else {
            var change = new Change(type, this[type], finalValue, duration, ease, callback);
            this.addChange(change);
        }
    }

    //adds a Change to this object. 
    addChange(change) {
        this.changes.push(change);
    }

    //creates two Changes for moving to a different point on the canvas.
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
    
    //this is used by the GraphicsController - you don't gotta touch it.
    update(time) {
        this.elapsed += time;

        var newChanges = [];
        for(var i = 0; i < this.changes.length; i++) {
            let change = this.changes[i].type;
            this[change] = this.changes[i].update(time);
            //when the change has gone on long enough, set the value to it's final destination & remove the change.
            if(this.changes[i].elapsed >= this.changes[i].duration) {
                this[change] = this.changes[i].finalValue;
            }else {
                newChanges.push(this.changes[i]);
            }
        }
        delete this.changes;
        this.changes = newChanges;

        this.img = this.animations[this.animState].getFrame(this.elapsed);
    }

    //copying
    static clone(graphicsEntity) {
        var animations = {};
        for(var animation in graphicsEntity.animations) {
            animations[animation] = SpriteAnimation.clone(graphicsEntity.animations[animation]);
        }
        var ret = new GraphicsEntity(animations, graphicsEntity.x, graphicsEntity.y, graphicsEntity.layer, graphicsEntity.r, graphicsEntity.scale, graphicsEntity.animState);
        

        for(var i = 0; i < graphicsEntity.changes.length; i++) {
            ret.changes.push(graphicsEntity.changes[i]);
        }
        
        return ret;
    }
}

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

    static clone(spriteAnimation) {
        var ret = new SpriteAnimation(spriteAnimation.frames);
        return ret;
    }
}

export class SpriteFrame {
    constructor(img, t) {
        this.img = img; //the base image for this frame
        this.t = t; //how long this frame should last in MS.
    }
}