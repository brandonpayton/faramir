export default class TextNode {
    get type() { return 'text' }

    // text = null;

    constructor(text) {
        this.text = text;
    }

    create() {
        return document.createTextNode(this.text);
    }

    match(to) {
        return this.type === to.type;
    }

    patch(realNode, to) {
        if(realNode.textContent !== to.text) {
            realNode.textContent = to.text;
        }
    }
}