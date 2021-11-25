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
            playedScore.className = "scorePlayed";
            if (playedScore.id.startsWith("co")) playedScore.parentElement.className = "tandaPlayed";
        }
        for(var scoreToPlay of document.querySelectorAll("p[idref]:not(.scorePlayed)")) {
            scoreToPlay.parentElement.className = "tandaPlaying";
            var idref                       = scoreToPlay.attributes.idref.nodeValue;
            if (!idref || !utils.getDocNode(idref)) { scoreToPlay.className ="scorePlayed"; }
            else {
                scoreToPlay.className ="scorePlaying";
                utils.loadScore(idref);
                document.querySelector("audio").play();
                return;
            }
        }
        this.endMilonga();
    },
};

/* -\\- */
