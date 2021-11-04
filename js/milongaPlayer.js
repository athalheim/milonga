var milongaPlayer = {

    /* Keep track of played/playing tandas/scores */
    playingTanda:                           null,
    playingScore:                           null,

    playingColor:                           "deepskyblue",
    playedColor:                            "lightskyblue",



    setControlsToPlay: function(_isMilongaPlaying) {
        /* SCORES PANEL */
        /*  Audio control: Clear the scores audio control */
        utils.resetAudioControl("sc_AudioControl", (_isMilongaPlaying? "hidden": "visible"));
        /* MILONGA PANEL */
        /*  Management Buttons */
        document.getElementById("mi_load").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("mi_clear").style.visibility  = _isMilongaPlaying? "hidden": "visible";
        /*  Play Buttons */
        document.getElementById("mi_play").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("mi_stop").style.visibility   = _isMilongaPlaying? "visible": "hidden";
        /*  Audio control: Clear the milonga audio control */
        utils.resetAudioControl("mi_AudioControl", (_isMilongaPlaying? "visible": "hidden"));
        /* Reset Milonga variables */
        this.playingTanda                   = null;
        this.playingScore                   = null;
    },


    /* Play Button: Hidden when milonga is playing */
    playMilonga: function() {
        if (document.getElementById("mi_tandasList").childElementCount === 0) {
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
        var mi_tandasList                   = document.getElementById("mi_tandasList");
        var listItems                       = mi_tandasList.getElementsByTagName("li");
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
            this.playingTanda               = document.getElementById("mi_tandasList").firstElementChild;
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
            var mi_tandasList                 = document.getElementById("mi_tandasList");
            var mi_tandasListCenter           = mi_tandasList.offsetTop + (mi_tandasList.clientHeight * 0.5);
            var selectedTandaCenter         = this.playingTanda.offsetTop + (this.playingTanda.clientHeight * 0.5);
            mi_tandasList.scrollTop           = (selectedTandaCenter - mi_tandasListCenter);
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
        var mi_AudioControl             = document.getElementById("mi_AudioControl");
        mi_AudioControl.src             = src;
        mi_AudioControl.load();
        mi_AudioControl.play();
    },

};

/* -\\- */
