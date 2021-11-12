var utils = {

    xmlDoc:                                 null,

    /* INITIALIZE DATABASE */
    loadDoc: function() {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {
          if ((this.readyState === 4) && (this.status === 200)) {
            utils.xmlDoc                    = this.responseXML;
            scores.processStyle("Tango");
          }
        };
        xhttp.open("GET", "data/tangos.xml", true);
        xhttp.send();
    },

    /* Get list element from click event */
    getListElement: function(event) {
        return (event.target || event.srcElement); 
    },

    setHelpMessage: function() {
       document.getElementsByTagName("h1")[0].title = messages.getMessage("loadHelpFile");
    },

    displayReadMe: function(ev) {
        ev.preventDefault();
        window.open("ReadMe.html");
    },

    resetAudioControl: function() { 
        var audioControl                    = document.getElementsByTagName("audio")[0];
        audioControl.src                    = "";
        audioControl.removeAttribute("src");
        audioControl.pause();
    },


    loadScore: function(elementId, isToPlay) {
        var thisScoreNode                   = this.xmlDoc.querySelector("[id='" + elementId + "']");
        if (thisScoreNode === null) return;
        var thisAlbumNode                   = thisScoreNode.parentNode;
        var thisArtistNode                  = thisAlbumNode.parentNode;
        var src                             = elementId.startsWith("CO")? "cortinas/": "tangos/";
        src                                += thisArtistNode.attributes["name"].nodeValue + "/";
        src                                += thisAlbumNode.attributes["name"].nodeValue    + "/"; 
        if (thisScoreNode.attributes["filename"]) {
            src                            += thisScoreNode.attributes["filename"].nodeValue;
        } else {
            src                            += thisScoreNode.attributes["title"].nodeValue;
        }
        src                                += ".mp3";
        var audioControl                    = document.getElementsByTagName("audio")[0];
        audioControl.src                    = src;
        audioControl.load();
        if (isToPlay) {
            audioControl.play();
        }
    },
    

    buildArtistText: function(artistNode, isTanda) {
        var artistText                      = "";
        if (isTanda) artistText            += scores.currentStyle + ": ";
        artistText                         += artistNode.attributes["name"].nodeValue;
        if (scores.currentStyle !== "Cortina") {
            artistText                     += " (" ;
            artistText                     += artistNode.attributes["birth"]? artistNode.attributes["birth"].nodeValue: "" ;
            artistText                     += "-" ;
            artistText                     += artistNode.attributes["death"]? artistNode.attributes["death"].nodeValue: "" ;
        artistText                         += ")" ;
        }
        return artistText
    },

    buildScoreText: function(thisScoreNode, isCortina) {
        let thisText                        = thisScoreNode.attributes["title"].nodeValue;
        if (isCortina) {
            var thisArtistNode              = thisScoreNode.parentNode.parentNode;
            thisText                       += ", " + thisArtistNode.attributes["name"].nodeValue;
        } else {
            if (thisScoreNode.attributes["date"]) {
                thisText                   += ", " + thisScoreNode.attributes["date"].nodeValue;
            }
            if (thisScoreNode.attributes["singerId"]) {
                var thisSingerId            = thisScoreNode.attributes["singerId"].nodeValue;
                var thisSingerNode          = utils.xmlDoc.querySelector("[id='" + thisSingerId + "']");
                thisText                   += ", " + thisSingerNode.attributes["name"].nodeValue;
            }
        }
        if (thisScoreNode.attributes["duration"]) {
            thisText                       += " (" + thisScoreNode.attributes["duration"].nodeValue + ")";
        }
        return thisText;
    },
    
    isElementPlayingOrPlayed: function(elementId) {
        var element                         = document.getElementById(elementId);
        return element.style? ((element.style.backgroundColor !== "")? (element.style.backgroundColor.indexOf("blue") > -1): false): false;
    },
};

document.addEventListener("DOMContentLoaded", function(event) { 
    utils.loadDoc();
    utils.setHelpMessage();
    scores.setScoresLanguage();
    milonga.setMilongaLanguage();
});

/* -\\- */
