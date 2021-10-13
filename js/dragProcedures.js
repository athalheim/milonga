var dp = {

    /* START DRAG: Used with artist list item */
    dragArtist: function(ev) {
        table.resetListItem("artistsList", ev.target.id);
        ev.dataTransfer.setData("text", ev.target.id);
    },


    /* ALLOW: Used with 'Milonga' header */
    allowDropToMilonga: function(ev) {
        ev.preventDefault();
    },


    /* DROP: Used with 'Milonga' header */
    /*  Artist: Add new tanda */
    /*  Tanda:  Remove selected tanda*/
    dropToMilonga: function(ev) {
        ev.preventDefault();
        var thisTandaId                     = ev.dataTransfer.getData("text");
        if (thisTandaId.startsWith(collection.artistIdPrefix)) {
            this.addTanda(thisTandaId);
        } else if (thisTandaId.startsWith(milonga.tandaPrefix)) {
            var thisTanda                   = document.getElementById(thisTandaId);
            if (milonga.isTandaSelectable(thisTanda)) {
                if (milonga.selectedTandaId === thisTandaId) {
                    milonga.selectedTandaId     = null;
                }
                milongaList.removeChild(thisTanda);
            } else {
                alert(messages.getMessage("dp_noRemove"));
            }
        }
    },


    addTanda: function(thisArtistId) {
        /* Get artist tag, then artist name */
        var thisArtistNode                   = collection.xmlDoc.querySelector("[id='" + thisArtistId + "']");
        /* Build new tanda as html string*/
        var ticks                           = new Date().getTime();
        var newTandaId                      = milonga.tandaPrefix + ticks;
        /* Open tanda item */
        var listContent                     = "<li id='" + newTandaId + "' ";
        listContent                        += attributes.artistId + "='" + thisArtistId + "' ";
        listContent                        += attributes.dataStyle + "='" + collection.currentStyle + "' ";
        listContent                        += " draggable='true' >";
        listContent                        += collection.listArtistText(thisArtistNode, true);
        /* Build tanda score list*/
        listContent                        += "<ul style='margin-left:25px' ondragstart='dp.dragScore(event)'>";
        /* Add five(5) score tags */
        for (var i = 0; i < 5; i++) {
            listContent                    += "<li id='" + milonga.scoreIdPrefix + ticks + i + "' ";
            listContent                    += attributes.idRef + "='" + milonga.emptyScoreId + "' ";
            listContent                    += "draggable='true' >";
            listContent                    += milonga.emptyScore;
            listContent                    += "</li>";
        }
        /* Add cortina tag */
        var thisScoreNode                   = collection.xmlDoc.querySelector("[id='" + milonga.defaultCortinaId + "']");
        listContent                        += "<li id='" + milonga.cortinaIdPrefix + ticks + "' ";
        listContent                        += attributes.idRef + "='" + milonga.defaultCortinaId + "' ";
        listContent                        += "style='margin-left:25px'>";
        listContent                        += collection.buildScoreText(thisScoreNode);
        listContent                        += "</li>";
        /* Close score list */
        listContent                        += "</ul>";
        /* Close tanda item */
        listContent                        += "</li>";
        /* Append new tanda */
        document.getElementById("milongaList").innerHTML              += listContent;
        /* Highlight and bring into view */
        milonga.selectedTandaId             = table.resetListItem("milongaList", newTandaId);
    },


    /* *********************************************************************** */
    /* RE-ORDERING TANDAS  */
    /* -Move tanda to another location (dropping on another tanda)*/
    /* -Source tanda is always inserted BEFORE target tanda: dropping any tanda on the last tanda has no effect */
    /* NOTE: dropping a tanda on the 'Milonga' header removes it fromt he list (See above) */

    /* START DRAG: Used with tanda list item */
    dragTanda: function(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    },


    /* ALLOW: Used with tanda list item */
    allowDropToTanda: function(ev) {
        ev.preventDefault();
    },


    /* DROP: Used with tanda list item */
    /* Three possible sources: */
    /*  -tanda:            possible action: move tanda */
    /*  -tanda score:      possible action: move score inside same tanda */
    /*  -collection score: possible action: update score/cortina */
    dropToTanda: function(ev) {
        ev.preventDefault();
        /* Get source and target ids */
        var sourceId                        = ev.dataTransfer.getData("text");
        var targetId                        = ev.target.id;
        /* Branch accordingly to source */
        if (sourceId.startsWith(milonga.tandaPrefix)) {
            this.moveTanda(sourceId, targetId);
        } else if (sourceId.startsWith(milonga.scoreIdPrefix)) {
            this.moveTandaScore(sourceId, targetId);
        } else if (sourceId.startsWith(collection.tangoIdPrefix) && targetId.startsWith(milonga.scoreIdPrefix)) {
            /* Update tanda score with collection score */
            this.updateTandaWithScore(sourceId, ev.target);
        } else if (sourceId.startsWith(collection.cortinaIdPrefix) && targetId.startsWith(milonga.cortinaIdPrefix)) {
            /* Update cortina with cortina score */
            this.updateTandaScoreFromTarget(sourceId, ev.target);
        } else {
            alert(messages.getMessage("dp_unrecognizedMove"));
        }
    },

    moveTanda: function(sourceId, targetId) {
        var sourceTanda                     = document.getElementById(sourceId);
        var targetTanda                     = null;
        if (!milonga.isTandaSelectable(sourceTanda)) {
            alert(messages.getMessage("dp_NoUseSourceTanda"));
            return;
        }
        if (targetId.startsWith(milonga.tandaPrefix)) {
            targetTanda                     = document.getElementById(targetId);
            if (sourceTanda === targetTanda) {
                alert(messages.getMessage("dp_sourceTargetSame"));
                return;
            } else if (!milonga.isTandaSelectable(targetTanda)) {
                alert(messages.getMessage("dp_noUseTargetTanda"));
                return;
            }
        } else {
            alert(messages.getMessage("dp_targetNoTanda"));
            return;
        }
        var milongaList                     = document.getElementById("milongaList");
        milongaList.insertBefore(sourceTanda, targetTanda);
    },

    moveTandaScore: function(sourceId, targetId) {
        var sourceScore                     = document.getElementById(sourceId);
        var sourceTanda                     = sourceScore.parentElement.parentElement;
        if (!milonga.isTandaSelectable(sourceTanda)) {
            alert(messages.getMessage("dp_noUseSourceTanda"));
            return;
        }
        if (targetId.startsWith(milonga.scoreIdPrefix)) {
            var targetScore                 = document.getElementById(targetId);
            var targetTanda                 = targetScore.parentElement.parentElement;
            if (sourceTanda !== targetTanda) {
                alert(messages.getMessage("dp_noMoveToOtherTanda"));
                return;
            }
            var targetList                  = targetScore.parentElement;
            targetList.insertBefore(sourceScore, targetScore); 
        } else {
            alert(messages.getMessage("dp_targetIsNotScore"));
        }
    },

    updateTandaWithScore: function(sourceId, scoreElement) {
        /* Get artist from collection */
        var scoreNode                       = collection.xmlDoc.querySelector("[id='" + sourceId + "']");
        var scoreArtistNode                 = scoreNode.parentElement.parentElement;
        /*  Get tanda tag */
        var tandaTag                        = scoreElement.parentElement.parentElement;
        /* Check if score and tanda from same artist */
        if (scoreArtistNode.id === tandaTag.attributes[attributes.artistId].nodeValue) {
            /* Update when score and tanda from same artist */
            this.updateTandaScoreFromTarget(sourceId, scoreElement);
        } else if (confirm(messages.getMessage("dp_confirmDifferentArtist"))) {
            /* Update when user overrides */
            this.updateTandaScoreFromTarget(sourceId, scoreElement);
        } else {
            alert(messages.getMessage("dp_scoreNotFromArtist"));
        }
    },

    updateTandaScoreFromTarget: function(sourceId, targetElement) {
        var scoreNode                       = collection.xmlDoc.querySelector("[id='" + sourceId + "']");
        targetElement.attributes[attributes.idRef].nodeValue = sourceId;
        targetElement.innerHTML             = collection.buildScoreText(scoreNode);
    },



    /* *********************************************************************** */
    /* SCORES */

    /* drag: from Collecion 'scores' list */
    dragScore: function(ev) {
        if (ev.target.id.startsWith(collection.tangoIdPrefix) || ev.target.id.startsWith(collection.cortinaIdPrefix)) {
            table.resetListItem("scoresList", ev.target.id);
        }
        ev.dataTransfer.setData("text", ev.target.id);
    },

    /* Score allow: managed by 'allowDropToTanda' */
    /* Score drop:  managed by 'dropToTanda' */

};

/* -\\- */
