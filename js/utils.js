var utils = {
    xmlDoc:                                 null,
    loadDoc:           function() { this.loadXhttp("data/tangos.xml", "utils.xmlDoc=this.responseXML;scores.listArtists('Tango');"); },
    loadXhttp:         function(filename, callback) {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {if ((this.readyState === 4) && (this.status === 200)) eval(callback);};
        xhttp.open("GET", filename, true);
        xhttp.send();
    },
    buildScoreText:    function(scoreNode) {
        var scoreText                       = "(" + scoreNode.attributes.duration.nodeValue + ") ";
        scoreText                          += scoreNode.innerHTML;
        if (scoreNode.id.startsWith("CO"))   scoreText  += " {" + scoreNode.parentNode.parentNode.attributes.name.nodeValue + "}";
        if (scoreNode.attributes.date)       scoreText  += ", " + scoreNode.attributes.date.nodeValue;
        if (scoreNode.attributes.singerId)   scoreText  += " [" + this.getDocNode(scoreNode.attributes.singerId.nodeValue).innerHTML + "]";
        return scoreText;
    },
    isElementPlayingOrPlayed: function(element)  { return (element.className.indexOf("Play") > -1); },
    isPlayVisible:            function()         { return (document.getElementById("play").style.visibility === "visible"); },
    isStopVisible:            function()         { return (document.getElementById("stop").style.visibility === "visible"); },
    getDocNode:               function(sourceId) { return this.xmlDoc.querySelector("#" + sourceId); },
    getArtist:                function(sourceId) { return this.getDocNode(sourceId).closest("artist"); },
    getArtistId:              function(sourceId) { return this.getArtist(sourceId).id; },
    setTandaControls:         function() {
        document.getElementById("play" ).style.visibility = this.isStopVisible()? "hidden": (document.querySelectorAll("[idref^='TA']").length   > 0)?     "visible": "hidden";
        document.getElementById("clear").style.visibility = this.isStopVisible()? "hidden": (document.getElementById("tandasList").childElementCount > 0)? "visible": "hidden";
        document.getElementById("save" ).style.visibility = (document.getElementById("tandasList").childElementCount > 0)? "visible": "hidden";
    },
    resetAudioControl: function() {
        var audioControl                    = document.querySelector("audio");
        audioControl.src                    = "";
        audioControl.removeAttribute("src");
        audioControl.pause();
    },
    loadScore:         function(scoreId) {
        var thisScoreNode                   = this.getDocNode(scoreId);
        var thisAlbumNode                   = thisScoreNode.parentNode;
        var thisArtistNode                  = thisAlbumNode.parentNode;
        var src                             = scoreId.startsWith("CO")? "Cortina/": "Tango/";
        src                                += thisArtistNode.attributes.name.nodeValue + "/";
        src                                += thisAlbumNode.attributes.name.nodeValue  + "/"; 
        src                                += thisScoreNode.attributes.filename? thisScoreNode.attributes.filename.nodeValue: thisScoreNode.innerHTML;
        src                                += ".mp3";
        var audioControl                    = document.querySelector("audio");
        audioControl.setAttribute("src", src);
        audioControl.load();
    },
};

document.addEventListener("DOMContentLoaded", function(event) { 
    utils.loadDoc();
    messages.getLanguage();
    document.querySelector("h1"         ).title     = messages.getMessage("loadHelpFileTitle");
    document.getElementById("scores"    ).innerHTML = messages.getMessage("scores");
    document.getElementById("artists"   ).innerHTML = messages.getMessage("artists");
    document.getElementById("tangoStyle").title     = messages.getMessage("tangoStyleTitle");
    document.getElementById("milonga"   ).title     = messages.getMessage("milongaTitle");
    document.getElementById("tandas"    ).title     = messages.getMessage("tandasTitle");
    document.getElementById("save"      ).innerHTML = messages.getMessage("save");
    document.getElementById("clear"     ).innerHTML = messages.getMessage("clear");
    document.getElementById("play"      ).innerHTML = messages.getMessage("play");
    document.getElementById("stop"      ).innerHTML = messages.getMessage("stop");
});

/* -\\- */
