var milonga = {
    clearMilonga: function() {
        if (confirm(messages.getMessage("confirmClearMilonga")) === true) {
            document.getElementById("tandasList").innerHTML = "";
            utils.setTandaControls();
            return true;
        }
    },
    loadMilonga: function(event) {
        if (event) event.preventDefault();
        if ((document.getElementById("tandasList").innerHTML === "") || this.clearMilonga()) {
            event? utils.loadXhttp("data/sampleMilonga.html", "milonga.setMilonga(this.responseText)"): document.getElementById('load').click();
        }
    },
    loadLocalMilonga: function(input) {
        var reader                          = new FileReader();
        reader.onload                       = function() { milonga.setMilonga(reader.result); };
        reader.readAsText(input.files[0]);
        input.value                         = "";
    },
    setMilonga: function(tandasList) {
        document.getElementById("tandasList").innerHTML = tandasList; 
        document.getElementById("tandasList").querySelectorAll("*").forEach( e => e.setAttribute("draggable", "true"));
        utils.setTandaControls();
    },
    saveMilonga: function() {
        var milongaName                     = prompt(messages.getMessage("enterMilongaName"), "myMilonga");
        if (milongaName) {
            var exportedMilonga             = document.getElementById("tandasList").cloneNode(true);
            exportedMilonga.querySelectorAll("*"     ).forEach( e => e.removeAttribute("class"));
            exportedMilonga.querySelectorAll("*"     ).forEach( e => e.removeAttribute("draggable"));
            var anchorElement               = document.body.appendChild(document.createElement("a"));
            anchorElement.download          = milongaName + ".html";
            anchorElement.href              = "data:text/html," + exportedMilonga.innerHTML;
            try        { anchorElement.click();  }
            catch (ex) {  }
            finally    { anchorElement.remove(); }
        }
    },
    selectTanda: function(event) {
        if (utils.isPlayVisible()) utils.resetAudioControl();
        document.querySelectorAll(".tanda"     ).forEach( e => e.classList.remove("tanda"));
        document.querySelectorAll(".tandaScore").forEach( e => e.classList.remove("tandaScore"));
        var selectedElement                 = event.target.closest("[id]");
        if (selectedElement.id === "tandasList")             return;
        if (utils.isElementPlayingOrPlayed(selectedElement)) return alert(messages.getMessage(selectedElement.id.startsWith("tanda_")? "targetPlayedOrPlaying": "sourcePlayedOrPlaying"));
        var selectedTanda                   = selectedElement.id.startsWith("tanda_")? selectedElement: selectedElement.parentElement;
        var selectedScore                   = selectedElement.id.startsWith("tanda_")? null: ((selectedElement.attributes.idref.nodeValue !== "")? selectedElement: null);
        var idref                           = selectedScore? selectedScore.attributes.idref.nodeValue: null;
        this.styleArtistScoreSelect(selectedTanda, idref);
        if (!utils.isElementPlayingOrPlayed(selectedTanda)) { selectedTanda.className = "tanda"; }
        if (selectedScore) {
            selectedScore.className = "tandaScore";
            if (utils.isPlayVisible()) utils.loadScore(idref);
        }
    },
    styleArtistScoreSelect: function(selectedTanda, scoreId) {
        scores.listArtists(selectedTanda.firstElementChild.innerHTML, selectedTanda.attributes.idref.nodeValue);
        if (scoreId) {
            if (scoreId.startsWith("CO")) scores.listArtists("Cortina", utils.getArtistId(scoreId));
            scores.selectScore(scoreId);
        }
    },
};

/* -\\- */
