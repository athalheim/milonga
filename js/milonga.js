var milonga = {

    selectedTandaId:                        null,
    selectedTandaScoreId:                   null,

    setMilongaLanguage: function() {
        document.getElementById("milonga").title = messages.getMessage("milonga");
        document.getElementById("tandas" ).title = messages.getMessage("tandas" );
        document.getElementById("save"   ).value = messages.getMessage("save"   );
        document.getElementById("clear"  ).value = messages.getMessage("clear"  );
        document.getElementById("play"   ).value = messages.getMessage("play"   );
        document.getElementById("stop"   ).value = messages.getMessage("stop"   );
    },

    /* CLEAR MILONGA */
    clearMilonga: function() {
        if (document.getElementById("tandasList").innerHTML === "") {
            alert(messages.getMessage("noClear"));
        } else if (confirm(messages.getMessage("confirmClearMilonga")) === true) {
            document.getElementById("tandasList").innerHTML = "";
        }
    },

    /* LOAD MILONGA */
    loadSampleMilonga: function(ev) {
        ev.preventDefault();
        if (confirm(messages.getMessage("loadSampleMilonga")) === true) {
            var xhttp                       = new XMLHttpRequest();
            xhttp.onreadystatechange        = function() {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("tandasList").innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", "data/sampleMilonga.html", true);
            xhttp.send();
        }
    },

  /* Public function: called from input element */
  /* Expected format: html fragment */
    loadMilonga: function(event) {
        if (document.getElementById("stop").style.visibility === "visible") {
            alert(messages.getMessage("disabledUntilPlayStopped"));
        } else {
            var input                       = event.target;
            var reader                      = new FileReader();
            reader.onload                   = function() {
                document.getElementById("tandasList").innerHTML = reader.result;
            };
            reader.readAsText(input.files[0]);
            input.value                     = "";
        }
    },


    /* ************************************************************** */
    /* SAVE MILONGA */

    /* Output format: html fragment */
    saveMilonga: function() {
        if (document.getElementById("tandasList").innerHTML === "") {
            alert(messages.getMessage("noSaveEmptyMilonga"));
        } else {
            var milongaName                 = prompt(messages.getMessage("enterMilongaTitle"), "myMilonga");
            if (milongaName) {
                var tandasList           = document.getElementById("tandasList").cloneNode(true);
                tandasList.querySelectorAll("li").forEach( e => e.style.backgroundColor = "");
                var anchorElement           = document.body.appendChild(document.createElement("a"));
                anchorElement.download      = milongaName + ".html";
                anchorElement.href          = "data:text/html," + tandasList.innerHTML;
                anchorElement.click();
                delete anchorElement;
            }
        }
    },

    removeTandaClass: function(selectedItem) {
        var selectedListItems                 = selectedItem.querySelectorAll("li");
        for (var i = 0; i <selectedListItems.length; i++) {
          selectedListItems[i].classList.remove("tanda");
        }
    },

    selectTanda: function(event) {
        if (this.selectedTandaScoreId) {
            document.getElementById(this.selectedTandaScoreId).classList.remove("tandaScore");
        }
        if (this.selectedTandaId) {
            document.getElementById(this.selectedTandaId).classList.remove("tanda");
        }

        this.selectedTandaScoreId           = null;
        this.selectedTandaId                = null;
        var selectedTanda                   = null;
        var selectedElement                 = utils.getListElement(event);
        if (selectedElement.id === "tandasList") {
            return;
        }

        selectedTanda                       = selectedElement;
        if (!selectedElement.id.startsWith("tanda_")) {
            this.selectedTandaScoreId       = selectedElement.id;
            selectedTanda                   = selectedElement.parentElement.parentElement;
        }

        if (utils.isElementPlayingOrPlayed(selectedTanda.id)) {
            this.selectedTandaScoreId       = null;
            alert(messages.getMessage("tandaNoSelect"));
        } else {
            this.selectedTandaId            = selectedTanda.id;
            selectedTanda.classList.add("tanda");
            scores.processStyle(selectedTanda.attributes["data-style"].nodeValue);
            var artistListItem              = document.getElementById(selectedTanda.attributes["artistId"].nodeValue);
            scores.selectArtist(artistListItem);
            if (this.selectedTandaScoreId !== null) {
                var thisTandaScore          = document.getElementById(this.selectedTandaScoreId);
                thisTandaScore.classList.add("tandaScore");
                if (this.selectedTandaScoreId.startsWith("co_")) {
                    scores.processStyle("Cortina");
                }
                if (document.getElementById("stop").style.visibility === "hidden") {
                    utils.loadScore(thisTandaScore.attributes["idref"].nodeValue);
                }
            }
        }
    },

};

/* -\\- */
