var dp = {
    dragFromScores: function(event) {
        event.target.id.startsWith("AR")? scores.selectArtist(event.target.id): scores.selectScore(event.target.id);
        event.dataTransfer.setData("text", event.target.id);
    },
    dropToMilonga: function(event) {
        event.preventDefault();
        var sourceId                        = event.dataTransfer.getData("text");
        var sourceElement                   = document.getElementById(sourceId);
             if (sourceId.startsWith("AR"))                     { this.addTanda(sourceId); }
        else if (sourceId.startsWith("TA"))                     { this.addTanda(utils.getArtistId(sourceId), sourceId); }
        else if (utils.isElementPlayingOrPlayed(sourceElement)) { alert(messages.getMessage("sourcePlayedOrPlaying")); }
        else if (sourceId.startsWith("tanda_"))                 { sourceElement.remove(); }
        else if (sourceId.startsWith("score_"))                 { sourceElement.attributes.idref.nodeValue = ""; sourceElement.innerHTML = "-----"; }

        utils.setTandaControls();
    },
    addTanda: function(thisArtistId, thisScoreId) {
        document.querySelectorAll(".tanda"     ).forEach( e => e.classList.remove("tanda"));
        document.querySelectorAll(".tandaScore").forEach( e => e.classList.remove("tandaScore"));
        var ticks                           = new Date().getTime();
        var newTandaId                      = "tanda_" + ticks;
        var listContent                     = "<li id='" + newTandaId + "' draggable='true' className='tanda' idref='" + thisArtistId + "'>";
        listContent                        +=   "<strong>" + document.getElementById("tangoStyle").innerHTML + "</strong>: " + utils.getArtist(thisArtistId).attributes.name.nodeValue;
        for(i=0;i<5;i++) {     listContent +=   "<p id='score_"   + ticks + "_" + i + "' draggable='true' idref=''>-----</p>"; };
        listContent                        +=   "<p id='cortina_" + ticks           + "' draggable='true' idref='CO0000'>" + utils.buildScoreText(utils.getDocNode("CO0000"), true) + "</p>";
        listContent                        += "</li>";
        document.getElementById("tandasList").innerHTML += listContent;
        if (thisScoreId) this.updateTandaSameArtistCheck(thisScoreId, document.getElementById(newTandaId).querySelector("p"));
    },
    dragFromTanda: function(event) {
        var sourceElement                   = event.target.id? event.target: event.target.parentElement;
             if (utils.isElementPlayingOrPlayed(sourceElement)) { event.preventDefault(); alert(messages.getMessage("sourcePlayedOrPlaying")); }
        else if (sourceElement.id.startsWith("cortina_"))       { event.preventDefault(); }
        else                                                    { event.dataTransfer.setData("text", sourceElement.id); }
    },
    dropToTanda: function(event) {
        event.preventDefault();
        var targetElement                   = event.target.id? event.target: event.target.parentElement;
        var targetId                        = targetElement.id;
        var sourceId                        = event.dataTransfer.getData("text");
        var sourceElement                   = document.getElementById(sourceId);
             if (utils.isElementPlayingOrPlayed(targetElement))                    { alert(messages.getMessage("targetPlayedOrPlaying")); }
        else if (sourceId === targetId)                                            { alert(messages.getMessage("sourceTargetSame")); }
        else if (targetId.startsWith("tanda_")   && sourceId.startsWith("tanda_")) { targetElement.parentElement.insertBefore(sourceElement, targetElement); }
        else if (targetId.startsWith("score_")   && sourceId.startsWith("score_")) { (sourceElement.parentElement === targetElement.parentElement)? targetElement.parentElement.insertBefore(sourceElement, targetElement): alert(messages.getMessage("noMoveToOtherTanda")); }
        else if (targetId.startsWith("score_")   && sourceId.startsWith("TA"))     { this.updateTandaSameArtistCheck(sourceId, targetElement); }
        else if (targetId.startsWith("cortina_") && sourceId.startsWith("CO"))     { this.updateTandaScore(sourceId, targetElement); }
        else                                                                       { alert(messages.getMessage("invalidMove")); }
        utils.setTandaControls();
    },
    updateTandaSameArtistCheck: function(sourceId, scoreElement) {
        if ((utils.getArtistId(sourceId) === scoreElement.parentElement.attributes.idref.nodeValue) || confirm(messages.getMessage("confirmDifferentArtist"))) { this.updateTandaScore(sourceId, scoreElement); } 
    },
    updateTandaScore: function(sourceId, scoreElement) {
        document.querySelectorAll(".tanda").forEach( e => e.classList.remove("tanda"));
        document.querySelectorAll(".tandaScore").forEach( e => e.classList.remove("tandaScore"));
        scoreElement.attributes.idref.nodeValue = sourceId;
        scoreElement.innerHTML              = utils.buildScoreText(utils.getDocNode(sourceId));
        if (utils.getArtistId(scoreElement.attributes.idref.nodeValue) !== scoreElement.parentElement.attributes.idref.nodeValue) scoreElement.innerHTML += " :" + utils.getArtist(sourceId).attributes.name.nodeValue;
        scoreElement.classList.add("tandaScore");
        if (!utils.isElementPlayingOrPlayed(scoreElement.parentElement)) { scoreElement.parentElement.className = "tanda"; }
    },
};

/* -\\- */
