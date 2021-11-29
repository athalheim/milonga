var milonga = {
    clearMilonga: function() {
        if (confirm(messages.getMessage("confirmClearMilonga")) === true) return this.setMilonga("");
    },
    loadMilonga: function(event) {
        if (event) event.preventDefault();
        if ((document.querySelectorAll("ul > li").length === 0) || this.clearMilonga()) {
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
        document.querySelectorAll("[idref]").forEach(e => {
            e.setAttribute("draggable", "true"); 
            if (!utils.isDocNode(e.attributes.idref.nodeValue)) if (!e.querySelector("strike")) {e.innerHTML = "<strike>" + e.innerHTML + "</strike>"};
        });
        utils.setTandaControls();
    },
    saveMilonga: function() {
        var milongaName                     = prompt(messages.getMessage("enterMilongaName"), "myMilonga");
        if (milongaName) {
            var exportedMilonga             = document.getElementById("tandasList").cloneNode(true);
            exportedMilonga.querySelectorAll("[idref]").forEach(e => {e.removeAttribute("class"); e.removeAttribute("draggable")});
            var anchorElement               = document.body.appendChild(document.createElement("a"));
            anchorElement.download          = milongaName + ".html";
            anchorElement.href              = "data:text/html," + exportedMilonga.innerHTML;
            try        { anchorElement.click();  }
            catch (ex) {  }
            finally    { anchorElement.remove(); }
        }
    },
    selectTanda: function(event) {
        if (utils.playVisible())              utils.resetAudioControl();
        utils.cleanTandas();
        var selectedElement                 = event.target.closest("[id]");
        if (selectedElement.id === "tandasList")           return;
        if (utils.elementPlayingOrPlayed(selectedElement)) return utils.displayPlayMessage(selectedElement.id);
        var selectedTanda                   = selectedElement.closest("li");
        var selectedScore                   = selectedElement.closest("p");
        this.styleArtistScoreSelect(selectedTanda, selectedScore);
        if (!utils.elementPlayingOrPlayed(selectedTanda)) { selectedTanda.className = "tanda"; }
        if (selectedScore) {
            selectedScore.className         = "tandaScore";
            if (utils.playVisible())          utils.loadScore(selectedScore.attributes.idref.nodeValue);
        }
    },
    styleArtistScoreSelect: function(selectedTanda, selectedScore) {
        scores.listArtists(selectedTanda.firstElementChild.innerHTML, selectedTanda.attributes.idref.nodeValue);
        if (selectedScore) {
            if (selectedScore.id.startsWith("co")) scores.listArtists("Cortina", utils.getArtistId(selectedScore.attributes.idref.nodeValue));
            scores.selectScore(selectedScore.id);
        }
    },
};

/* -\\- */
