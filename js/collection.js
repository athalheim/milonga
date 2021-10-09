var collection = {

    xmlDoc:                                 null,
    rootNode:                               null,
    cortinasNode:                           null,
    chanteursNode:                          null,

    tangosPath:                             "tangos/",
    tangoPrefix:                            "TA",

    cortinasPath:                           "cortinas/",
    cortinaPrefix:                          "CO",

    artistPrefix:                           "AR",

    currentStyle:                           "",
    scoreByStyleQuery:                      "",


    /* INITIALIZE DATABASE */
    loadDoc: function() {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {
          if (this.readyState == 4 && this.status == 200) {
            collection.xmlDoc               = this.responseXML;
            collection.chanteursNode        = collection.xmlDoc.querySelector("chanteurs");
            collection.cortinasNode         = collection.xmlDoc.querySelector("cortinas");
            collection.processStyle("Tango");
          }
        };
        xhttp.open("GET", "data/tango.xml", true);
        xhttp.send();
    },


      /* *********************************************************************** */
    /* STYLE */
    /* Display styles list */
    displayStyleSelection: function(element) {
      element.nextElementSibling.style.display = "block";
    },

    /* Select style from list */
    selectStyle: function(event) {
        var element                         = table.getListElement(event);
        /* Hide styles list */
        document.getElementById("styleList").style.display = "none";
        this.processStyle(element.innerHTML);
    },

    /* Process selected style */
    processStyle: function(thisStyle) {
        this.currentStyle                   = thisStyle;
        /* Display selected style name */
        document.getElementById("styleButton").innerHTML   = "Selected style is " + thisStyle;
        /* Select appropriate artists from database */
        if (thisStyle === "Cortina") {
          this.rootNode                     = this.xmlDoc.querySelector("cortinas");
          this.scoreByStyleQuery            = "piece";
        } else {
          this.rootNode                     = this.xmlDoc.querySelector("tangos");
          this.scoreByStyleQuery            = "piece[style='" + thisStyle + "']";
        }
        this.listArtists();
    },
  
  
    /* *********************************************************************** */
    /* COLLECTION CELL */

    /* ARTISTS */
    /* List artists */
    listArtists: function() {
        var listContent                     = "";
        var artistNodes                     = this.rootNode.getElementsByTagName("artiste");
        for (var i = 0; i < artistNodes.length; i++) { 
          var artistNode                    = artistNodes[i];
          var scoreCount                    = artistNode.querySelectorAll(this.scoreByStyleQuery).length;
          if (scoreCount > 0) {
            listContent                    += "<li id='" + artistNode.id + "' draggable='true'>";
            listContent                    += artistNode.attributes[attributes.artiste].nodeValue + " (" + scoreCount + ")";
            listContent                    += "</li>";
          }
        }
        /* Update Artist List */
        document.getElementById("artistsList").innerHTML = listContent;
        /* Select first artist list item to list all/albums */
        var firstArtistListItem             = document.getElementById("artistsList").firstElementChild;
        this.selectArtistById(firstArtistListItem.id);
    },

    /* SELECT ARTIST and list Albums according to style */
      /* This is called when user selects an artist */
    selectArtist: function(event) {
        var element                         = table.getListElement(event);
        this.selectArtistById(element.id);
    },

    selectArtistById: function(_thisArtistId) {
        table.resetListItem("artistsList", _thisArtistId);
        /* Select artist tag */
        var thisArtistNode                  = this.rootNode.querySelector("artiste[id='" + _thisArtistId +"']");
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
            listContent                    += albumNode.attributes[attributes.album].nodeValue + ' (' + scoreCount + ")";
            listContent                    += "</li>";
          }
        }
        /* Add 'All Albums' choice when more than one album found */
        if (listedAlbumCount > 1) {
          var scoreCount                    = thisArtistNode.querySelectorAll(this.scoreByStyleQuery).length;
          var allAlbumsItem                 = "<li id='" + _thisArtistId + "'>All Albums (" + scoreCount + ")</li>";
          listContent                       = allAlbumsItem + listContent;
        }
        /* Update Album List */
        document.getElementById("albumsList").innerHTML = listContent;
        /* Select first album list item to list all/album scores */
        var firstAlbumListItem              = document.getElementById("albumsList").firstElementChild;
        this.selectAlbumById(firstAlbumListItem.id);
    },


    /* ALBUMS */
    /* Select Album and list Scores (by style) */
    selectAlbum: function(event) {
        var element                         = table.getListElement(event);
        this.selectAlbumById(element.id);
    },

    selectAlbumById: function(thisAlbumId) {
        /* 1. ALBUM SELECTION */
        table.resetListItem("albumsList", thisAlbumId);
        /* 3. BUILD SCORE LIST */
        /* List selected scores */
        var listContent                     = "";
        var thisAlbumNode                   = this.rootNode.querySelector("[id='" + thisAlbumId + "']");
        var scoreNodes                      = thisAlbumNode.querySelectorAll(this.scoreByStyleQuery);
        for (var i  = 0; i < scoreNodes.length; i++) {
          var thisScoreNode                 = scoreNodes[i];
          listContent                      += "<li id='" + thisScoreNode.id + "' draggable='true'>";
          listContent                      += this.buildScoreText(thisScoreNode);
          listContent                      += "</li>";
        }
        /* Update Score List and select first score */
        document.getElementById("scoresList").innerHTML = listContent;
        this.sortScores();
    },


    buildScoreText: function(thisScoreNode) {
      let thisText                          = thisScoreNode.attributes[attributes.titre].nodeValue;
      if (thisScoreNode.attributes[attributes.date]) {
        thisText                           += "," + thisScoreNode.attributes[attributes.date].nodeValue;
      }
      if (thisScoreNode.attributes[attributes.durée]) {
        thisText                           += " (" + thisScoreNode.attributes[attributes.durée].nodeValue + ")";
      }
      if (thisScoreNode.attributes[attributes.chanteurId]) {
        var thisChanteurId                  = thisScoreNode.attributes[attributes.chanteurId].nodeValue;
        var thisChanteurNode                = this.chanteursNode.querySelector("[id='" + thisChanteurId + "']");
        thisText                           += ", " + thisChanteurNode.attributes[attributes.chanteur].nodeValue;
      }
      return thisText;
    },


    sortScores: function() {
        var switched                        = false;
        var scoresList                      = document.getElementById("scoresList");
        do {
          switched                          = false;
          var scoreItems                    = scoresList.getElementsByTagName("LI");
          for (var i = 0; i < (scoreItems.length - 1); i++) {
            if (scoreItems[i + 1].innerHTML.localeCompare(scoreItems[i].innerHTML) === -1) {
              scoresList.insertBefore(scoreItems[i + 1], scoreItems[i]);
              switched = true;
            }
          }
        } while (switched)
    },

    /* SCORES */
    selectScore: function(event) {
      var element                           = table.getListElement(event);
      table.resetListItem("scoresList", element.id);
        /* Clear the milonga audio control */
        var scoreAudioControl               = document.getElementById("scoreAudioControl");
        scoreAudioControl.src               = "";
        scoreAudioControl.pause();
    },

        /* PLAYER: Called when double-clicking on score*/
    playScore: function(event) {
        /* Select score item */
        var element                         = table.getListElement(event);
        /* Proceed */
        var thisScoreNode                   = this.rootNode.querySelector("[id='" + element.id + "']");
        var thisAlbumNode                   = thisScoreNode.parentNode;
        var thisArtistNode                  = thisAlbumNode.parentNode;
        var src                             = top.currentHTTP;
        src                                += (this.currentStyle === "Cortina")? this.cortinasPath: this.tangosPath;
        src                                += thisArtistNode.attributes[attributes.artiste].nodeValue + "/";
        src                                += thisAlbumNode.attributes[attributes.album].nodeValue    + "/"; 
        src                                += thisScoreNode.attributes[attributes.titre].nodeValue    + ".mp3";
        var audio                           = document.getElementById("scoreAudioControl");
        audio.src                           = src;
        audio.load();
        audio.play();  
      },
};

/* -\\- */