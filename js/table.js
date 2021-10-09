var table = {

          /* Get list element from click event */
    getListElement: function(event) {
        return (event.target || event.srcElement); 
    },


          /* Highlight/Unhighlight selected list item */
    resetListItem: function(listElementId, elementId) {
        var listElement                     = document.getElementById(listElementId);
        var listItems                       = listElement.getElementsByTagName("li");
        for (var i = 0; i < listItems.length; i += 1) {
          listItems[i].style.backgroundColor = "";
        }
        if (elementId) {
            /* Highlight newly selected item */
            var selectedElement             = listElement.querySelector("#" + elementId);
            if (selectedElement) {
                selectedElement.style.backgroundColor = "red";
                var selectedRectangle       = selectedElement.getBoundingClientRect();
                var listElementRectangle    = listElement.getBoundingClientRect();
                var relativeTop             = (selectedRectangle.top    - listElementRectangle.top);
                var relativeBottom          = (selectedRectangle.bottom - listElementRectangle.bottom);
                if (relativeTop < 0) {
                    listElement.scrollTop  += relativeTop;
                } else if (relativeBottom < 0) {
                    listElement.scrollTop  += relativeBottom;
                }
            } else {
                return;
            }
        }
        return elementId;
    },

};

/* -\\- */
