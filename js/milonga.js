var milonga = {
    clearMilonga:             function()      { 
        if (confirm(messages.getMessage("confirmClearMilonga"))) {
            document.getElementById("milongaList").innerHTML = ""; 
            utils.setMilongaControls();
        }
    },
    loadMilonga:              function(event) {
        if (event) event.preventDefault();
        if ((document.querySelectorAll("ul > li").length === 0) || confirm(messages.getMessage("confirmClearMilonga"))) {
            if (event) { utils.loadXhttp("data/sampleMilonga.html", "milonga.setMilonga(this.responseText)"); } 
            else       { document.getElementById('load').click();}
        }
    },
    loadLocalMilonga:         function(input) {
        var reader                          = new FileReader();
        reader.onload                       = function() { milonga.setMilonga(reader.result); };
        reader.readAsText(input.files[0]);
        input.value                         = "";
    },
    setMilonga:               function(milongaList) {
        document.getElementById("milongaList").innerHTML = milongaList; 
        document.querySelectorAll("[idref]").forEach(e => { e.setAttribute("draggable", "true"); if (!utils.getDocNode(e.attributes.idref.nodeValue)) if (!e.querySelector("strike")) {e.innerHTML = "<strike>" + e.innerHTML + "</strike>"}; });
        utils.setMilongaControls();
    },
    saveMilonga:              function()      {
        var milongaName                     = prompt(messages.getMessage("enterMilongaName"), "myMilonga");
        if (milongaName) {
            var exportedMilonga             = document.getElementById("milongaList").cloneNode(true);
            exportedMilonga.querySelectorAll("[idref]").forEach(e => {e.removeAttribute("class"); e.removeAttribute("draggable")});
            var anchorElement               = document.body.appendChild(document.createElement("a"));
            anchorElement.download          = milongaName + ".html";
            anchorElement.href              = "data:text/html," + exportedMilonga.innerHTML;
            try        { anchorElement.click();  }
            catch (ex) {  }
            finally    { anchorElement.remove(); }
        }
    },
    cleanMilonga:             function()      {
        document.querySelectorAll("[idref]").forEach(e => { e.classList.remove("tandaScore"); e.classList.remove("tanda");});
    },
    selectFromMilonga:        function(event) {
        utils.resetAudioControl();
        milonga.cleanMilonga();
        var thisElement                     = event.target.closest("[id]");
        if (thisElement.id === "milongaList")            return;
        if (utils.isElementPlayingOrPlayed(thisElement)) return utils.displayPlayedMessage(thisElement.id);
        var thisTanda                       = thisElement.closest("li");
        /* Expected specs pattern is '<b>[era, ]style</b>'  */
        var tandaSpecs                      = thisTanda.firstElementChild.innerHTML.split(",");
        /* Expected text pattern is '[era, ]style'  */
        if (tandaSpecs.length === 2) {
            scores.listArtists(tandaSpecs[0].trim(), tandaSpecs[1].trim(), thisTanda.attributes.idref.nodeValue);
        } else {
            scores.listArtists(null, tandaSpecs[0].trim(), thisTanda.attributes.idref.nodeValue);
        }
        if (!utils.isElementPlayingOrPlayed(thisTanda)) thisTanda.className = "tanda";
        var thisScore                       = thisElement.closest("p");
        if (thisScore) {
            if (thisScore.id.startsWith("cortina_")) { 
                scores.listArtists(null, "Cortina", utils.getArtistId(thisScore.attributes.idref.nodeValue), thisScore.attributes.idref.nodeValue)
            } else {
                scores.selectScore(thisScore.attributes.idref.nodeValue);
            }
            thisScore.className             = "tandaScore";
        }
    },
};

/* -\\- */
