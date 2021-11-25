var milongaPlayer = {
    setControlsToPlay: function(_isMilongaPlaying) {
        document.getElementById("stop").style.visibility  = _isMilongaPlaying? "visible": "hidden";
        utils.resetAudioControl();
        utils.setTandaControls();
    },
    playMilonga: function() {
        this.setControlsToPlay(true);
        this.playNextScore();
    },
    stopMilonga: function() {
        confirm(messages.getMessage("confirmStopMilonga"))? this.endMilonga(): null;
    },
    endMilonga: function() {
        this.setControlsToPlay(false);
        document.getElementById("tandasList").querySelectorAll("p" ).forEach( e => e.className = "");
        document.getElementById("tandasList").querySelectorAll("li").forEach( e => e.className = "");
    },
    playNextScore: function()  {
        var playedScore                     = document.querySelector(".scorePlaying");
        if (playedScore) {
            playedScore.className           = "scorePlayed";
            if (playedScore.id.startsWith("co")) playedScore.parentElement.className = "tandaPlayed";
        }
        for(var nextScore of document.querySelectorAll("p[idref]:not(.scorePlayed)")) {
            nextScore.parentElement.className = "tandaPlaying";
            var idref                       = nextScore.attributes.idref.nodeValue;
            if (!idref || !utils.getDocNode(idref)) { nextScore.className = "scorePlayed"; }
            else {
                nextScore.className         = "scorePlaying";
                utils.loadScore(idref);
                document.querySelector("audio").play();
                return;
            }
        }
        this.endMilonga();
    },
};

/* -\\- */
