var milongaPlayer = {
    setPlayMode:              function(stopVisibility) {
        document.getElementById("stop").style.visibility  = stopVisibility;
        utils.setMilongaControls();
        utils.resetAudioControl(true);
    },
    playMilonga:              function() {
        milongaPlayer.setPlayMode("visible");
        milongaPlayer.playNextScore();
    },
    stopMilonga:              function() { if (confirm(messages.getMessage("confirmStopMilonga"))) milongaPlayer.endMilonga(); },
    endMilonga:               function() {
        milongaPlayer.setPlayMode("hidden");
        document.querySelectorAll("li[idref]").forEach(e => { e.classList.remove("tandaPlaying"); e.classList.remove("tandaPlayed");});
        document.querySelectorAll("p[idref]" ).forEach(e => { e.classList.remove("scorePlaying"); e.classList.remove("scorePlayed");});
        if (document.querySelector(".tandaScore")) { document.querySelector(".tandaScore").parentElement.className = "tanda"; }
        if (milongaPlayer.fadeoutInterval) clearInterval(milongaPlayer.fadeoutInterval);
    },
    playNextScore:            function() {
        document.querySelector("audio").volume = 1.0;
        document.querySelectorAll(".scorePlaying").forEach(e => {e.className = "scorePlayed"; if (e.id.startsWith("cortina")) e.parentElement.className = "tandaPlayed";});
        for(var score of document.querySelectorAll("p[idref]:not(.scorePlayed)")) {
            score.parentElement.className   = "tandaPlaying";
            score.className                 = (utils.getDocNode(score.attributes.idref.nodeValue))? "scorePlaying": "scorePlayed";
            if (score.className === "scorePlaying") {
                utils.loadScore(score.attributes.idref.nodeValue, true);
                return;
            }
        }
        milongaPlayer.endMilonga();
    },
    fadeoutInterval:                        null,
    setFadeout:               function() { utils.isStopVisible()? milongaPlayer.fadeoutInterval = setInterval(milongaPlayer.fadeoutFollow, 50): alert(messages.getMessage("fadeoutTitle")); },
    fadeoutFollow:            function() {
        document.querySelector("audio").volume -= 0.01;
        if (document.querySelector("audio").volume < 0.01) {
            clearInterval(milongaPlayer.fadeoutInterval);
            setTimeout(milongaPlayer.playNextScore, 1000);
        }
    },
};

/* -\\- */
