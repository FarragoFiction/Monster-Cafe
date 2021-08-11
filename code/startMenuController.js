export class StartMenuController {
    constructor(target) {
        this.target = target;
    }

    processInput() {
        
    }
    
    update() {
         //if we want fancy background graphics we can put them here i guess?       
    }
    
    render() {
        
    }

    begin() {
        var uwu = new StartMenuItem("uwu", fuck);
        uwu.getElement(this.target);
    }
}

class StartMenuItem {
    constructor(text, callback) {
        this.text = text;
        this.callback = callback;
    }

    getElement(target) {
        var ret = document.createElement('button');
        ret.textContent = this.text;
        ret.onclick = this.callback;
        target.append(ret);
    }
}

function fuck() {
    console.log("fuck");
}