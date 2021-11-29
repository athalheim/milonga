var milongaPlayer = {
    setPlayMode:              function(_isMilongaPlaying) {
        document.getElementById("stop").style.visibility  = _isMilongaPlaying? "visible": "hidden";
        utils.setTandaControls();
        utils.resetAudioControl();
    },
    playMilonga:              function() {
        this.setPlayMode(true);
        this.playNextScore();
    },
    stopMilonga:              function() {
        if (confirm(messages.getMessage("confirmStopMilonga"))) this.endMilonga();
    },
    endMilonga:               function() {
        this.setPlayMode(false);
        document.querySelectorAll("[idref]").forEach(e => e.className = "");
    },
    playNextScore:            function()  {
        document.querySelectorAll(".scorePlaying").forEach(e => {e.className = "scorePlayed"; if (e.id.startsWith("cortina")) e.parentElement.className = "tandaPlayed";});
        for(var score of document.querySelectorAll("p[idref]:not(.scorePlayed)")) {
            score.parentElement.className   = "tandaPlaying";
            score.className                 = (utils.isDocNode(score.attributes.idref.nodeValue))? "scorePlaying": "scorePlayed";
            if (score.className === "scorePlaying") return utils.loadScore(score.attributes.idref.nodeValue, true);
        }
        this.endMilonga();
    },
};

/* -\\- */
