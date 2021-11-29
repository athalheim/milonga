var utils = {
    xmlDoc:                   null,
    loadDoc:                  function() { this.loadXhttp("data/tangos.xml", "utils.xmlDoc=this.responseXML;scores.listArtists('Tango');"); },
    loadXhttp:                function(filename, callback) {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {if ((this.readyState === 4) && (this.status === 200)) eval(callback);};
        xhttp.open("GET", filename, true);
        xhttp.send();
    },
    buildScoreText:           function(scoreNode) {
        var scoreText                       = "(" + scoreNode.attributes.duration.nodeValue + ") " + scoreNode.innerHTML;
        if (scoreNode.id.startsWith("CO"))    scoreText  += " {" + scoreNode.parentNode.parentNode.attributes.name.nodeValue + "}";
        if (scoreNode.attributes.date)        scoreText  += ", " + scoreNode.attributes.date.nodeValue;
        if (scoreNode.attributes.singerId)    scoreText  += " [" + this.getDocNode(scoreNode.attributes.singerId.nodeValue).innerHTML + "]";
        return scoreText;
    },
    elementPlayingOrPlayed:   function(element) { return (element.className.indexOf("Play") > -1); },
    displayPlayMessage:       function(id)      { alert(messages.getMessage(id.startsWith("tanda_")? "tandaPlayedOrPlaying": "scorePlayedOrPlaying")); },
    playVisible:              function()        { return (document.getElementById("play").style.visibility === "visible"); },
    stopVisible:              function()        { return (document.getElementById("stop").style.visibility === "visible"); },
    isDocNode:                function(id)      { return (id && utils.getDocNode(id))},
    getDocNode:               function(id)      { return this.xmlDoc.querySelector("#" + id); },
    getArtist:                function(id)      { return this.getDocNode(id).closest("artist"); },
    getArtistId:              function(id)      { return this.getArtist(id).id; },
    cleanTandas:              function()        { document.querySelectorAll("[idref]").forEach(e => {e.classList.remove("tanda"); e.classList.remove("tandaScore")}); },
    setTandaControls:         function()        {
        document.getElementById("play" ).style.visibility = utils.stopVisible()? "hidden": (document.querySelectorAll("[idref^='TA']").length > 0)? "visible": "hidden";
        document.getElementById("clear").style.visibility = utils.stopVisible()? "hidden": (document.querySelectorAll("ul > li").length       > 0)? "visible": "hidden";
        document.getElementById("save" ).style.visibility = (document.querySelectorAll("ul > li").length > 0)? "visible": "hidden";
    },
    resetAudioControl:        function() {
        var audioControl                    = document.querySelector("audio");
        audioControl.src                    = "";
        audioControl.removeAttribute("src");
        audioControl.pause();
    },
    loadScore:                function(scoreId, toPlay) {
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
        if (toPlay)                           audioControl.play();
    },
};

document.addEventListener("DOMContentLoaded", function(event) { utils.loadDoc(); messages.setLanguage(); });

/* -\\- */
