var utils = {
    xmlDoc:                   null,
    loadDoc:                  function() { this.loadXhttp("data/tangos.xml", "utils.xmlDoc=this.responseXML; scores.listArtists('Tango');"); },
    loadXhttp:                function(filename, callback) {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {if ((this.readyState === 4) && (this.status === 200)) eval(callback);};
        xhttp.open("GET", filename, true);
        xhttp.send();
    },
    /* Partituras */
    getDocNode:               function(id)      { return id? this.xmlDoc.querySelector("#" + id): null; },
    getArtist:                function(id)      { return this.getDocNode(id).closest("artist"); },
    getArtistId:              function(id)      { return this.getArtist(id).id; },
    buildArtistText:          function(artistId) {
        var artistNode                      = this.getArtist(artistId);
        var artistText                      = artistNode.attributes.name.nodeValue;
        artistText                         += (artistNode.attributes.date)? (" " + artistNode.attributes.date.nodeValue): "";
        return artistText;
    },
    buildScoreText:           function(scoreNode, isAddArtist) {
        var scoreText                       = "(" + scoreNode.attributes.duration.nodeValue + ") " + scoreNode.innerHTML;
        if (scoreNode.attributes.date)        scoreText  += ", " + scoreNode.attributes.date.nodeValue;
        if (scoreNode.attributes.singerId)    scoreText  += " [" + this.getDocNode(scoreNode.attributes.singerId.nodeValue).innerHTML + "]";
        if (isAddArtist)                      scoreText  += " {" + scoreNode.parentNode.parentNode.attributes.name.nodeValue + "}";
        return scoreText;
    },
    /* Milonga */
    isStopVisible:            function()       { return (document.getElementById("stop").style.visibility === "visible"); },
    setMilongaControls:       function()        {
        document.getElementById("play" ).style.visibility = utils.isStopVisible()? "hidden": (document.querySelectorAll("[idref^='TA']").length > 0)? "visible": "hidden";
        document.getElementById("clear").style.visibility = utils.isStopVisible()? "hidden": (document.querySelectorAll("ul > li").length       > 0)? "visible": "hidden";
        document.getElementById("save" ).style.visibility = (document.querySelectorAll("ul > li").length > 0)? "visible": "hidden";
    },
    /* Play */
    isElementPlayingOrPlayed: function(element) { return (element.className.indexOf("Play") > -1); },
    displayPlayedMessage:     function(id)      { alert(messages.getMessage(id.startsWith("tanda_")? "tandaPlayedOrPlaying": "scorePlayedOrPlaying")); },
    resetAudioControl:        function(isPlaying) {
        if (isPlaying || !utils.isStopVisible()) {
            var audioControl                = document.querySelector("audio");
            audioControl.setAttribute("volume", 1.0);
            audioControl.setAttribute("src",    "");
            audioControl.pause();
        }
    },
    loadScore:                function(scoreId, isToPlay) {
        var thisScoreNode                   = this.getDocNode(scoreId);
        var src                             = scoreId.startsWith("CO")? "Cortina/": "Tango/";
        src                                += thisScoreNode.parentNode.parentNode.attributes.name.nodeValue + "/";
        src                                += thisScoreNode.parentNode.attributes.name.nodeValue  + "/"; 
        src                                += thisScoreNode.attributes.filename? thisScoreNode.attributes.filename.nodeValue: thisScoreNode.innerHTML;
        src                                += ".mp3";
        var audioControl                    = document.querySelector("audio");
        audioControl.setAttribute("volume", 1.0);
        audioControl.setAttribute("src",    src);
        audioControl.load();
        if (isToPlay)                         audioControl.play();
    },
    setFullScreen:            function() {
        var elem = document.documentElement;
             if (elem.requestFullscreen)       {              elem.requestFullscreen();       }
        else if (elem.webkitRequestFullscreen) { /* Safari */ elem.webkitRequestFullscreen(); }
        else if (elem.msRequestFullscreen)     { /* IE11 */   elem.msRequestFullscreen();     }
    },
};

document.addEventListener("DOMContentLoaded", function(event) { 
    utils.loadDoc(); 
    messages.setLanguage(); 
    alert(messages.getMessage("mainTitle"));
});

/* -\\- */
