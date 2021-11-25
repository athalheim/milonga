var messages = {
    loadHelpFileTitle: {
        es: "Haga clic para mostrar página de ayuda",
        en: "Click to display Help Page",
        fr: "Cliquez pour afficher la page d'aide",
    },
    scores: {
        es: "Partituras",
        en: "Scores",
        fr: "Pièces",
    },
    artists: {
        es: "Artistas",
        en: "Artists",
        fr: "Artistes",
    },
    tangoStyleTitle: {
        es: "Seleccionar tango estilo... ",
        en: "Select tango style... ",
        fr: "Sélection du style de tango... ",
    },
    milongaTitle: {
        es: "Haga clic para seleccionar y cargar milonga - o - Haga clic derecho para cargar milonga de muestra",
        en: "Click to select and load milonga - or - Right-click to load sample milonga",
        fr: "Cliquez pour sélectionner et charger la milonga - ou - Clic droit pour charger l'échantillon de milonga"
    },
    tandasTitle: {
        es: "Arrastre Artista/Partitura aquí para iniciar Tanda -o- Arrastre Tanda/Partitura aquí para eliminar.",
        en: "Drag Artist/Score here to initiate Tanda -or- Drag Tanda/Score here to remove.",
        fr: "Glisser l'artiste/la partition ici pour initiae une Tanda -ou- Glisser la Tanda/la partition ici pour la supprimer."
    },
    save: {
        es: "Guardar",
        en: "Save",
        fr: "Enregistrer",
    },
    clear: {
        es: "Limpiar",
        en: "Clear",
        fr: "Effacer",
    },
    play: {
        es: "Jugar",
        en: "Play",
        fr: "Jouer",
    },
    stop: {
        es: "Detener",
        en: "Stop",
        fr: "Arrêter",
    },
    invalidMove: {
        es: "¡Movimiento inválido!",
        en: "Invalid move!",
        fr: "Mouvement invalide!",
    },
    sourceTargetSame: {
        es: "¡La fuente y el destino son lo mismo!",
        en: "Source and target are the same!",
        fr: "La source et la cible sont les mêmes!",
    },
    noMoveToOtherTanda: {
        es: "¡No se puede mover la partitura a otro Tanda!",
        en: "Can't move score to another Tanda!",
        fr: "Impossible de déplacer la pièce vers une autre Tanda!",
    },
    confirmDifferentArtist: {
        es: "¡El artista de esta partitura es diferente al artista de tanda!\n¿Añadir de todos modos?",
        en: "This score's artist is different than the tanda artist!\nAdd anyway?",
        fr: "L'artiste de cette pièce est différent de l'artiste ce la Tanda!\nAjouter quand même?",
    },
    confirmClearMilonga: {
        es: "¡Confirma para despejar la milonga!",
        en: "Confirm to clear the milonga!",
        fr: "Confirmer l'effacement de la milonga!",
    },
    disabledUntilPlayStopped: {
        es: "¡Inhabilitada hasta que la milonga haya dejado de jugar!",
        en: "Disabled until milonga has stopped playing!",
        fr: "Désactivé jusqu'à ce que l'arrêt de la milonga!",
    },
    enterMilongaName: {
        es: "Ingrese el nombre de archivo milonga:",
        en: "Enter milonga filename:",
        fr: "Entrez le nom du fichier milonga:",
    },
    confirmStopMilonga: {
        es: "¡Confirma para dejar de tocar la milonga!",
        en: "Confirm to stop playing the milonga!",
        fr: "Confirmez pour arrêter la diffusion de la milonga !",
    },
    sourcePlayedOrPlaying: {
        es: "¡El elemento fuente se ha reproducido o se está reproduciendo!",
        en: "Source element has played or is playing!",
        fr: "L'élément source a joué ou joue/a joué!",
    },
    targetPlayedOrPlaying: {
        es: "¡El elemento objetivo ha jugado o está jugando!",
        en: "Target element has played or is playing!",
        fr: "L'élément cible a joué ou joue/a joué!",
    },

    language: "en",
    getLanguage: function() {
        var navLanguage                     = (window.navigator.userLanguage || window.navigator.language).split("-")[0];
        this.language                       = messages.artists[navLanguage]? navLanguage: "en";
    },
    getMessage: function(messageId) { return this[messageId][this.language]; }
};

/* -\\- */
