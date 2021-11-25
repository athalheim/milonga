var scores = {
    selectStyle: function(event) {
      event.currentTarget.style.display = "none";
      if (event.target.nodeName === "P") this.listArtists(event.target.innerHTML);
    },
    listArtists: function(tangoStyle, artistId) {
      document.getElementById("tangoStyle").innerHTML     = tangoStyle;
      document.getElementById("artistsList").innerHTML    = "";
      [...utils.xmlDoc.querySelectorAll("artist")].filter(a => a.querySelectorAll("[style='" + document.getElementById("tangoStyle").innerHTML + "']").length > 0).forEach(artistNode => {
        document.getElementById("artistsList").innerHTML += "<li id='" + artistNode.id + "' draggable='true'>" + artistNode.attributes.name.nodeValue + "</li>";
      });
      if (artistId) this.selectArtist(artistId);
    },
    selectFromArtistsList: function(event) {
      if (utils.isPlayVisible()) utils.resetAudioControl();
           if (event.target.id.startsWith("TA") || event.target.id.startsWith("CO")) { this.selectScore(event.target.id);  }
      else if (event.target.id.startsWith("AR"))                                     { this.selectArtist(event.target.id); }
      else                                                                           { this.resetArtist();                 }
    },
    selectArtist: function(thisArtistId) {
      this.resetArtist();
      var thisArtistListItem                = document.getElementById(thisArtistId);
      thisArtistListItem.innerHTML          = "<strong>" + thisArtistListItem.innerHTML + "</strong>";
      utils.getArtist(thisArtistId).querySelectorAll("[style='" + document.getElementById("tangoStyle").innerHTML + "']").forEach(thisScoreNode => {
        thisArtistListItem.innerHTML       += "<p id='" + thisScoreNode.id + "' draggable='true'>"+ utils.buildScoreText(thisScoreNode)+ "</p>";
      });
      thisArtistListItem.classList.add("artist");
    },
    resetArtist: function() {
      document.querySelectorAll(".artist").forEach( e => e.innerHTML = e.firstElementChild.innerHTML);
      document.querySelectorAll(".artist").forEach( e => e.classList.remove("artist"));
    },
    selectScore: function(thisScoreId) {
      document.querySelectorAll(".score").forEach( e => e.classList.remove("score"));
      document.getElementById(thisScoreId).classList.add("score");
      if (utils.isPlayVisible()) utils.loadScore(thisScoreId);
    },
};

/* -\\- */
