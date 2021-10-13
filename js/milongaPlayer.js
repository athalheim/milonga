var milongaPlayer = {

    playingTanda:                           null,
    playedTandaColor:                       "lightblue",

    playingScore:                           null,
    playingScoreColor:                      "darkblue",


    togglePlayPauseControls: function(_isMilongaPlaying) {
        /* COLLECTION PANEL */
        /*  Audio control: Clear the collection audio control */
        var scoreAudioControl               = document.getElementById("scoreAudioControl");
        scoreAudioControl.src               = "";
        scoreAudioControl.pause();
        document.getElementById("scoreAudioControl").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        /* MILONGA PANEL */
        /*  Management Buttons */
        document.getElementById("loadMilongaInput").style.visibility    = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("clearMilongaButton").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        /*   NOTE: Save button is kept visible */
        /*  Play Buttons */
        document.getElementById("milongaPlayButton").style.visibility   = _isMilongaPlaying? "hidden": "visible";
        document.getElementById("milongaStopButton").style.visibility   = _isMilongaPlaying? "visible": "hidden";
        /*  Audio control: Clear the milonga audio control */
        var milongaAudioControl             = document.getElementById("milongaAudioControl");
        milongaAudioControl.src             = "";
        milongaAudioControl.pause();
        document.getElementById("milongaAudioControl").style.visibility = _isMilongaPlaying? "visible": "hidden";
        /* Reset Milonga variables */
        this.playingTanda                   = null;
        this.playingScore                   = null;
    },


    /* Play Button: Hidden when milonga is playing */
    playMilonga: function() {
        if (document.getElementById("milongaList").innerHTML === "") {
            alert(messages.getMessage("mp_noPlayEmptyMilonga"));
        } else {
            this.togglePlayPauseControls(true);
            this.playNextScore();
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
        this.togglePlayPauseControls(false);
        table.resetListItem("milongaList");
    },


    /* Playing Milonga: Get next Tanda*/
    getNextTanda: function() {
      this.playingScore                     = null;
      /* First get hold of first/next tanda */
      if (this.playingTanda) {
          this.playingTanda                 = this.playingTanda.nextElementSibling;
      } else {
          this.playingTanda                 = document.getElementById("milongaList").firstElementChild;
      }
      /* Then, when there is a next tanda: */
      if (this.playingTanda) {
          /* Remove user selection on playing tanda*/
          if (this.playingTanda.id === milonga.selectedTandaId) {
            milonga.selectedTandaId        = null;
          }
          /* Highlight tanda */
          this.playingTanda.style.backgroundColor = milongaPlayer.playedTandaColor;
          /* Center tanda into view */
          /*  Get Milonga List Center */
          var milongaList                   = document.getElementById("milongaList");
          var milongaRectangle              = milongaList.getBoundingClientRect();
          var desiredTandaCenter            = (milongaRectangle.top + (milongaRectangle.height * 0.5));
          /*  Get Tanda Center */
          var tandaRectangle                = this.playingTanda.getBoundingClientRect();
          var currentTandaCenter            = (tandaRectangle.top + (tandaRectangle.height * 0.5));
          /*  Get Tanda center offset from Milonga center*/
          var relativeOffset                = (desiredTandaCenter - currentTandaCenter);
          /*  Adjust view with offset */
          milongaList.scrollTop            -= relativeOffset;
          /* Get first score */
          var playingScoreList             = this.playingTanda.firstElementChild;
          this.playingScore                = playingScoreList.firstElementChild;
        }
    },


    getNextScore: function() {
        if (this.playingScore) {
            /* Flag current score as 'played' */
            this.playingScore.style.backgroundColor = milongaPlayer.playedTandaColor;
            /* Get next score */
            if (this.playingScore.nextElementSibling) {
                this.playingScore             = this.playingScore.nextElementSibling;
            } else {
                this.getNextTanda();
            }
        } else {
            this.getNextTanda();
        }
        /* When there is a next score: */
        if (this.playingScore) {
            /* Highlight */
            this.playingScore.style.backgroundColor     = milongaPlayer.playingScoreColor;
            /* Skip until playable score or cortina is found */
            while (this.playingScore.attributes[attributes.idRef].nodeValue === milonga.emptyScoreId) {
                this.playingScore.style.backgroundColor = milongaPlayer.playedTandaColor;
                this.playingScore                       = this.playingScore.nextElementSibling;
                this.playingScore.style.backgroundColor = milongaPlayer.playingScoreColor;
            }
        }
        return this.playingScore;
    },


    /* Playing Milonga: Get next score*/
    playNextScore: function() {
        if (this.getNextScore()) {
            /* Build path to score/cortina */
            var src                         = "";
            var rootNode                    = null;
            var playingScoreIdRef           = this.playingScore.attributes[attributes.idRef].nodeValue;
            if (playingScoreIdRef.startsWith(collection.tangoIdPrefix)) {
              /* Score */
              src                           = collection.tangosPath;
              rootNode                      = collection.xmlDoc.querySelectorAll("tangos")[0];
            } else {
              /* Cortina */
              src                           = collection.cortinasPath;
              rootNode                      = collection.xmlDoc.querySelectorAll("cortinas")[0];
            }
            var scoreNode                   = rootNode.querySelector("score[id='" + playingScoreIdRef +"']");
            var albumNode                   = scoreNode.parentNode;
            var artistNode                  = albumNode.parentNode;
            src                            += artistNode.attributes[attributes.name].nodeValue + "/";
            src                            += albumNode.attributes[attributes.name].nodeValue    + "/";
            if (scoreNode.attributes[attributes.filename]) {
                src                        += scoreNode.attributes[attributes.filename].nodeValue + ".mp3";
            } else {
                src                        += scoreNode.attributes[attributes.title].nodeValue    + ".mp3";
            }
            /* Set audio/source controls */
            var milongaAudioControl         = document.getElementById("milongaAudioControl");
            milongaAudioControl.src         = src;
            milongaAudioControl.load();
            milongaAudioControl.play();
        } else {
            this.endMilonga();
        }
    },

};

/* -\\- */
