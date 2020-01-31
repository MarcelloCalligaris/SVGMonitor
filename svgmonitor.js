class SVGMonitor extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
        let svgObject = document.createElement("object");
        svgObject.type = "image/svg+xml";
        svgObject.data = "svgmonitor.svg";
        console.log(svgObject);
        this._svgRootPromise = new Promise((resolve, reject) => {
            svgObject.addEventListener("load", function (e) {
                let rt = svgObject.contentDocument == undefined ? svgObject.getSVGDocument() : svgObject.contentDocument;
                if (rt)
                    resolve(rt);
                else
                    reject();
            });
        });
        this.shadow.appendChild(svgObject);
        this._text = "";
        this._sleeper = function (ms) {
            return new Promise((res, rej) => { setTimeout(() => { res(); }, ms); });
        };
        this._svgRootPromise.then((doc) => {
            this._svgRoot = doc;
        }).catch(() => { console.log("Error at SVGMonitor.constructor()"); });
    }
    static Initialize() {
        customElements.define("svg-monitor", SVGMonitor);
    }
    async TypeAdd(message, newline = true, delay = 150) {
        if (newline)
            message = '\n' + message;
        for (var i = 0; i < message.length; ++i) {
            await this._sleeper(Math.floor(Math.random() * delay));
            this.ScreenText += message[i];
        }
    }
    async TypeBackspace(chars, delay = 150) {
        for (var i = 0; i < chars; ++i) {
            this.ScreenText = this.ScreenText.substr(0, this.ScreenText.length - 1);
            if (this.ScreenText.length == 0)
                break;
        }
    }
    async TypeOut(message, delay = 150) {
        var startIndex = 0;
        if (message.startsWith(this._text)) {
            startIndex = this._text.length;
        }
        else {
            this.ScreenText = "";
        }
        for (var i = startIndex; i < message.length; ++i) {
            await this._sleeper(Math.floor(Math.random() * delay));
            this.ScreenText += message[i];
        }
    }
    get BSOD() {
        if (this._svgRoot === undefined)
            return false;
        return this._svgRoot.getElementById("bsodgrp").style.display === "inline";
    }
    set BSOD(value) {
        if (this._svgRoot === undefined) {
            this._svgRootPromise.then((rt) => {
                rt.getElementById("bsodgrp").style.display = value === true ? "inline" : "none";
                rt.getElementById("ScreenTextLayer").style.display = value === true ? "none" : "inline";
            })
                .catch(() => { console.log("Error at set SVGMonitor.BSOD"); });
            ;
        }
        else {
            this._svgRoot.getElementById("bsodgrp").style.display = value === true ? "inline" : "none";
            this._svgRoot.getElementById("ScreenTextLayer").style.display = value === true ? "none" : "inline";
        }
    }
    get ScanLines() {
        if (this._svgRoot === undefined)
            return false;
        return this._svgRoot.getElementById("Scanlines").style.display === "inline";
    }
    set ScanLines(value) {
        if (this._svgRoot === undefined) {
            this._svgRootPromise.then((v) => {
                v.getElementById("Scanlines").style.display = value === true ? "inline" : "none";
            })
                .catch(() => { console.log("Error at set SVGMonitor.Scanlines"); });
        }
        else {
            this._svgRoot.getElementById("Scanlines").style.display = value === true ? "inline" : "none";
        }
    }
    get ScreenText() {
        return this._text;
    }
    set ScreenText(value) {
        if (this._svgRoot === undefined) {
            this._svgRootPromise.then((v => {
                this.ScreenText = value;
            }))
                .catch(() => { console.log("Error at set SVGMonitor.ScreenText"); });
            return;
        }
        ;
        this._text = value;
        var text = this._svgRoot.getElementById("ScreenText");
        var glow = this._svgRoot.getElementById("ScreenTextGlow");
        var cursor = this._svgRoot.getElementById("Cursor");
        var cursorglow = this._svgRoot.getElementById("CursorGlow");
        while (text.firstChild) {
            text.removeChild(text.firstChild);
        }
        while (glow.firstChild) {
            glow.removeChild(glow.firstChild);
        }
        var lines = value.split('\n');
        var firstLine = lines.length > 8 ? lines.length - 8 : 0;
        for (var ln = firstLine; ln < lines.length; ++ln) {
            if (lines[ln].length > 20) {
                lines[ln] = lines[ln].substr(lines[ln].length - 20, 20);
            }
            let span = this._svgRoot.createElementNS('http://www.w3.org/2000/svg', "tspan");
            let spang = this._svgRoot.createElementNS('http://www.w3.org/2000/svg', "tspan");
            span.textContent = lines[ln].length == 0 ? "\u2063" : lines[ln];
            spang.textContent = lines[ln].length == 0 ? "\u2063" : lines[ln];
            span.setAttribute("x", "12");
            spang.setAttribute("x", "12");
            span.setAttribute("xml:space", "preserve");
            spang.setAttribute("xml:space", "preserve");
            if (ln > firstLine) {
                span.setAttribute("dy", "1em");
                spang.setAttribute("dy", "1em");
            }
            text.appendChild(span);
            glow.appendChild(spang);
        }
        var cursory = 7.5 + (lines.length - firstLine) * 3.94;
        var cursorx = 12 + lines[lines.length - 1].length * 2.2;
        cursor.setAttribute("y", `${cursory}`);
        cursorglow.setAttribute("y", `${cursory}`);
        cursor.setAttribute("x", `${cursorx}`);
        cursorglow.setAttribute("x", `${cursorx}`);
    }
}
