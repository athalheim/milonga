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
        if (thisTandaId.startsWith(collection.artistPrefix)) {
            this.addTanda(thisTandaId);
        } else if (thisTandaId.startsWith(milonga.tandaPrefix)) {
            if (milonga.selectedTandaId === thisTandaId) {
                milonga.selectedTandaId     = null;
            }
            milongaList.removeChild(document.getElementById(thisTandaId));
        }
    },


    addTanda: function(thisArtistId) {
        /* Get artist tag, then artist name */
        var thisArtistTag                   = collection.xmlDoc.querySelector("[id='" + thisArtistId + "']");
        /* Build new tanda as html string*/
        var ticks                           = new Date().getTime();
        var newTandaId                      = milonga.tandaPrefix + ticks;
        /* Open tanda item */
        var listContent                     = "<li id='" + newTandaId + "' ";
        listContent                        += attributes.artisteId + "='" + thisArtistId + "' ";
        listContent                        += attributes.dataStyle + "='" + collection.currentStyle + "' ";
        listContent                        += " draggable='true' >";
        listContent                        += collection.currentStyle + ": " + thisArtistTag.attributes[attributes.artiste].nodeValue + " (" + thisArtistTag.attributes[attributes.époque].nodeValue + ")";
        /* Build tanda score list*/
        listContent                        += "<ul style='margin-left:25px' ondragstart='dp.dragScore(event)'>";
        /* Add five(5) score tags */
        listContent                        += this.buildEmptyScoreListItem(milonga.scorePrefix + ticks + "_0");
        listContent                        += this.buildEmptyScoreListItem(milonga.scorePrefix + ticks + "_1");
        listContent                        += this.buildEmptyScoreListItem(milonga.scorePrefix + ticks + "_2");
        listContent                        += this.buildEmptyScoreListItem(milonga.scorePrefix + ticks + "_3");
        listContent                        += this.buildEmptyScoreListItem(milonga.scorePrefix + ticks + "_4");
        /* Add cortina tag */
        listContent                        += this.buildCortinaListItem(milonga.cortinaPrefix + ticks);
        /* Close score list */
        listContent                        += "</ul>";
        /* Close tanda item */
        listContent                        += "</li>";
        /* Append new tanda */
        document.getElementById("milongaList").innerHTML              += listContent;
        /* Highlight and bring into view */
        milonga.selectedTandaId             = table.resetListItem("milongaList", newTandaId);
    },

    buildEmptyScoreListItem: function(scoreId) {
        var listContent                     = "<li id='" + scoreId + "' ";
        listContent                        += attributes.idRef + "='" + milonga.emptyScoreId + "' ";
        listContent                        += "draggable='true' >";
        listContent                        += milonga.emptyScore;
        listContent                        += "</li>";
        return listContent;
    },

    buildCortinaListItem: function(cortinaId) {
        var thisScoreNode                   = collection.xmlDoc.querySelector("[id='" + milonga.defaultCortinaId + "']");
        var listContent                     = "<li id='" + cortinaId + "' ";
        listContent                        += attributes.idRef + "='" + milonga.defaultCortinaId + "' ";
        listContent                        += "style='margin-left:25px'>";
        listContent                        += collection.buildScoreText(thisScoreNode);
        listContent                        += "</li>";
        return listContent;
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
    /*  -tanda: possible action: move tanda*/
    /*  -tanda score: possible action: move score inside same tanda */
    /*  -collection score: possible action: update score/cortina */
    dropToTanda: function(ev) {
        ev.preventDefault();
        /* Get source and target ids */
        var sourceId                        = ev.dataTransfer.getData("text");
        var targetId                        = ev.target.id;
        /* Branch accordingly to source */
        if (sourceId.startsWith(milonga.tandaPrefix)) {
            this.moveTanda(sourceId, targetId);
        } else if (sourceId.startsWith(milonga.scorePrefix)) {
            this.moveScore(sourceId, targetId);
        } else if (sourceId.startsWith(collection.tangoPrefix) && targetId.startsWith(milonga.scorePrefix)) {
            /* Update tanda score with collection score */
            this.updateScore(sourceId, ev.target);
        } else if (sourceId.startsWith(collection.cortinaPrefix) && targetId.startsWith(milonga.cortinaPrefix)) {
            /* Update cortina with cortina score */
            this.updateListItem(sourceId, ev.target);
        } else {
            alert("Unrecognized move!");
        }
    },

    moveTanda: function(sourceId, targetId) {
        var sourceTanda                     = document.getElementById(sourceId);
        var targetTanda                     = null;
        if (!milonga.isTandaSelectable(sourceTanda)) {
            alert("Can't use source Tanda.");
            return;
        }
        if (targetId.startsWith(milonga.tandaPrefix)) {
            targetTanda                     = document.getElementById(targetId);
            if (sourceTanda === targetTanda) {
                alert("Source and target Tandas are the same!");
                return;
            } else if (!milonga.isTandaSelectable(targetTanda)) {
                alert("Can't use target Tanda.");
                return;
            }
        } else {
            alert("Target is not a Tanda.");
            return;
        }
        var milongaList                     = document.getElementById("milongaList");
        milongaList.insertBefore(sourceTanda, targetTanda);
    },

    moveScore: function(sourceId, targetId) {
        var sourceScore                     = document.getElementById(sourceId);
        var sourceTanda                     = sourceScore.parentElement.parentElement;
        if (!milonga.isTandaSelectable(sourceTanda)) {
            alert("Can't use source Tanda.");
            return;
        }
        if (targetId.startsWith(milonga.scorePrefix)) {
            var targetScore                 = document.getElementById(targetId);
            var targetTanda                 = targetScore.parentElement.parentElement;
            if (sourceTanda !== targetTanda) {
                alert("Can't move score to another tanda!");
                return;
            }
            var targetList                  = targetScore.parentElement;
            targetList.insertBefore(sourceScore, targetScore); 
        } else {
            alert("Target is not a score!");
        }
    },

    updateScore: function(sourceId, scoreElement) {
        var thisScoreNode                   = collection.xmlDoc.querySelector("[id='" + sourceId + "']");
        var thisScoreAlbumNode              = thisScoreNode.parentElement;
        var thisScoreArtistNode             = thisScoreAlbumNode.parentElement;
        var thisScoreArtistId               = thisScoreArtistNode.id;
        /*  Score artist*/
        var scoresListTag                   = scoreElement.parentElement;
        var tandaTag                        = scoresListTag.parentElement;
        var tandaArtisteId                  = tandaTag.attributes[attributes.artisteId].nodeValue;
        /* Check if score is from same artist */
        if (thisScoreArtistId === tandaArtisteId) {
            this.updateListItem(sourceId, scoreElement);
        } else if (confirm("This score's artist is different than the tanda artist!\nAdd anyway?")) {
            this.updateListItem(sourceId, scoreElement);
        } else {
            alert("Selected score does not belong to Tanda artist!");
        }
    },

    updateListItem: function(sourceId, targetElement) {
        var thisScoreNode                   = collection.xmlDoc.querySelector("[id='" + sourceId + "']");
        targetElement.attributes[attributes.idRef].nodeValue = sourceId;
        targetElement.innerHTML             = collection.buildScoreText(thisScoreNode);
    },



    /* *********************************************************************** */
    /* SCORES */

    /* drag: from Collecion 'scores' list */
    dragScore: function(ev) {
        if (ev.target.id.startsWith(collection.tangoPrefix) || ev.target.id.startsWith(collection.cortinaPrefix)) {
            table.resetListItem("scoresList", ev.target.id);
        }
        ev.dataTransfer.setData("text", ev.target.id);
    },

    /* Score allow: managed by 'allowDropToTanda' */
    /* Score drop:  managed by 'dropToTanda' */

};

/* -\\- */