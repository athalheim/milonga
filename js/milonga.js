var milonga = {

    tandaIdPrefix:                            "tanda_",
    selectedTandaId:                          null,

    emptyScoreTitle:                          "(Score)",
    emptyScoreIdRef:                          "TA0000",
    scoreIdPrefix:                            "score_",

    defaultCortinaIdRef:                      "CO0000",
    cortinaIdPrefix:                          "cortina_",


    setMilongaLanguage: function() {
        document.getElementById("mi_save").value  = messages.getMessage("mi_save");
        document.getElementById("mi_clear").value = messages.getMessage("mi_clear");
        document.getElementById("mi_play").value  = messages.getMessage("mi_play");
        document.getElementById("mi_stop").value  = messages.getMessage("mi_stop");
    },

    /* CLEAR MILONGA */
    clearMilonga: function() {
        if (document.getElementById("milongaList").innerHTML === "") {
            alert(messages.getMessage("mi_noClear"));
        } else if (confirm(messages.getMessage("mi_confirmClearMilonga")) === true) {
            document.getElementById("milongaList").innerHTML = "";
        }
    },


    /* LOAD MILONGA */
    loadSampleMilonga: function(ev) {
        ev.preventDefault();
        if (confirm(messages.getMessage("mi_loadSampleMilonga")) === true) {
            var xhttp                           = new XMLHttpRequest();
            xhttp.onreadystatechange            = function() {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("milongaList").innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", "data/sampleMilonga.html", true);
            xhttp.send();
        }
    },

  /* Public function: called from input element */
  /* Expected format: html fragment */
    loadMilonga: function() {
        if (document.getElementById("milongaStopButton").style.visibility === "visible") {
            alert(messages.getMessage("mi_disabledUntilPlayStopped"));
        } else {
            var fileInput                   = document.getElementById("mi_load");
            fileInput.value                 = "";
            var targetFile                  = fileInput.files[0];
            var newFileReader               = new FileReader();
            newFileReader.value             = "";
            newFileReader.onloadend         = function(event) {
                document.getElementById("milongaList").innerHTML = event.target.result;
            };
            newFileReader.readAsText(targetFile);
        }
    },



    /* ************************************************************** */
    /* SAVE MILONGA */

    /* Output format: html fragment */
    saveMilonga: function() {
        if (document.getElementById("milongaList").innerHTML === "") {
            alert(messages.getMessage("mi_noSaveEmptyMilonga"));
        } else {
            var milongaName                     = prompt(messages.getMessage("mi_enterMilongaTitle"), "myMilonga");
            if (milongaName) {
                /* Clone milonga list */
                var milongaList                 = document.getElementById("milongaList").cloneNode(true);
                /* Remove any highlight from clone */
                var listItems                   = milongaList.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i += 1) {
                    listItems[i].style.backgroundColor = "";
                }
                /* Export clone */
                var anchorElement               = document.body.appendChild(document.createElement("a"));
                anchorElement.download          = milongaName + ".html";
                anchorElement.href              = "data:text/html," + milongaList.innerHTML;
                anchorElement.click();
                delete anchorElement;
            }
        }
    },


    /* ************************************************************** */
    /* SELECT TANDA  */
    /*  This will update the 'Collection' frame with style and artist */
    selectTanda: function(event) {
        var selectedTanda                   = table.getListElement(event);
        /* Make sure the selected element is a tanda */
        if (selectedTanda.id.startsWith(milonga.tandaIdPrefix)) {
            if (this.isTandaSelectable(selectedTanda)) {
                if (milonga.selectedTandaId) {
                    document.getElementById(milonga.selectedTandaId).classList.remove('red');
                }
                milonga.selectedTandaId     = selectedTanda.id;
                selectedTanda.classList.add('red');
                scores.processStyle(selectedTanda.attributes[attributes.dataStyle].nodeValue);
                scores.selectArtistById(selectedTanda.attributes[attributes.artistId].nodeValue);
            } else {
                alert(messages.getMessage(messages.mi_tandaNoSelect));
            }
        }

    },

    /* Tanda won't be selectable when played or playing */
    isTandaSelectable: function(thisTanda) {
        if (thisTanda.style) {
            if (thisTanda.style.backgroundColor) {
                return ((thisTanda.style.backgroundColor !== milongaPlayer.playedColor) && (thisTanda.style.backgroundColor !== milongaPlayer.playingColor));
            }
        }
        return true;
    }

};

/* -\\- */
