var dp = {
    dragFromScores:               function(event) {
        event.target.id.startsWith("AR")? scores.selectArtist(event.target.id): scores.selectScore(event.target.id);
        event.dataTransfer.setData("text", event.target.id);
    },
    dragFromTandas:               function(event) {
             if (event.target.id === "tandasList")           { event.preventDefault(); }
        else if (utils.elementPlayingOrPlayed(event.target)) { event.preventDefault(); utils.displayPlayMessage(event.target.id); }
        else if (!event.target.id.startsWith("cortina_"))    { event.dataTransfer.setData("text", event.target.id); }
    },

    dropToTandas:                 function(event) {
        event.preventDefault();
        var sourceId                        = event.dataTransfer.getData("text");
        var sourceElement                   = document.getElementById(sourceId);
        var targetElement                   = event.target.closest("[id]");
        var targetId                        = targetElement.id;
             if (utils.elementPlayingOrPlayed(targetElement))                         { utils.displayPlayMessage(targetId); }
        else if (sourceId === targetId)                                               { alert(messages.getMessage("sourceTargetSame")); }
        else if (sourceId.startsWith("AR")     && (targetId ===        "tandasList")) { this.addTanda(sourceId, null); }
        else if (sourceId.startsWith("AR")     &&  targetId.startsWith("tanda_"))     { this.addTanda(sourceId, null, targetId); }

        else if (sourceId.startsWith("TA")     && (targetId ===        "tandasList")) { this.addTanda(utils.getArtistId(sourceId), sourceId); }
        else if (sourceId.startsWith("TA")     &&  targetId.startsWith("tanda_"))     { this.addTanda(utils.getArtistId(sourceId), sourceId, targetId); }
        else if (sourceId.startsWith("TA")     &&  targetId.startsWith("score_"))     { this.updateTandaSameArtistCheck(sourceId, targetElement); }

        else if (sourceId.startsWith("CO")     &&  targetId.startsWith("cortina_"))   { this.updateTandaScore(sourceId, targetElement); }

        else if (sourceId.startsWith("tanda_") && (targetId ===        "tandasList")) { sourceElement.remove(); }
        else if (sourceId.startsWith("tanda_") &&  targetId.startsWith("tanda_"))     { this.moveElement(sourceElement,targetElement); }

        else if (sourceId.startsWith("score_") && (targetId ===        "tandasList")) { sourceElement.attributes.idref.nodeValue = ""; sourceElement.innerHTML = "-----"; }
        else if (sourceId.startsWith("score_") &&  targetId.startsWith("score_"))     { (sourceElement.parentElement === targetElement.parentElement)? this.moveElement(sourceElement,targetElement): alert(messages.getMessage("noMoveToOtherTanda")); }
        
        else                                                                          { alert(messages.getMessage("invalidMove")); }
        utils.setTandaControls();
    },
    moveElement:                  function(source, target) {
        var elements                        = [... source.parentElement.children];
        var elementsFromSource              = elements.slice(elements.indexOf(source));
        target.parentElement.insertBefore(source, (elementsFromSource.indexOf(target) === -1)? target: target.nextElementSibling);
    },
    addTanda:                     function(thisArtistId, thisScoreId, referenceTandaId) {
        utils.cleanTandas();
        var ticks                           = new Date().getTime();
        var listContent                     = "<li id='tanda_" + ticks + "' draggable='true' className='tanda' idref='" + thisArtistId + "'>";
        listContent                        +=   "<strong>" + document.getElementById("styleTitle").innerHTML + "</strong>: " + utils.getArtist(thisArtistId).attributes.name.nodeValue;
        for(i=0; i<5; i++) {   listContent +=   "<p id='score_"   + ticks + "_" + i + "' draggable='true' idref=''>-----</p>"; };
        listContent                        +=   "<p id='cortina_" + ticks           + "' draggable='true' idref='CO0000'>" + utils.buildScoreText(utils.getDocNode("CO0000"), true) + "</p>";
        listContent                        += "</li>";
        document.getElementById("tandasList").innerHTML += listContent;
        if (referenceTandaId) document.getElementById("tandasList").insertBefore(document.getElementById("tanda_" + ticks), document.getElementById(referenceTandaId));
        if (thisScoreId)      this.updateTandaSameArtistCheck(thisScoreId, document.getElementById("tanda_" + ticks).querySelector("p"));
    },
    updateTandaSameArtistCheck:   function(sourceId, tandaScore) {
        if ((utils.getArtistId(sourceId) === tandaScore.parentElement.attributes.idref.nodeValue) || confirm(messages.getMessage("confirmDifferentArtist"))) { this.updateTandaScore(sourceId, tandaScore); } 
    },
    updateTandaScore:             function(sourceId, tandaScore) {
        utils.cleanTandas();
        tandaScore.attributes.idref.nodeValue = sourceId;
        tandaScore.innerHTML                = utils.buildScoreText(utils.getDocNode(sourceId));
        if (utils.getArtistId(sourceId) !== tandaScore.parentElement.attributes.idref.nodeValue) tandaScore.innerHTML += " :" + utils.getArtist(sourceId).attributes.name.nodeValue;
        tandaScore.className                = "tandaScore";
        if (!utils.elementPlayingOrPlayed(tandaScore.parentElement)) tandaScore.parentElement.className = "tanda";
    },
};

/* -\\- */
