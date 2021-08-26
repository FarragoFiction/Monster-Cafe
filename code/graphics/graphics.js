/*
WHAT WE NEED HERE:

-keep ingame coordinates separate from the game's resolution
-function for rotating drawings
-easing functions

-'GraphicEntity' class (for animating characters)
    -stores frames of the animation, how long to spend on each frame
    -can have different states for different animations
*/

const DEF_WIDTH = 1024;
const DEF_HEIGHT = 576;

export class GraphicsController {
    constructor(canvas, entities = []) {
        this.canvas = canvas;
        this.entities = entities;

        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;
        this.queue = [];

        const me = this;
        this.canvas.addEventListener('click', function(event) {
            me.checkClicks(event);
        });
    }

    //draws an image on the canvas,
    //converting relative coordinates to the position on the canvas
    drawSprite(img, x, y, scale = 1, r = 0) {
        const tX = x * this.width;
        const tY = y * this.height;
        const tScale = scale * (this.width / DEF_WIDTH);

        this.ctx.setTransform(tScale, 0, 0, tScale, tX, tY);
        this.ctx.rotate(r);
        
        var path = new Path2D();
        //ok i need to figure out how the hell to get the 4 corners of this thing in regular coordinates.
        var xAdj = (img.width / 2) * scale;// * Math.cos(r);
        var yAdj = (img.height / 2) * scale;// * Math.sin(r);
        path.moveTo(tX - (xAdj * Math.cos(r)) + (yAdj * Math.sin(r)), tY - (xAdj * Math.sin(r)) - (yAdj * Math.cos(r)));
        path.lineTo(tX - (xAdj * Math.cos(r)) - (yAdj * Math.sin(r)), tY - (xAdj * Math.sin(r)) + (yAdj * Math.cos(r)));
        path.lineTo(tX + (xAdj * Math.cos(r)) - (yAdj * Math.sin(r)), tY + (xAdj * Math.sin(r)) + (yAdj * Math.cos(r)));
        path.lineTo(tX + (xAdj * Math.cos(r)) + (yAdj * Math.sin(r)), tY + (xAdj * Math.sin(r)) - (yAdj * Math.cos(r)));
        path.closePath();

        this.ctx.drawImage(img, - (img.width / 2), -(img.height / 2));
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.rotate(0);
        this.ctx.stroke(path);

        return path;
    }

    convertCoordinates(x, y) {
        const tX = x * this.width;
        const tY = y * this.height;

        return {
            x: tX,
            y: tY
        };
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
        this.ctx.strokeStyle = 'transparent';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.rotate(0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(var i = 0; i < this.queue.length; i++) {
            var ent = this.queue[i];
            ent.path = this.drawSprite(ent.img, ent.x, ent.y, ent.scale, ent.r);
        }

    }

    checkClicks(event) {
        for(var i = this.queue.length - 1; i >= 0; i--) {
            if(this.queue[i].path != null && this.queue[i].onClick != null) {
                if(this.ctx.isPointInPath(this.queue[i].path, event.offsetX, event.offsetY)) {
                    this.queue[i].onClick();
                }
            }
        }
    }
}

