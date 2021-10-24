var table = {

          /* Get list element from click event */
    getListElement: function(event) {
        return (event.target || event.srcElement); 
    },


          /* Highlight/Unhighlight selected list item */
    resetListItem: function(listElementId, elementId) {
        /* Clear all highlights */
        var listElement                     = document.getElementById(listElementId);
        var listItems                       = listElement.getElementsByTagName("li");
        for (var i = 0; i < listItems.length; i += 1) {
          listItems[i].classList.remove('red');
        }
        if (elementId) {
            /* Highlight newly selected item */
            var selectedElement             = listElement.querySelector("#" + elementId);
            if (selectedElement) {
                selectedElement.classList.add('red');
                var selectedRectangle       = selectedElement.getBoundingClientRect();
                var listRectangle           = listElement.getBoundingClientRect();
                var relativeTop             = (selectedRectangle.top    - listRectangle.top);
                var relativeBottom          = (selectedRectangle.bottom - listRectangle.bottom);
                if (relativeTop < 0) {
                    listElement.scrollTop  += relativeTop;
                } else if (relativeBottom > 0) {
                    listElement.scrollTop  += relativeBottom;
                }
            } else {
                return;
            }
        }
        return elementId;
    },

    displayReadMe: function(ev) {
        if (confirm(messages.getMessage("ta_loadHelpFile")) === true) {
            window.open("ReadMe.html");
        }
        ev.preventDefault();
    },

    resetAudioControl: function(controlId, visibilityState) { 
        var audioControl                    = document.getElementById(controlId);
        audioControl.src                    = "";
        audioControl.removeAttribute("src");
        audioControl.pause();
        audioControl.style.visibility       = visibilityState? visibilityState: "visible";
    },
};

/* -\\- */
