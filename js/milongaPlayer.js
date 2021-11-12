var milongaPlayer = {

    /* Keep track of played/playing tandas/scores */
    playingTanda:                           null,
    playingScore:                           null,

    tandaPlayingColor:                      "lightblue",
    scorePlayingColor:                      "deepskyblue",
    playedColor:                            "blue",



    setControlsToPlay: function(_isMilongaPlaying) {
        /*  Clear the  audio control */
        utils.resetAudioControl();
        /* MILONGA PANEL */
        /*  Management Buttons */
        document.getElementById("load").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("clear").style.visibility  = _isMilongaPlaying? "hidden": "visible";
        /*  Play Buttons */
        document.getElementById("play").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("stop").style.visibility   = _isMilongaPlaying? "visible": "hidden";
        /* Reset Milonga variables */
        this.playingTanda                   = null;
        this.playingScore                   = null;
    },


    /* Play Button: Hidden when milonga is playing */
    playMilonga: function() {
        if (document.getElementById("tandasList").childElementCount === 0) {
            alert(messages.getMessage("mp_noPlayEmptyMilonga"));
        } else {
            this.setControlsToPlay(true);
            this.playNextScore(true);
        }
    },

    /* Stop Button: displayed when milonga is playing */
    stopMilonga: function() {
        if (confirm(messages.getMessage("mp_ConfirmStopMilonga")) === true) {
            this.endMilonga();
        }
    },


    /* End Milonga : Called by 'stopMilonga' procedure and when last score has played */
    endMilonga: function() {
        this.setControlsToPlay(false);
        var tandasList                      = document.getElementById("tandasList");
        var listItems                       = tandasList.getElementsByTagName("li");
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].style.backgroundColor = "";
        }
    },


    getNextTanda: function(isFirst) {
        this.playingScore                   = null;
        if (this.playingTanda !== null) {
            this.playingTanda.style.backgroundColor = this.playedColor;
        }
        if (isFirst) {
            this.playingTanda               = document.getElementById("tandasList").firstElementChild;
        } else {
            this.playingTanda               = this.playingTanda.nextElementSibling;
        }
        if (this.playingTanda !== null) {
            if (this.playingTanda.id === milonga.selectedTandaId) {
                this.playingTanda.classList.remove("tanda");
                milonga.selectedTandaId      = null;
                milonga.selectedTandaScoreId = null;
            }
            this.playingTanda.style.backgroundColor = this.tandaPlayingColor;
            var tandasList                  = document.getElementById("tandasList");
            var tandasListCenter            = tandasList.offsetTop + (tandasList.clientHeight * 0.5);
            var selectedTandaCenter         = this.playingTanda.offsetTop + (this.playingTanda.clientHeight * 0.5);
            tandasList.scrollTop            = (selectedTandaCenter - tandasListCenter);
            this.playingScore               = this.playingTanda.firstElementChild.firstElementChild;
        }
    },


    playNextScore: function(isFirst)  {
        /* Exit when milonga is not playing */ 
        if (document.getElementById("stop").style.visibility === "hidden") {
            return;
        }
        if (this.playingScore !== null) {
            this.playingScore.style.backgroundColor = this.playedColor;
            this.playingScore = this.playingScore.nextElementSibling;
        }
        if (this.playingScore === null) {
            this.getNextTanda(isFirst);
        }
        if (this.playingTanda !== null) {
            while (this.playingScore.attributes["idref"].nodeValue === "TA0000") {
                this.playingScore.style.backgroundColor = this.playedColor;
                this.playingScore                       = this.playingScore.nextElementSibling;
                if (this.playingScore === null) break;
            }
            this.playingScore.style.backgroundColor     = this.scorePlayingColor;
            this.playScore();
        } else {
            this.endMilonga();
        }
    },


    /* Playing Milonga: Get next score*/
    playScore: function() {
        var playingScoreIdRef               = this.playingScore.attributes["idref"].nodeValue;
        utils.loadScore(playingScoreIdRef, true);
    },

};

/* -\\- */
