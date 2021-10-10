var milonga = {

    tandaPrefix:                              "tanda_",
    emptyScore:                               "(Score)",
    emptyScoreId:                             "TA0000",
    scorePrefix:                              "score_",

    defaultCortinaId:                         "CO0000",
    cortinaPrefix:                            "cortina_",

    selectedTandaId:                          null,

    /* CLEAR MILONGA */
    clearMilonga: function() {
        if (document.getElementById("milongaList").innerHTML === "") {
            alert("Can't clear at this time: milonga is empty!");
        } else {
            if (confirm("Confirm to clear the milonga!") === true) {
                document.getElementById("milongaList").innerHTML = "";
            }
        }
    },


  /* LOAD MILONGA */
  /* Public function: called from input element */
  /* Expected format: html fragment */
    loadMilonga: function() {
        if (document.getElementById("milongaStopButton").style.visibility === "visible") {
            alert("Disabled until milonga has stopped playing!");
        } else {
            var fileInput                   = document.getElementById("loadMilongaInput");
            var targetFile                  = fileInput.files[0];
            document.getElementById("loadMilongaInput").value = "";
            var newFileReader               = new FileReader();
            newFileReader.value             = "";
            newFileReader.onloadend         = function(event) {
                document.getElementById("milongaList").outerHTML = event.target.result;
            };
            newFileReader.readAsText(targetFile);
        }
    },


    /* ************************************************************** */
    /* SAVE MILONGA */

    /* Output format: html fragment */
    saveMilonga: function() {
        if (document.getElementById("milongaList").innerHTML === "") {
            alert("Can't save at this time: milonga is empty!");
        } else {
            var milongaName                     = prompt("Enter milonga title", "myMilonga");
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
                anchorElement.href              = "data:text/html," + milongaList.outerHTML;
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
        if (selectedTanda.id.startsWith(milonga.tandaPrefix)) {
            if (this.isTandaSelectable(selectedTanda)) {
                milonga.selectedTandaId     = table.resetListItem("milongaList", selectedTanda.id);
                collection.processStyle(selectedTanda.attributes[attributes.dataStyle].nodeValue);
                collection.selectArtistById(selectedTanda.attributes[attributes.artistId].nodeValue);
            } else {
                alert("Tanda is not selectable!");
            }
        }

    },

    /* Tanda won't be selectable when played or playing */
    isTandaSelectable: function(thisTanda) {
        if (thisTanda.style) {
            if (thisTanda.style.backgroundColor) {
                return (thisTanda.style.backgroundColor !== milongaPlayer.playedTandaColor);
            }
        }
        return true;
    }

};

/* -\\- */