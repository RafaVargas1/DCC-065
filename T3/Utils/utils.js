export class InfoBox {
    constructor(top = 1, bottom = 0, left = 1, right = 0) {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.top = top;
        this.infoBox.style.bottom = bottom;
        this.infoBox.style.left = left;
        this.infoBox.style.right = right;
        this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
        this.infoBox.style.color = "white";
        this.infoBox.style.fontFamily = "sans-serif";
        this.infoBox.style.userSelect = "none";
        this.infoBox.style.textAlign = "left";
    }

    addParagraph() {
        const paragraph = document.createElement("br")
        this.infoBox.appendChild(paragraph);;
    }

    add(text) {
        var textnode = document.createTextNode(text);
        this.infoBox.appendChild(textnode);
        this.addParagraph();
    }

    show() {
        document.body.appendChild(this.infoBox);
    }
}