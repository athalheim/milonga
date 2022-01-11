var scores = {
    selectedScores:           [],
    selectEra:                function(tangoEra)   { this.listArtists(tangoEra, document.getElementById('styleList').value); },
    selectStyle:              function(tangoStyle) { this.listArtists((document.getElementById('eraList')? document.getElementById('eraList').value: null), tangoStyle); 
    },
    listArtists:              function(tangoEra, tangoStyle, artistId, scoreId) {
      utils.resetAudioControl();
      this.selectedScores                                = [];
      if (document.getElementById('eraList')) document.getElementById('eraList').value        = tangoEra;
      document.getElementById('styleList').value         = tangoStyle;
      var artistFilter                                   = "artist";
      if (document.getElementById('eraList'))  artistFilter +=  "[era='" + tangoEra + "']";
      var artistArray                                    = [];
      [...utils.xmlDoc.querySelectorAll(artistFilter)].filter(a => a.querySelectorAll("[style='" + tangoStyle + "']").length).forEach(e => { artistArray.push(e.attributes.name.nodeValue + ":" + e.id) });
      document.getElementById("partituras").innerHTML    = "";
      artistArray.sort().forEach(e => {
        var artistId = e.split(":").pop();
        document.getElementById("partituras").innerHTML += "<li id='" + artistId + "' draggable='true'>" + utils.buildArtistText(artistId) +"</li>";
      });
      if (artistId) this.selectArtist(artistId);
      if (scoreId)  this.selectScore(scoreId);
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
      var scoreArray                        = [];
      utils.getArtist(thisArtistId).querySelectorAll("[style='" + document.getElementById('styleList').value + "']").forEach(e => scoreArray.push(e.innerHTML + ":" + e.id));
      scoreArray.sort().forEach(e => {
        var scoreNode = utils.getDocNode(e.split(":").pop());
        thisArtistListItem.innerHTML       += "<p id='" + scoreNode.id + "' draggable='true'>"+ utils.buildScoreText(scoreNode)+ "</p>";
      });
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
