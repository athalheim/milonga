var dp = {
    dragFromScores:               function(event) {
        if (scores.selectedScores.length > 1) {
            event.dataTransfer.setData("text", scores.selectedScores.join(","));
        } else {
            scores.selectFromPartituras(event);
            event.dataTransfer.setData("text", event.target.id);
        }
    },
    dragFromMilonga:              function(event) {
             if (utils.isElementPlayingOrPlayed(event.target)) { event.preventDefault(); utils.displayPlayedMessage(event.target.id); }
        else if (!event.target.id.startsWith("cortina_"))      { event.dataTransfer.setData("text", event.target.id); }
    },
    dropToMilonga:                function(event) {
        event.preventDefault();
        var sourceId                        = event.dataTransfer.getData("text");
        var sourceElement                   = document.getElementById(sourceId);
        var targetElement                   = event.target.closest("[id]");
        var targetId                        = targetElement.id;
             if (utils.isElementPlayingOrPlayed(targetElement))                        { utils.displayPlayedMessage(targetId); }
        else if (sourceId === targetId)                                                { alert(messages.getMessage("sourceTargetSame")); }
        else if (sourceId.startsWith("AR")     && (targetId ===        "milongaList")) { this.addTanda(sourceId,                    null); }
        else if (sourceId.startsWith("AR")     &&  targetId.startsWith("tanda_"))      { this.addTanda(sourceId,                    null, targetId); }
        else if (sourceId.startsWith("TA")     && (targetId ===        "milongaList")) { this.addTanda(utils.getArtistId(sourceId), sourceId); }
        else if (sourceId.startsWith("TA")     &&  targetId.startsWith("tanda_"))      { this.addTanda(utils.getArtistId(sourceId), sourceId, targetId); }
        else if (sourceId.startsWith("TA")     &&  targetId.startsWith("score_"))      { this.updateTandaSameArtistCheck(targetElement, sourceId); }
        else if (sourceId.startsWith("CO")     &&  targetId.startsWith("cortina_"))    { this.updateTandaScore(targetElement, sourceId, true); }
        else if (sourceId.startsWith("tanda_") && (targetId ===        "milongaList")) { sourceElement.remove(); }
        else if (sourceId.startsWith("tanda_") &&  targetId.startsWith("tanda_"))      { this.moveElement(sourceElement, targetElement); }
        else if (sourceId.startsWith("score_") && (targetId ===        "milongaList")) { sourceElement.attributes.idref.nodeValue = ""; sourceElement.innerHTML = "-----"; }
        else if (sourceId.startsWith("score_") &&  targetId.startsWith("score_"))      { (sourceElement.parentElement === targetElement.parentElement)? this.moveElement(sourceElement,targetElement): alert(messages.getMessage("noMoveToOtherTanda")); }
        else                                                                           { alert(messages.getMessage("invalidMove")); }
        utils.setMilongaControls();
    },
    moveElement:                  function(source, target) {
        var elements                        = [... source.parentElement.children];
        var elementsFromSource              = elements.slice(elements.indexOf(source));
        target.parentElement.insertBefore(source, (elementsFromSource.indexOf(target) === -1)? target: target.nextElementSibling);
    },
    addTanda:                     function(artistId, scoreId, referenceTandaId) {
        milonga.cleanMilonga();
        var ticks                           = new Date().getTime();
        var listContent                     = "<li id='tanda_" + ticks + "' draggable='true' className='tanda' idref='" + artistId + "'>";
        listContent                        +=   "<strong>" + document.getElementById("styleList").value + "</strong>: " + utils.buildArtistText(artistId);
        for(i=0; i<5; i++) {   listContent +=   "<p id='score_"   + ticks + "_" + i + "' draggable='true' idref=''>-----</p>"; };
        listContent                        +=   "<p id='cortina_" + ticks           + "' draggable='true' idref='CO0000'>" + utils.buildScoreText(utils.getDocNode("CO0000"), true) + "</p>";
        listContent                        += "</li>";
        document.getElementById("milongaList").innerHTML += listContent;
        if (scoreId)          scoreId.split(",").slice(0, 5).forEach(function (scoreId, i) { dp.updateTandaScore(document.getElementById("tanda_" + ticks).querySelectorAll("p")[i], scoreId); });
        if (referenceTandaId) document.getElementById("milongaList").insertBefore(document.getElementById("tanda_" + ticks), document.getElementById(referenceTandaId));
    },
    updateTandaSameArtistCheck:   function(tandaScore, scoreId) {
             if (tandaScore.parentElement.attributes.idref.nodeValue === utils.getArtistId(scoreId)) { this.updateTandaScore(tandaScore, scoreId); } 
        else if (confirm(messages.getMessage("confirmDifferentArtist")))                             { this.updateTandaScore(tandaScore, scoreId, true);}
    },
    updateTandaScore:             function(tandaScore, scoreId, addArtist) {
        milonga.cleanMilonga();
        tandaScore.attributes.idref.nodeValue = scoreId;
        tandaScore.innerHTML                = utils.buildScoreText(utils.getDocNode(scoreId), addArtist);
        tandaScore.className                = "tandaScore";
        if (!utils.isElementPlayingOrPlayed(tandaScore.parentElement)) tandaScore.parentElement.className = "tanda";
    },
};

/* -\\- */
