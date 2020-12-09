class Fountain{
    constructor() {
       this.blocks = [];
       this.headers = [];
    }

    parse(text) {
        this.blocks = [];
        this.headers = [];

        let self = this;
        let blocks = text.split(/\n\s*\n/);
        blocks.forEach((blockText) => {
            self.blocks.push(new FountainBlock(blockText));
        });

        if(this.blocks.length > 0){
            let headers = this.blocks[0].buildTitlePage();

            if(headers.length === 0) {
                delete this.blocks[0];
            }

            this.headers = headers;
        }
    }

    toJSON() {
        let json = {};

        let blocks = [];
        this.blocks.forEach((block) => {
            blocks.push(block.toJSON());
        });

        json.headers = this.headers;
        json.blocks = blocks;

        return json;
    }
}

class FountainBlock{
    constructor(text){
        let self = this;
        this.elements = [];
        
        let elements = text.split(/\n/);
        elements.forEach((content, idx) => {

            let trimContent = content.trim();
            if(trimContent.length > 0) {
                self.elements.push(new FountainElement(content));
            }
        });

        this.buildPreviousAndNext();
    }

    hasDualDialogue(){
        let isDualDialogue = false;
        this.elements.forEach((element) => {
            if(element.isDualDialogue()){
                isDualDialogue = true;
            }
        })
        return isDualDialogue;
    }

    buildPreviousAndNext(){
        this.elements.forEach((element, idx) => {
            if(idx > 0) {
                element.previous = this.elements[idx-1];
            }

            if(idx < this.elements.length-1) {
                element.next = this.elements[idx+1];
            }

        }, this);
    }

    buildTitlePage(){
        let headers = [];

        let isFullyRaw = true;
        this.elements.forEach((element) => {
            if(element.getType() !== FountainElement.TYPE_RAW){
                isFullyRaw = false;
            }
        });

        const regex = RegExp('.+:.*');

        if(isFullyRaw) {
            let previous = null;
            this.elements.forEach((element) => {
                if(regex.test(element.rawText)) {
                    let split = element.text.split(':');
                    let key = split[0];
                    let value = split[1];
                    
                    headers[key] = [];
                    headers[key].push(value);
                    previous = element;
                } else if(previous !== null) {
                    let split = previous.text.split(':');
                    let key = split[0];
                    headers[key].push(element.rawText);
                }
            }); 
        }

        return headers;
    }

    toJSON() {
        let elements = [];
        this.elements.forEach((element) => {
            elements.push(element.toJSON());
        });

        return {
            'isDual': this.hasDualDialogue(),
            'elements': elements
        };
    }
}

class FountainElement{

    constructor(text){     
        this.rawText = text;   
        this.text = text.trim();  
        this.type = null;
        this.previous = null;
        this.next = null;
    }

    getType(){
        if(this.isSceneHeading()){
            return FountainElement.TYPE_SCENE_HEADING;
        }
        if(this.isPageBreak()){
            return FountainElement.TYPE_PAGEBREAK;
        }
        if(this.isCharacter()){
            return FountainElement.TYPE_CHARACTER;
        }
        if(this.isTransition()){
            return FountainElement.TYPE_TRANSITION;
        }
        if(this.isParenthetical()){
            return FountainElement.TYPE_PARENTHETICAL;
        }
        if(this.isDialogue()){
            return FountainElement.TYPE_DIALOGUE;
        }
        if(this.isLyrics()){
            return FountainElement.TYPE_LYRICS;
        }

        return FountainElement.TYPE_RAW;
    }

    isSceneHeading(){
        let startsWithSceneHeading = this.text.startsWith('EXT. ') || 
                                    this.text.startsWith('INT. ') ||
                                    this.text.startsWith('.');

        return this.isAlone() && startsWithSceneHeading;
    }

    isCharacter(){
        return this.previous === null && this.next !== null && this.text.toUpperCase() === this.text;
    }

    isTransition(){

        let isUpperCase = this.text.toUpperCase() === this.text;
        let hasTransitionMarks = this.text.endsWith('TO:') || this.text.startsWith('>');

        return isUpperCase && hasTransitionMarks && this.isAlone();
    }

    isParenthetical(){
        return this.text.startsWith('(') && this.text.endsWith(')');
    }

    isDualDialogue(){
        return this.isCharacter() && this.text.endsWith('^');
    }

    isDialogue(){
        if(this.previous !== null) {
            return this.previous.isCharacter() || this.previous.isParenthetical() || this.previous.isDialogue();
        }

        return false;
    }

    isLyrics(){
        return this.text.startsWith('~');
    }

    isPageBreak(){
        let unique = this.text.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
        return this.text.startsWith('===') && unique.length === 1;
    }

    isAlone() {
        return this.previous === null && this.next === null;
    }

    toJSON() {
        let obj = {};
        obj.text = this.rawText;
        obj.type = this.getType();

        return obj;
    }
}

FountainElement.TYPE_SCENE_HEADING = 'SCENE_HEADING';
FountainElement.TYPE_CHARACTER = 'CHARACTER';
FountainElement.TYPE_TRANSITION = 'TRANSITION';
FountainElement.TYPE_PARENTHETICAL = 'PARENTHETICAL';
FountainElement.TYPE_DIALOGUE = 'DIALOGUE';
FountainElement.TYPE_DUAL_DIALOGUE = 'DUAL_DIALOGUE';
FountainElement.TYPE_LYRICS = 'LYRICS';
FountainElement.TYPE_PAGEBREAK = 'PAGEBREAK';
FountainElement.TYPE_RAW = 'RAW';

export { 
    Fountain,
    FountainBlock,
    FountainElement
}