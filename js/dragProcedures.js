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
        if (thisTandaId.startsWith(scores.artistIdPrefix)) {
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
        var thisArtistNode                  = scores.xmlDoc.querySelector("[id='" + thisArtistId + "']");
        /* Build new tanda as html string*/
        var ticks                           = new Date().getTime();
        var newTandaId                      = milonga.tandaPrefix + ticks;
        /* Open tanda item */
        var listContent                     = "<li";
        listContent                        += this.addAttribute("id",                 newTandaId);
        listContent                        += this.addAttribute(attributes.artistId,  thisArtistId);
        listContent                        += this.addAttribute(attributes.dataStyle, scores.currentStyle);
        listContent                        += this.addAttribute("draggable",          "true");
        listContent                        += ">";
        listContent                        += scores.listArtistText(thisArtistNode, true);
        /* Build tanda score list*/
        listContent                        += "<ol style='margin-left:25px' ondragstart='dp.dragScore(event)'>";
        /* Add five(5) score tags */
        for (var i = 0; i < 5; i++) {
            listContent                    += "<li";
            listContent                    += this.addAttribute("id",                 milonga.scoreIdPrefix + ticks + i);
            listContent                    += this.addAttribute(attributes.idRef,     milonga.emptyScoreIdRef);
            listContent                    += this.addAttribute("draggable",          "true");
            listContent                    += ">";
            listContent                    += milonga.emptyScoreTitle;
            listContent                    += "</li>";
        }
        /* Add cortina tag */
        var thisScoreNode                   = scores.xmlDoc.querySelector("[id='" + milonga.defaultCortinaIdRef + "']");
        listContent                        += "<li";
        listContent                        += this.addAttribute("id",                 milonga.cortinaIdPrefix + ticks + i);
        listContent                        += this.addAttribute(attributes.idRef,     milonga.defaultCortinaIdRef);
        listContent                        += this.addAttribute("style",              "margin-left:25px");
        listContent                        += ">";
        listContent                        += scores.buildScoreText(thisScoreNode);
        listContent                        += "</li>";
        /* Close score list */
        listContent                        += "</ol>";
        /* Close tanda item */
        listContent                        += "</li>";
        /* Append new tanda */
        document.getElementById("milongaList").innerHTML              += listContent;
        /* Highlight and bring into view */
        milonga.selectedTandaId             = table.resetListItem("milongaList", newTandaId);
    },

    addAttribute: function (attributeName, attributevalue) {
        return (" " + attributeName + "='" + attributevalue + "'");
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
        /* Skip target when playing/played */
        var targetId                        = ev.target.id;
        if (this.isElementPlaying(targetId)) {
            alert(messages.getMessage("mp_targetPlaying"));
            return;
        }
        var sourceId                        = ev.dataTransfer.getData("text");
        /* Branch accordingly to source */
        if (sourceId.startsWith(milonga.tandaPrefix)) {
            /* Skip source when playing/played */
            if (this.isElementPlaying(sourceId)) {
                alert(messages.getMessage("mp_sourcePlaying"));
            } else {
                this.moveTanda(sourceId, targetId);
            }    
        } else if (sourceId.startsWith(milonga.scoreIdPrefix)) {
            /* Skip source when playing/played */
            if (this.isElementPlaying(sourceId)) {
                alert(messages.getMessage("mp_sourcePlaying"));
            } else {
                this.moveTandaScore(sourceId, targetId);
            }
        } else if (sourceId.startsWith(scores.tangoIdPrefix) && targetId.startsWith(milonga.scoreIdPrefix)) {
            /* Update tanda score with collection score */
            this.updateTandaWithScore(sourceId, ev.target);
        } else if (sourceId.startsWith(scores.cortinaIdPrefix) && targetId.startsWith(milonga.cortinaIdPrefix)) {
            /* Update cortina with cortina score */
            this.updateTandaScoreFromTarget(sourceId, ev.target);
        } else {
            alert(messages.getMessage("dp_unrecognizedMove"));
        }
    },

    isElementPlaying: function(elementId) {
        var element                         = document.getElementById(elementId);
        if (element.style) {
            if (element.style.backgroundColor) {
                return ((element.style.backgroundColor === milongaPlayer.playingColor) || (element.style.backgroundColor === milongaPlayer.playedColor));
            }
        }
        return false;
    },


    moveTanda: function(sourceId, targetId) {
        if (sourceId === targetId) {
            alert(messages.getMessage("dp_sourceTargetSame"));
            return;
        } else if (targetId.startsWith(milonga.tandaPrefix)) {
            var sourceTanda                 = document.getElementById(sourceId);
            var targetTanda                 = document.getElementById(targetId);
            targetTanda.parentElement.insertBefore(sourceTanda, targetTanda);
        } else  {
           alert(messages.getMessage("dp_targetNoTanda"));
        }
    },

    moveTandaScore: function(sourceId, targetId) {
        if (targetId.startsWith(milonga.scoreIdPrefix)) {
            var sourceScore                 = document.getElementById(sourceId);
            var sourceList                  = sourceScore.parentElement;
            var targetScore                 = document.getElementById(targetId);
            var targetList                  = targetScore.parentElement;
            if (sourceList === targetList) {
                targetList.insertBefore(sourceScore, targetScore); 
            } else {
                alert(messages.getMessage("dp_noMoveToOtherTanda"));
            }    
        } else {
            alert(messages.getMessage("dp_targetIsNotScore"));
        }
    },

    updateTandaWithScore: function(sourceId, scoreElement) {
        var scoreNode                       = scores.xmlDoc.querySelector("[id='" + sourceId + "']");
        var scoreArtistNode                 = scoreNode.parentElement.parentElement;
        var tandaTag                        = scoreElement.parentElement.parentElement;
        /* Check if score and tanda from same artist */
        if (scoreArtistNode.id === tandaTag.attributes[attributes.artistId].nodeValue) {
            /* Update when score and tanda from same artist */
            this.updateTandaScoreFromTarget(sourceId, scoreElement);
        } else if (confirm(messages.getMessage("dp_confirmDifferentArtist"))) {
            /* Update when user overrides */
            this.updateTandaScoreFromTarget(sourceId, scoreElement);
        }
    },

    updateTandaScoreFromTarget: function(sourceId, targetElement) {
        var scoreNode                       = scores.xmlDoc.querySelector("[id='" + sourceId + "']");
        targetElement.attributes[attributes.idRef].nodeValue = sourceId;
        targetElement.innerHTML             = scores.buildScoreText(scoreNode);
    },



    /* *********************************************************************** */
    /* SCORES */

    /* drag: from Collecion 'scores' list */
    dragScore: function(ev) {
        if (ev.target.id.startsWith(scores.tangoIdPrefix) || ev.target.id.startsWith(scores.cortinaIdPrefix)) {
            table.resetListItem("scoresList", ev.target.id);
        }
        ev.dataTransfer.setData("text", ev.target.id);
    },

    /* Score allow: managed by 'allowDropToTanda' */
    /* Score drop:  managed by 'dropToTanda' */

};

/* -\\- */
