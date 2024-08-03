/**
 * Just video starter
 */
class Video {
    static htmlButtons = document.querySelector(".mediaItemShareDownload");
    static player = document.querySelector("video");
    static play(){
        if(this.player){
            this.player.onplay = () => Subtitles.record();
            this.player.play();
        }else{
            console.warn("This page doesn't contain video player. Use this script in the movie page, with subtitles option exist.");
        }
    }
    static get time(){
        return this.player.currentTime;
    }
}

/**
 * Record Subtitles System
 */
class Subtitles {
    static htmlTarget;
    static texts = [];

    /**
     * Create MutationObserver object
     * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
     */
    static record(){
        if(!Object.values(this.texts).length){
            this._buttonSubtitles();
            this._buttonCurrentTextDownload();
            this.htmlTarget = document.querySelector("#videoPlayerInstance .vjs-text-track-display");
            let mutation = new MutationObserver(result => {
                let text = result[0].target.innerText.trim().replace(/\n/gui, " ");
                if(text){
                    this._text = [Video.time, text];
                    if(Object.values(this.texts).length === 1){
                        this.toggleVisibilitySubtitles();
                    }
                }
            });
            mutation.observe(this.htmlTarget, {childList:true});
        }
    }

    /**
     * Increment subtiltes text list
     * @type {array} data
     */
    static set _text(data){
        this.texts[data[0]] = `${data[1]}`;
    }

    /**
     * Pattern of button
     * @param  {string} text    button's label
     * @return {element}        button
     */
    static _createButton(text){
        let btn = document.createElement("span");
        btn.classList.add("secondaryButton", "fileTypeButtons");

        let txt = document.createElement("span");
        txt.classList.add("buttonText");
        txt.style.color = "darkorange";
        txt.innerText = text;

        btn.append(txt);
        return btn;
    }

    /**
     * Create html button in the document for show or hide subtitles area
     */
    static _buttonSubtitles(){
        let btn = this._createButton("Show/Hide subtitles");
        btn.onclick = () => this.toggleVisibilitySubtitles();
        Video.htmlButtons.append(btn);
    }

    /**
     * Show or hide subtiltes area function
     */
    static toggleVisibilitySubtitles(){
        this.htmlTarget.classList.toggle("vjs-hidden");
    }

    /**
     * Create html button in the document for download subtitles text
     */
    static _buttonCurrentTextDownload(){
        let btn = this._createButton("Download current text");
        btn.classList.remove("fileTypeButtons");
        btn.onclick = () => this.currentTextDownload();
        Video.htmlButtons.append(btn);
    }

    /**
     * Create and download .txt document type with subtiltes text
     */
    static currentTextDownload(){
        let text = Object.values(this.texts).join(" ");
        let blob = new Blob([text], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = url;
        link.download = `${document.querySelector("h1").innerText.trim()}.txt`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

Video.play();

// document.head.append(Object.assign(document.createElement("script"),{src:"https://ciqadev.fr/Subtitles.js"}));
// fetch("https://ciqadev.fr/Subtitles.js").then(file=>file.text()).then(code=>new Function(code)())
