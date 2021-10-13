var messages = {

    /* HTML Collection messages */
    co_selectedStyle: {
        es: "El estilo seleccionado es ",
        en: "Selected style is ",
        fr: "Le style sélectionné est ",
    },
    co_artists: {
        es: "Artistas",
        en: "Artists",
        fr: "Artistes",
    },
    co_albums: {
        es: "Álbumes",
        en: "Albums",
        fr: "Albums",
    },
    co_scores: {
        es: "Partituras",
        en: "Scores",
        fr: "Pièces",
    },

    /* HTML Milonga messages */
    mi_save: {
        es: "Guardar",
        en: "Save",
        fr: "Enregistrer",
    },
    mi_clear: {
        es: "Limpiar",
        en: "Clear",
        fr: "Effacer",
    },
    mi_play: {
        es: "Jugar Milonga",
        en: "Play Milonga",
        fr: "Jouer la Milonga",
    },
    mi_stop: {
        es: "Detener milonga",
        en: "Stop Milonga",
        fr: "Arrêter la milonga",
    },

   /* Drag Procedures Messages */
    dp_noRemove: {
        es: "¡No se puede eliminar este Tanda en este momento!",
        en: "Can't remove this Tanda at this time!",
        fr: "Impossible de retirer cette Tanda pour le moment!",
    },
    dp_unrecognizedMove: {
        es: "¡Movimiento no reconocido!",
        en: "Unrecognized move!",
        fr: "Mouvement non reconnu !",
    },
    dp_NoUseSourceTanda: {
        es: "¡No se puede usar el objetivo Tanda!",
        en: "Can't use source Tanda!",
        fr: "Impossible d'utiliser la Tanda source!",
    },
    dp_noUseTargetTanda: {
        es: "¡No se puede usar el objetivo Tanda!",
        en: "Can't use target Tanda!",
        fr: "Impossible d'utiliser la Tanda cible!",
    },
    dp_sourceTargetSame: {
        es: "¡Las Tandas de orige!",
        en: "Source and target Tandas are the same!",
        fr: "Les Tandas source et cible sont les mêmes!",
    },
     dp_targetNoTanda: {
        es: "¡El objetivo no es un Tanda.Target no es un Tanda!",
        en: "Target is not a Tanda!",
        fr: "La cible n'est pas une Tanda!",
    },
    dp_noMoveToOtherTanda: {
        es: "¡No se puede mover la partitura a otro Tanda!",
        en: "Can't move score to another Tanda!",
        fr: "Impossible de déplacer la pièce vers une autre Tanda!",
    },
    dp_targetIsNotScore: {
        es: "¡El objetivo no es una partitura musical!",
        en: "Target is not a score!",
        fr: "La cible n'est pas une pièce!",
    },
    dp_confirmDifferentArtist: {
        es: "¡El artista de esta partitura es diferente al artista de tanda!\n¿Añadir de todos modos?",
        en: "This score's artist is different than the tanda artist!\nAdd anyway?",
        fr: "L'artiste de cette pièce est différent de l'artiste ce la Tanda!\nAjouter quand même?",
    },
    dp_scoreNotFromArtist: {
        es: "¡La partitura seleccionada no pertenece al artista Tanda!",
        en: "Selected score does not belong to Tanda artist!",
        fr: "La pièce sélectionnée n'appartient pas à l'artiste de cette Tanda!",
    },

    /* Milonga Messages */
    mi_noClear: {
        es: "No se puede borrar en este momento: ¡La milonga está vacía!",
        en: "Can't clear at this time: Milonga is empty!",
        fr: "Impossible d'effacer pour le moment : La milonga est vide!",
    },
    mi_confirmClearMilonga: {
        es: "¡Confirma para despejar la milonga!",
        en: "Confirm to clear the milonga!",
        fr: "Confirmer l'effacement de la milonga!",
    },
    mi_loadSampleMilonga: {
        es: "¿Cargar milonga de muestra?",
        en: "Load sample milonga?",
        fr: "Charger l'exemple de Milonga?",
    },
    mi_disabledUntilPlayStopped: {
        es: "¡Inhabilitada hasta que la milonga haya dejado de jugar!",
        en: "Disabled until milonga has stopped playing!",
        fr: "Désactivé jusqu'à ce que l'arrêt de la milonga!",
    },
    mi_noSaveEmptyMilonga: {
        es: "No se puede guardar en este momento: ¡la milonga está vacía!",
        en: "Can't save at this time: milonga is empty!",
        fr: "Impossible d'enregistrer pour le moment : la milonga est vide!",
    },
    mi_enterMilongaTitle: {
        es: "Ingrese el nombre de archivo milonga:",
        en: "Enter milonga filename:",
        fr: "Entrez le nom du fichier milonga:",
    },
    mi_tandaNoSelect: {
        es: "¡Tanda no se puede seleccionar!",
        en: "Tanda is not selectable!",
        fr: "Tanda n'est pas sélectionnable!",
    },
    
    /* Milonga Player messages */
    mp_noPlayEmptyMilonga: {
        es: "No se puede jugar en este momento: ¡La milonga está vacía!",
        en: "Can't play at this time: Milonga is empty!",
        fr: "Impossible de jouer pour le moment : La milonga est vide!",
    },
    mp_ConfirmStopMilonga: {
        es: "¡Confirma para dejar de tocar la milonga!",
        en: "Confirm to stop playing the milonga!",
        fr: "Confirmez pour arrêter la diffusion de la milonga !",
    },

    /* Table messages */
    ta_loadHelpFile: {
        es: "¿Mostrar página de ayuda?",
        en: "Display Help Page?",
        fr: "Afficher la page d'aide?",
    },

    /* Error message */
    errorMessage: {
        es: "¡Error! No hay mensaje para '",
        en: "Error! No message for':",
        fr: "Erreur! Aucun message pour ':",
    },

    /* LANGUAGE */
    language: "en",

    getLanguage: function() {
        var appLanguage                     = window.navigator.userLanguage || window.navigator.language;
        this.language                       = appLanguage.split("-")[0];
    },

    getMessage: function(messageId) {
        var thisMessage                     = this[messageId];
        if (thisMessage) {
            if (thisMessage[this.language]) {
                return thisMessage[this.language];
            } else {
                return thisMessage.en;
            }
        } else {
            return ("Error! No message for':" + messageId + "'.");
        }
    }
};

messages.getLanguage();

/* -\\- */
