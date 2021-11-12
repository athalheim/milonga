var dp = {

    /* 1. SCORES: drag:*/
    /*  - Artist: to 'Tandas' title: */
    /*  - Score:  to tanda scores: */
    dragFromScores: function(ev) {
        if (ev.target.id.startsWith("AR"))     scores.selectArtist(ev.target);
        ev.dataTransfer.setData("text", ev.target.id);
    },

    /* 2. MILONGA */
    /* 'Tandas' header: allow drop:      */
    /*   From Scores:                    */
    /*    Artist:  Add new tanda         */
    /*    Score:   Not processed         */
    /*   From Tandas:                    */
    /*    Tanda:   Remove selected tanda */
    /*    Score:   Remove selected score */
    /*    Cortina: Not processed         */
    allowDropToMilonga: function(ev) {
        ev.preventDefault();
    },

    dropToMilonga: function(ev) {
        ev.preventDefault();
        var thisDroppedId                   = ev.dataTransfer.getData("text");
        if (thisDroppedId.startsWith("AR")) {
            /* Initiate empty tanda (skip cortinas)*/
            if (scores.currentStyle === "Cortina") {
                alert(messages.getMessage("dp_noCortinaToMilonga"));
            } else {
                this.addTanda(thisDroppedId);
            }
        } else if (thisDroppedId.startsWith("TA")) {
            /* Initiate tanda with first score (skip cortinas)*/
            if (scores.currentStyle === "Cortina") {
                alert(messages.getMessage("dp_noCortinaToMilonga"));
            } else {
                var thisScoreNode               = utils.xmlDoc.querySelector("[id='" + thisDroppedId + "']");
                var thisArtistNode              = thisScoreNode.parentNode.parentNode;
                this.addTanda(thisArtistNode.id);
                var thisTanda                   = document.getElementById(milonga.selectedTandaId);
                var thisTandaFirstScore         = thisTanda.getElementsByTagName("li")[0];
                this.updateTandaWithScore(thisDroppedId, thisTandaFirstScore);
            }
        } else if (thisDroppedId.startsWith("CO")) {
            /* No cortina */
            alert(messages.getMessage("dp_noCortinaToMilonga"));
        } else if (utils.isElementPlayingOrPlayed(thisDroppedId)) {
            /* No remove when played/playing */
            alert(messages.getMessage("mp_elementPlayedOrPlaying"));
        } else if (thisDroppedId.startsWith("tanda_")) {
            var thisTanda                   = document.getElementById(thisDroppedId);
            if (milonga.selectedTandaId === thisDroppedId) {
                milonga.selectedTandaId = null;
            }
            thisTanda.parentElement.removeChild(thisTanda);
        } else if (thisDroppedId.startsWith("sc_")) {
            /* Remove score from tanda */
            var thisScore                   = document.getElementById(thisDroppedId);
            thisScore.attributes["idref"].nodeValue = "TA0000";
            thisScore.innerHTML             = "(Score)";
        }
    },

    addTanda: function(thisArtistId) {
        /* Get artist tag, then artist name */
        var thisArtistNode                  = utils.xmlDoc.querySelector("[id='" + thisArtistId + "']");
        /* Build new tanda as html string*/
        var ticks                           = new Date().getTime();
        var newTandaId                      = "tanda_" + ticks;
        var listContent                     = "<li id='" + newTandaId + "' artistId='" + thisArtistId + "' data-style='" + scores.currentStyle + "' draggable='true'>";
        listContent                        +=   utils.buildArtistText(thisArtistNode, true);
        listContent                        +=   "<ol style='margin-left:25px'>";
        for (var i = 0; i < 5; i++) {
            listContent                    +=     "<li id='sc_" + ticks + "_" + i + "' idref='TA0000' draggable='true'>(Score)</li>";
        }
        var thisScoreNode                   = utils.xmlDoc.querySelector("[id='" + "CO0000"+ "']");
        listContent                        +=     "<li id='co_" + ticks + "' idref='CO0000' style='margin-left:25px'>";
        listContent                        +=       utils.buildScoreText(thisScoreNode, true);
        listContent                        +=     "</li>";
        listContent                        +=   "</ol>";
        listContent                        += "</li>";
        document.getElementById("tandasList").innerHTML  += listContent;
        milonga.selectedTandaId             = newTandaId;
    },

    /* 3. TANDAS */
    /* Drag from tandas: */
    /*  - Tanda: */
    /*   -- to 'Tandas' title:       remove tanda */
    /*   -- to other tanda location: move tanda to this location */
    /*  - Score: */
    /*   -- to 'Tandas' title:       remove score */
    /*   -- to other score location within same tanda: move score to this location */
  
    dragFromTanda: function(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    },

    /* DROP: Used with tanda list item */
    /* Three possible sources: */
    /*  -Score:       update score/cortina */
    /*  -Tanda:       move tanda */
    /*  -Tanda score: move score inside SAME tanda */
    allowDropToTanda: function(ev) {
        ev.preventDefault();
    },

    dropToTanda: function(ev) {
        ev.preventDefault();
        var targetId                        = ev.target.id;
        var sourceId                        = ev.dataTransfer.getData("text");
        if (utils.isElementPlayingOrPlayed(sourceId)) {
            alert(messages.getMessage("mp_sourcePlaying"));
        } else if (sourceId.startsWith("tanda_")) {
            this.moveTanda(sourceId, targetId);
        } else if (sourceId.startsWith("sc_")) {
            this.moveTandaScore(sourceId, targetId);
        } else if (targetId.startsWith("tanda_")) {
            alert(messages.getMessage("dp_targetIsNotScore"));
        } else if (utils.isElementPlayingOrPlayed(targetId)) {
            alert(messages.getMessage("mp_elementPlayedOrPlaying"));
        } else if (sourceId.startsWith("TA") && targetId.startsWith("sc_")) {
            this.updateTandaWithScore(sourceId, ev.target);
        } else if (sourceId.startsWith("CO") && targetId.startsWith("co_")) {
            this.updateTandaScoreFromTarget(sourceId, ev.target);
        } else {
            alert(messages.getMessage("dp_invalidMove"));
        }
    },

    moveTanda: function(sourceId, targetId) {
        if (targetId.startsWith("tanda_")) {
            if (sourceId === targetId) {
                alert(messages.getMessage("dp_sourceTargetSame"));                
            } else {
                var sourceTanda                 = document.getElementById(sourceId);
                var targetTanda                 = document.getElementById(targetId);
                targetTanda.parentElement.insertBefore(sourceTanda, targetTanda);
            }
        } else {
           alert(messages.getMessage("dp_targetNoTanda"));
        }
    },

    moveTandaScore: function(sourceId, targetId) {
        if (targetId.startsWith("sc_")) {
            var sourceScore                 = document.getElementById(sourceId);
            var targetScore                 = document.getElementById(targetId);
            if (sourceScore.parentElement === targetScore.parentElement) {
                targetScore.parentElement.insertBefore(sourceScore, targetScore); 
            } else {
                alert(messages.getMessage("dp_noMoveToOtherTanda"));
            }    
        } else {
            alert(messages.getMessage("dp_targetIsNotScore"));
        }
    },

    updateTandaWithScore: function(sourceId, scoreElement) {
        var scoreNode                       = utils.xmlDoc.querySelector("[id='" + sourceId + "']");
        var scoreArtistNode                 = scoreNode.parentNode.parentNode;
        var tandaTag                        = scoreElement.parentElement.parentElement;
        if (scoreArtistNode.id === tandaTag.attributes["artistId"].nodeValue) {
            this.updateTandaScoreFromTarget(sourceId, scoreElement);
        } else if (confirm(messages.getMessage("dp_confirmDifferentArtist"))) {
            this.updateTandaScoreFromTarget(sourceId, scoreElement);
        }
    },

    updateTandaScoreFromTarget: function(sourceId, targetElement) {
        targetElement.attributes["idref"].nodeValue = sourceId;
        var scoreNode                       = utils.xmlDoc.querySelector("[id='" + sourceId + "']");
        targetElement.innerHTML             = utils.buildScoreText(scoreNode, sourceId.startsWith("CO"));
    },

};

/* -\\- */
