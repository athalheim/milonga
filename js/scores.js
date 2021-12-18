var scores = {
    selectedScores:              [],
    listArtists:              function(tangoStyle, artistId, scoreId) {
      utils.resetAudioControl();
      this.selectedScores                   = [];
      document.getElementById('styleList').value = tangoStyle;
      document.getElementById("partituras").innerHTML    = "";
      [...utils.xmlDoc.querySelectorAll("artist")].filter(a => a.querySelectorAll("[style='" + tangoStyle + "']").length).forEach(e => { document.getElementById("partituras").innerHTML += "<li id='" + e.id + "' draggable='true'>" + utils.buildArtistText(e.id) +"</li>"; });
      if (artistId)                           this.selectArtist(artistId);
      if (scoreId)                            this.selectScore(scoreId);
    },
    selectFromPartituras:     function(event) {
      utils.resetAudioControl();
      var sourceElement                     = event.target.closest("[id]");
           if (sourceElement.id === "partituras") { this.resetArtist(); }
      else if (sourceElement.id.startsWith("AR")) { this.selectArtist(sourceElement.id); }
      else                                        { this.selectScore(sourceElement.id, event.ctrlKey);  }
    },
    selectArtist:             function(thisArtistId) {
      utils.resetAudioControl();
      this.resetArtist();
      var thisArtistListItem                = document.getElementById(thisArtistId);
      thisArtistListItem.innerHTML          = "<strong>" + thisArtistListItem.innerHTML + "</strong>";
      utils.getArtist(thisArtistId).querySelectorAll("[style='" + document.getElementById('styleList').value + "']").forEach(e => { thisArtistListItem.innerHTML     += "<p id='" + e.id + "' draggable='true'>"+ utils.buildScoreText(e)+ "</p>"; });
      thisArtistListItem.className          = "artist";
    },
    resetArtist:              function() {
      document.querySelectorAll(".artist").forEach(e => {e.innerHTML = e.firstElementChild.innerHTML; e.className = ""; });
      this.selectedScores                   = [];
    },
    selectScore:              function(thisScoreId, isCtrl) {
      utils.resetAudioControl();
      if (isCtrl) {
        document.getElementById(thisScoreId).className = "score";
        this.selectedScores.push(thisScoreId);
      } else {
        document.querySelectorAll(".score").forEach(e => e.className = "");
        document.getElementById(thisScoreId).className = "score";
        this.selectedScores                 = [thisScoreId];
        if (!utils.isStopVisible())           utils.loadScore(thisScoreId);
      }
    },
};

/* -\\- */
