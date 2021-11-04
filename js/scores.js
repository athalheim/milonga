var scores = {

    xmlDoc:                                 null,
 
    tangosPath:                             "tangos/",
    tangoIdPrefix:                          "TA",

    cortinasPath:                           "cortinas/",
    cortinaIdPrefix:                        "CO",

    artistIdPrefix:                         "AR",

    currentStyle:                           "",
    scoreByStyleQuery:                      "",


    /* ------------------------------------------ */
    /* Values in expand/collapse 'Scores' tables */
    /*   Note: Computed in 'setDivisionsHeights' procedure */
    /*  Global 'Scores' division height */
    dataDivHeight:                          null,
    /*  Artists/Albums/Scores default height */
    artistsDivDefaultHeightPx:              null,
    albumsDivDefaultHeightPx:               null,
    scoresDivDefaultHeightPx:               null,
    /*  Expanded division height */
    expandedDivHeight:                      null,
    expandedDivHeightPx:                    null,
    /*  Collapsed division height */
    collapsedDivHeight:                     null,
    collapsedDivHeightPx:                   null,
    /*  Single list item height */
    listItemHeight:                         null,

    currentScoresDisplayMode:               null,
    /* ------------------------------------------ */
    /* PROCEDURES */


  resize: function() {
    this.setScoresDataDivisionsHeights();
    this.expandScoreDiv(this.currentScoresDisplayMode, null);
  },

    setScoresDataDivisionsHeights: function() {
      /* Based on utils' dataDivHeight: */
      /* Get Artists' header height */
      var artistsHeaderHeight               = document.getElementById("sc_artists").clientHeight;
      /* Single list item height */
      this.listItemHeight                   = document.getElementById("artistsList").firstElementChild.clientHeight;
      /* Collapsed division height */
      this.collapsedDivHeight               = artistsHeaderHeight + this.listItemHeight;
      this.collapsedDivHeightPx             = this.collapsedDivHeight + "px";
      /* Expanded division height */
      this.expandedDivHeight                = utils.dataDivHeight - (this.collapsedDivHeight * 2);
      this.expandedDivHeightPx              = this.expandedDivHeight + "px";
      /* Set default heights for Artists/Albums/Scores divisions */
      var artistsDivHeight                  = Math.round(0.33 * utils.dataDivHeight);
      var albumsDivHeight                   = Math.round(0.25 * utils.dataDivHeight);
      this.scoresDivDefaultHeightPx         = (utils.dataDivHeight - (artistsDivHeight + albumsDivHeight)) + "px";
      this.artistsDivDefaultHeightPx        = artistsDivHeight + "px";
      this.albumsDivDefaultHeightpx         = albumsDivHeight + "px";
    },

    /* INITIALIZE DATABASE */
    loadDoc: function() {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {
          if (this.readyState == 4 && this.status == 200) {
            scores.xmlDoc                   = this.responseXML;
            scores.processStyle("Tango");
          }
        };
        xhttp.open("GET", "data/tangos.xml", true);
        xhttp.send();
    },

    setScoresLanguage: function() {
      document.getElementById("sc_style"  ).innerHTML = messages.getMessage("sc_style");
      document.getElementById("sc_title"  ).innerHTML = messages.getMessage("sc_title");
      document.getElementById("sc_artists").innerHTML = messages.getMessage("sc_artists");
      document.getElementById("sc_albums" ).innerHTML = messages.getMessage("sc_albums");
      document.getElementById("sc_scores" ).innerHTML = messages.getMessage("sc_scores");

      document.getElementById("sc_artists").title     = messages.getMessage("sc_artists_click");
      document.getElementById("sc_albums" ).title     = messages.getMessage("sc_albums_click");
      document.getElementById("sc_scores" ).title     = messages.getMessage("sc_scores_click");
    },


      /* *********************************************************************** */
    /* STYLE */
    /* Display styles list */
    displayStyleSelection: function(element) {
        const styleListRect                 = element.getBoundingClientRect();
        var styleList                       = document.getElementById("styleList");
        styleList.style.display             = "block";
        styleList.style.left                = (styleListRect.left + ((styleListRect.width - styleList.clientWidth) * 0.5)) + "px";
        styleList.style.top                 = styleListRect.bottom + "px";
    },

    /* Select style from list */
    selectStyle: function(event) {
        var element                         = utils.getListElement(event);
        document.getElementById("styleList").style.display = "none";
        this.processStyle(element.innerHTML);
    },

    /* Process selected style */
    processStyle: function(thisStyle) {
        this.currentStyle                   = thisStyle;
        /* Display selected style name */
        document.getElementById("sc_style").innerHTML   = messages.getMessage("sc_selectedStyle") + thisStyle;
        /* Select appropriate artists from database */
        if (thisStyle === "Cortina") {
          this.scoreByStyleQuery            = "score";
          this.listArtists("cortinas");
        } else {
          this.scoreByStyleQuery            = "score[style='" + thisStyle + "']";
          this.listArtists("tangos");
        }
    },
  

    /* *********************************************************************** */
    /* Artists/Albums/Scores expansion/collapse */
    expandScoreDiv: function(mode, event) {
      if (event) {
        if (event.preventDefault  != undefined) event.preventDefault();
        if (event.stopPropagation != undefined) event.stopPropagation();
      }
      this.currentScoresDisplayMode         = mode;
      if (mode !== null) {
        document.getElementById("sc_artistsDiv").style.height = (mode === 0)?this.expandedDivHeightPx:this.collapsedDivHeightPx;
        document.getElementById("sc_albumsDiv" ).style.height = (mode === 1)?this.expandedDivHeightPx:this.collapsedDivHeightPx;
        document.getElementById("sc_scoresDiv" ).style.height = (mode === 2)?this.expandedDivHeightPx:this.collapsedDivHeightPx;
      } else {
        document.getElementById("sc_artistsDiv").style.height = this.artistsDivDefaultHeightPx;
        document.getElementById("sc_albumsDiv" ).style.height = this.albumsDivDefaultHeightpx;
        document.getElementById("sc_scoresDiv" ).style.height = this.scoresDivDefaultHeightPx;
      }
      /* Make sure selected item stays into view */
      this.moveSelectedItemIntoView("artistsList");
      this.moveSelectedItemIntoView("albumsList");
      this.moveSelectedItemIntoView("scoresList");
    },

    moveSelectedItemIntoView: function(thisListId) {
        /* Get selected item */
        var thisList                        = document.getElementById(thisListId);
        var selectedItem                    = thisList.querySelector(".red");
        if (selectedItem) {
            var thisListCenter              = thisList.offsetTop + (thisList.clientHeight * 0.5);
            var selectedItemCenter          = selectedItem.offsetTop+ (selectedItem.clientHeight * 0.5);
            thisList.scrollTop              = (selectedItemCenter - thisListCenter);
        }
    },
    

    /* *********************************************************************** */
    /* Scores CELL */

    /* ARTISTS */
    /* List artists */
    listArtists: function(tableName) {
        var listContent                     = "";
        var tableNode                       = this.xmlDoc.querySelector(tableName);
        var artistNodes                     = tableNode.getElementsByTagName("artist");
        for (var i = 0; i < artistNodes.length; i++) { 
          var artistNode                    = artistNodes[i];
          var scoreCount                    = artistNode.querySelectorAll(this.scoreByStyleQuery).length;
          if (scoreCount > 0) {
            listContent                    += "<li id='" + artistNode.id + "' draggable='true'>";
            listContent                    += this.listArtistText(artistNode);
            listContent                    += "</li>";
          }
        }
        document.getElementById("artistsList").innerHTML = listContent;
        this.sortList("artistsList");
        /* Select first artist list item to list all/albums */
        var firstArtistListItem             = document.getElementById("artistsList").firstElementChild;
        this.selectArtistById(firstArtistListItem.id);
    },

    listArtistText: function(artistNode, isMilonga) {
      var artistText                        = "";
      if (isMilonga) artistText            += this.currentStyle + ": ";
      artistText                           += artistNode.attributes[attributes.name].nodeValue + " (" ;
      artistText                           += artistNode.attributes[attributes.birth]? artistNode.attributes[attributes.birth].nodeValue: "" ;
      artistText                           += "-" ;
      artistText                           += artistNode.attributes[attributes.death]? artistNode.attributes[attributes.death].nodeValue: "" ;
      artistText                           += ")" ;
      return artistText
    },

    /* SELECT ARTIST and list Albums according to style */
      /* This is called when user selects an artist */
    selectArtist: function(event) {
        var element                         = utils.getListElement(event);
        this.selectArtistById(element.id);
    },

    selectArtistById: function(_thisArtistId) {
        utils.resetListItem("artistsList", _thisArtistId);
        /* Select artist tag */
        var thisArtistNode                  = this.xmlDoc.querySelector("artist[id='" + _thisArtistId +"']");
        /* List and count Artist Albums, according to current style */
        var listContent                     = "";
        var listedAlbumCount                = 0;
        var albumNodes                      = thisArtistNode.getElementsByTagName("album");
        for (var i = 0; i < albumNodes.length; i++) {
          var albumNode                     = albumNodes[i];
          var scoreCount                    = albumNode.querySelectorAll(this.scoreByStyleQuery).length;
          if (scoreCount > 0 ) {
            listedAlbumCount               += 1;
            listContent                    += "<li id='" + albumNode.id + "'>";
            listContent                    += albumNode.attributes[attributes.name].nodeValue + ' (' + scoreCount + ")";
            listContent                    += "</li>";
          }
        }
        /* Add 'All Albums' choice when more than one album found */
        if (listedAlbumCount > 1) {
          var scoreCount                    = thisArtistNode.querySelectorAll(this.scoreByStyleQuery).length;
          var allAlbumsItem                 = "<li id='" + _thisArtistId + "'>All Albums (" + scoreCount + ")</li>";
          listContent                       = allAlbumsItem + listContent;
        }
        document.getElementById("albumsList").innerHTML = listContent;
        this.sortList("albumsList");
        /* Select first album list item to list all/album scores */
        var firstAlbumListItem              = document.getElementById("albumsList").firstElementChild;
        this.selectAlbumById(firstAlbumListItem.id);
    },


    /* ALBUMS */
    /* Select Album and list Scores (by style) */
    selectAlbum: function(event) {
        var element                         = utils.getListElement(event);
        this.selectAlbumById(element.id);
    },

    selectAlbumById: function(thisAlbumId) {
        utils.resetAudioControl("sc_AudioControl", "visible")
        utils.resetListItem("albumsList", thisAlbumId);
        var listContent                     = "";
        var thisAlbumNode                   = this.xmlDoc.querySelector("[id='" + thisAlbumId + "']");
        var scoreNodes                      = thisAlbumNode.querySelectorAll(this.scoreByStyleQuery);
        for (var i  = 0; i < scoreNodes.length; i++) {
          var thisScoreNode                 = scoreNodes[i];
          listContent                      += "<li id='" + thisScoreNode.id + "' draggable='true'>";
          listContent                      += this.buildScoreText(thisScoreNode);
          listContent                      += "</li>";
        }
        document.getElementById("scoresList").innerHTML = listContent;
        this.sortList("scoresList");
    },


    buildScoreText: function(thisScoreNode) {
      let thisText                          = thisScoreNode.attributes[attributes.title].nodeValue;
      if (thisScoreNode.attributes[attributes.date]) {
        thisText                           += "," + thisScoreNode.attributes[attributes.date].nodeValue;
      }
      if (thisScoreNode.attributes[attributes.duration]) {
        thisText                           += " (" + thisScoreNode.attributes[attributes.duration].nodeValue + ")";
      }
      if (thisScoreNode.attributes[attributes.singerId]) {
        var thisSingerId                    = thisScoreNode.attributes[attributes.singerId].nodeValue;
        var thisSingerNode                  = this.xmlDoc.querySelector("[id='" + thisSingerId + "']");
        thisText                           += ", " + thisSingerNode.attributes[attributes.name].nodeValue;
      }
      return thisText;
    },


    sortList: function(listId) {
        var selectedList                    = document.getElementById(listId);
        var switched                        = false;
        do {
          switched                          = false;
          var listItems                     = selectedList.getElementsByTagName("LI");
          for (var i = 0; i < (listItems.length - 1); i++) {
            if (listItems[i + 1].innerHTML.localeCompare(listItems[i].innerHTML) === -1) {
              selectedList.insertBefore(listItems[i + 1], listItems[i]);
              switched = true;
            }
          }
        } while (switched)
    },


    /* SCORES */
    selectScore: function(event) {
      utils.resetAudioControl("sc_AudioControl", "visible")
      var element                           = utils.getListElement(event);
      utils.resetListItem("scoresList", element.id);
      if (element.nodeName === "LI") {
        this.loadScore(element);
      }
    },


        /* PLAYER: Called when double-clicking on score*/
    loadScore: function(element) {
        var thisScoreNode                   = this.xmlDoc.querySelector("[id='" + element.id + "']");
        var thisAlbumNode                   = thisScoreNode.parentNode;
        var thisArtistNode                  = thisAlbumNode.parentNode;
        var src                             = (this.currentStyle === "Cortina")? this.cortinasPath: this.tangosPath;
        src                                += thisArtistNode.attributes[attributes.name].nodeValue + "/";
        src                                += thisAlbumNode.attributes[attributes.name].nodeValue    + "/"; 
        if (thisScoreNode.attributes[attributes.filename]) {
          src                              += thisScoreNode.attributes[attributes.filename].nodeValue + ".mp3";
        } else {
          src                              += thisScoreNode.attributes[attributes.title].nodeValue    + ".mp3";
        }
        var audio                           = document.getElementById("sc_AudioControl");
        audio.src                           = src;
        audio.load();
      },

};

/* -\\- */
