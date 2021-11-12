var scores = {

    currentStyle:                           "",
    scoreByStyleQuery:                      "",

    selectedArtistId:                       null,
    selectedArtistText:                     null,


    /* *********************************************************************** */
    /* Language */
    setScoresLanguage: function() {
      document.getElementById("scores"  ).innerHTML = messages.getMessage("scores");
      document.getElementById("artists").innerHTML = messages.getMessage("artists");
    },


    /* Style */
    displayStyleSelection: function(artistTitle) {
        const styleTitleRect               = artistTitle.getBoundingClientRect();
        var styleList                       = document.getElementById("tangoStyleList");
        styleList.style.display             = "block";
        styleList.style.left                = styleTitleRect.left + "px";
        styleList.style.top                 = (styleTitleRect.top + styleTitleRect.height) + "px";
    },

    selectStyle: function(event) {
        document.getElementById("tangoStyleList").style.display = "none";
        var element                         = utils.getListElement(event);
        this.processStyle(element.innerHTML);
    },

    processStyle: function(thisStyle) {
        this.currentStyle                   = thisStyle;
        document.getElementById("tangoStyle").innerHTML =  "(" + thisStyle + ")";
        if (thisStyle === "Cortina") {
          this.scoreByStyleQuery            = "score";
          this.listArtists("cortinas");
        } else {
          this.scoreByStyleQuery            = "score[style='" + thisStyle + "']";
          this.listArtists("tangos");
        }
    },


    /* *********************************************************************** */
    /* Artists */
    listArtists: function(tableName) {
      this.selectedArtistId                 = null;
      this.selectedArtistText               = null;
      var listContent                       = "";
      var tableNode                         = utils.xmlDoc.querySelector(tableName);
      var artistNodes                       = tableNode.getElementsByTagName("artist");
      for (var i = 0; i < artistNodes.length; i++) { 
        var artistNode                      = artistNodes[i];
        var scoreCount                      = artistNode.querySelectorAll(this.scoreByStyleQuery).length;
        if (scoreCount > 0) {
          listContent                      += "<li id='" + artistNode.id + "' draggable='true'>";
          listContent                      += utils.buildArtistText(artistNode);
          listContent                      += "</li>";
        }
      }
      document.getElementById("artistsList").innerHTML = listContent;
    },


    /* Select artist/score */
    selectFromArtistsList: function(event) {
      event.stopPropagation();
      var listItem                          = utils.getListElement(event);
      if (listItem.id.startsWith("AR")) {
        this.selectArtist(listItem);
      } else if (listItem.id.startsWith("TA") || listItem.id.startsWith("CO")) {
        this.selectScore(listItem);
      } else {
        this.resetScore();
      }
    },

    selectArtist: function(thisArtistListItem) {
      if (thisArtistListItem.id.startsWith("TA")) return;
      if (this.selectedArtistId !== null) {
        var previousArtist                  = document.getElementById(this.selectedArtistId);
        previousArtist.innerHTML            = this.selectedArtistText;
        previousArtist.classList.remove("artist");
        this.selectedArtistId               = null;
        this.selectedArtistText             = null;
      }
      this.selectedArtistId                 = thisArtistListItem.id;
      this.selectedArtistText               = thisArtistListItem.innerHTML;
      thisArtistListItem.classList.add("artist");
      var artistListContent                 = "<b>" + thisArtistListItem.innerHTML + "</b>";
      artistListContent                    += "<ol style='margin-left:10px;'>";
      var thisArtistNode                    = utils.xmlDoc.querySelector("artist[id='" + this.selectedArtistId +"']");
      var artistScores                      = thisArtistNode.querySelectorAll(this.scoreByStyleQuery);
      for (var i = 0; i < artistScores.length; i++) {
        var thisScoreNode                   = artistScores[i];
        artistListContent                  += "<li id='" + thisScoreNode.id + "' draggable='true'>";
        artistListContent                  += utils.buildScoreText(thisScoreNode);
        artistListContent                  += "</li>";
      } 
      artistListContent                    += "</ol>";
      thisArtistListItem.innerHTML          = artistListContent;
    },


    /* Scores */
    selectScore: function(thisScoreListItem) {
      this.removeScoreClass(thisScoreListItem.parentElement);
      thisScoreListItem.classList.add("score");
      if (document.getElementById("stop").style.visibility === "hidden") {
        utils.loadScore(thisScoreListItem.id);
      }
    },

    resetScore: function() {
      if (this.selectedArtistId !== null) {
        this.removeScoreClass(document.getElementById(this.selectedArtistId));
        if (document.getElementById("stop").style.visibility === "hidden") {
          utils.resetAudioControl();
        }
      }
    },

    removeScoreClass: function(selectedList) {
      selectedList.querySelectorAll( ".score" ).forEach( e => e.classList.remove("score"));
    },

};

/* -\\- */
