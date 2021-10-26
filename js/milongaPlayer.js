var milongaPlayer = {

    /* Keep track of played/playing tandas/scores */
    playingTanda:                           null,
    playingScore:                           null,

    playingColor:                           "lightskyblue",
    playedColor:                            "deepskyblue",



    setControlsToPlay: function(_isMilongaPlaying) {
        /* SCORES PANEL */
        /*  Audio control: Clear the scores audio control */
        table.resetAudioControl("scoreAudioControl", (_isMilongaPlaying? "hidden": "visible"));
        /* MILONGA PANEL */
        /*  Management Buttons */
        document.getElementById("mi_load").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("mi_clear").style.visibility  = _isMilongaPlaying? "hidden": "visible";
        /*  Play Buttons */
        document.getElementById("mi_play").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("mi_stop").style.visibility   = _isMilongaPlaying? "visible": "hidden";
        /*  Audio control: Clear the milonga audio control */
        table.resetAudioControl("milongaAudioControl", (_isMilongaPlaying? "visible": "hidden"));
        /* Reset Milonga variables */
        this.playingTanda                   = null;
        this.playingScore                   = null;
    },


    /* Play Button: Hidden when milonga is playing */
    playMilonga: function() {
        if (document.getElementById("milongaList").childElementCount === 0) {
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
        /* Clear all highlights */
        var milongaList                     = document.getElementById("milongaList");
        var listItems                       = milongaList.getElementsByTagName("li");
        for (var i = 0; i < listItems.length; i += 1) {
            listItems[i].style.backgroundColor = "";
        }
    },


    getNextTanda: function(isFirst) {
        this.playingScore                   = null;
        /* Set previous tanda to 'played' */
        if (this.playingTanda) {
            this.playingTanda.style.backgroundColor = this.playedColor;
        }
        /* Get hold of first/next tanda */
        if (isFirst) {
            this.playingTanda               = document.getElementById("milongaList").firstElementChild;
        } else {
            this.playingTanda               = this.playingTanda.nextElementSibling;
        }
        if (this.playingTanda) {
            /* Remove any previous selection from this danda */
            if (this.playingTanda.id === milonga.selectedTandaId) {
                this.playingTanda.classList.remove('red');
                milonga.selectedTandaId     = null;
            }
            /* Set tanda to 'playing' */
            this.playingTanda.style.backgroundColor = this.playingColor;
            /* Center tanda into view */
            var milongaList                 = document.getElementById("milongaList");
            var milongaListCenter           = milongaList.offsetTop + (milongaList.clientHeight * 0.5);
            var selectedTandaCenter         = this.playingTanda.offsetTop + (this.playingTanda.clientHeight * 0.5);
            milongaList.scrollTop           = (selectedTandaCenter - milongaListCenter);
            /* Get first score */
            var playingScoreList            = this.playingTanda.firstElementChild;
            this.playingScore               = playingScoreList.firstElementChild;
        }
    },


    playNextScore: function(isFirst)  {
        if (this.playingScore) {
            this.playingScore.style.backgroundColor = this.playedColor;
            this.playingScore = this.playingScore.nextElementSibling;
        }
        if (!this.playingScore) {
            this.getNextTanda(isFirst);
        }
        if (this.playingTanda) {
            while (this.playingScore.attributes[attributes.idRef].nodeValue === milonga.emptyScoreIdRef) {
                this.playingScore.style.backgroundColor = this.playedColor;
                this.playingScore                       = this.playingScore.nextElementSibling;
                if (!this.playingScore) break;
            }
            this.playingScore.style.backgroundColor     = this.playingColor;
            this.playScore();
        } else {
            this.endMilonga();
        }
    },


    /* Playing Milonga: Get next score*/
    playScore: function() {
        var playingScoreIdRef               = this.playingScore.attributes[attributes.idRef].nodeValue;
        var scoreNode                       = scores.xmlDoc.querySelector("score[id='" + playingScoreIdRef +"']");
        var albumNode                       = scoreNode.parentNode;
        var artistNode                      = albumNode.parentNode;
        /* Build path to score/cortina */
        var src                             = (playingScoreIdRef.startsWith(scores.tangoIdPrefix))? scores.tangosPath: scores.cortinasPath;
        src                                += artistNode.attributes[attributes.name].nodeValue    + "/";
        src                                += albumNode.attributes[attributes.name].nodeValue     + "/";
        if (scoreNode.attributes[attributes.filename]) {
            src                            += scoreNode.attributes[attributes.filename].nodeValue + ".mp3";
        } else {
            src                            += scoreNode.attributes[attributes.title].nodeValue    + ".mp3";
        }
        /* Set audio/source controls */
        var milongaAudioControl             = document.getElementById("milongaAudioControl");
        milongaAudioControl.src             = src;
        milongaAudioControl.load();
        milongaAudioControl.play();
    },

};

/* -\\- */
