var collection = {

    xmlDoc:                                 null,
    rootNode:                               null,
    cortinasNode:                           null,
    singersNode:                            null,

    tangosPath:                             "tangos/",
    tangoIdPrefix:                            "TA",

    cortinasPath:                           "cortinas/",
    cortinaIdPrefix:                        "CO",

    artistIdPrefix:                         "AR",

    currentStyle:                           "",
    scoreByStyleQuery:                      "",


    /* INITIALIZE DATABASE */
    loadDoc: function() {
        var xhttp                           = new XMLHttpRequest();
        xhttp.onreadystatechange            = function() {
          if (this.readyState == 4 && this.status == 200) {
            collection.xmlDoc               = this.responseXML;
            collection.singersNode          = collection.xmlDoc.querySelector("singers");
            collection.cortinasNode         = collection.xmlDoc.querySelector("cortinas");
            collection.processStyle("Tango");
          }
        };
        xhttp.open("GET", "data/tangos.xml", true);
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
          this.scoreByStyleQuery            = "score";
        } else {
          this.rootNode                     = this.xmlDoc.querySelector("tangos");
          this.scoreByStyleQuery            = "score[style='" + thisStyle + "']";
        }
        this.listArtists();
    },
  
  
    /* *********************************************************************** */
    /* COLLECTION CELL */

    /* ARTISTS */
    /* List artists */
    listArtists: function() {
        var listContent                     = "";
        var artistNodes                     = this.rootNode.getElementsByTagName("artist");
        for (var i = 0; i < artistNodes.length; i++) { 
          var artistNode                    = artistNodes[i];
          var scoreCount                    = artistNode.querySelectorAll(this.scoreByStyleQuery).length;
          if (scoreCount > 0) {
            listContent                    += "<li id='" + artistNode.id + "' draggable='true'>";
            listContent                    += this.listArtistText(artistNode);
            listContent                    += "</li>";
          }
        }
        /* Update Artist List */
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
        var element                         = table.getListElement(event);
        this.selectArtistById(element.id);
    },

    selectArtistById: function(_thisArtistId) {
        table.resetListItem("artistsList", _thisArtistId);
        /* Select artist tag */
        var thisArtistNode                  = this.rootNode.querySelector("artist[id='" + _thisArtistId +"']");
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
        /* Update Album List */
        document.getElementById("albumsList").innerHTML = listContent;
        this.sortList("albumsList");
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
        var thisSingerId                  = thisScoreNode.attributes[attributes.singerId].nodeValue;
        var thisSingerNode                = this.singersNode.querySelector("[id='" + thisSingerId + "']");
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
        src                                += thisArtistNode.attributes[attributes.name].nodeValue + "/";
        src                                += thisAlbumNode.attributes[attributes.name].nodeValue    + "/"; 
        if (thisScoreNode.attributes[attributes.filename]) {
          src                              += thisScoreNode.attributes[attributes.filename].nodeValue + ".mp3";
        } else {
          src                              += thisScoreNode.attributes[attributes.title].nodeValue    + ".mp3";
        }
        var audio                           = document.getElementById("scoreAudioControl");
        audio.src                           = src;
        audio.load();
        audio.play();  
      },

};

/* -\\- */