var messages = {
    mainTitle:                { es: "Haga clic en el título para ingresar al modo de pantalla completa",                                en: "Clic title to enter full screen mode",                                      fr: "Cliquer le titre pour activer le mode plein écren"},
    aboutTitle:               { es: "Haga clic para mostrar página de ayuda",                                                           en: "Click to to display Help Page",                                             fr: "Cliquez pour afficher la page d'aide" },
    styleList:                { es: "Seleccionar estilo...",                                                                            en: "Select Style...",                                                           fr: "Sélectionner le style..." },
    milongaTitle:             { es: "Haga clic para seleccionar y cargar milonga / Haga clic derecho para cargar milonga de muestra",   en: "Click to select and load milonga / Right-click to load sample milonga",     fr: "Cliquez pour sélectionner et charger la milonga / Clic droit pour charger l'échantillon de milonga" },
    milongaList:              { es: "Arrastre: Artista-Partitura para iniciar/actualizar Tanda / Tanda-Partitura para mover/eliminar.", en: "Drag: Artist-Score to initiate/update Tanda / Tanda-Score to move/remove.", fr: "Glisser: Artiste-Partition pour initier/metter à jour une Tanda / Tanda-Partition pour la déplacer/supprimer." },
    save:                     { es: "Guardar",                                                                                          en: "Save",                                                                      fr: "Enregistrer" },
    clear:                    { es: "Limpiar",                                                                                          en: "Clear",                                                                     fr: "Effacer" },
    play:                     { es: "Jugar",                                                                                            en: "Play",                                                                      fr: "Jouer" },
    stop:                     { es: "interrumpir",                                                                                      en: "Stop",                                                                      fr: "Arrêter" },
    fadeoutTitle:             { es: "Desvanecerse, cuando suena milonga",                                                               en: "Fadeout, when milonga is playing",                                          fr: "Fondu ,lorsque joue la milonga"},
    invalidMove:              { es: "¡Movimiento inválido!",                                                                            en: "Invalid move!",                                                             fr: "Mouvement invalide!" },
    sourceTargetSame:         { es: "¡La fuente y el destino son lo mismo!",                                                            en: "Source and target are the same!",                                           fr: "La source et la cible sont les mêmes!" },
    noMoveToOtherTanda:       { es: "¡No se puede mover la partitura a otro Tanda!",                                                    en: "Can't move score to another Tanda!",                                        fr: "Impossible de déplacer la pièce vers une autre Tanda!" },
    confirmDifferentArtist:   { es: "¡El artista de esta partitura es diferente al artista de tanda!\n¿Añadir de todos modos?",         en: "This score's artist is different than the tanda artist!\nAdd anyway?",      fr: "L'artiste de cette pièce est différent de l'artiste ce la Tanda!\nAjouter quand même?" },
    confirmClearMilonga:      { es: "¡Confirma para despejar la milonga!",                                                              en: "Confirm to clear the milonga!",                                             fr: "Confirmer l'effacement de la milonga!" },
    enterMilongaName:         { es: "Ingrese el nombre de archivo milonga:",                                                            en: "Enter milonga filename:",                                                   fr: "Entrez le nom du fichier milonga:" },
    confirmStopMilonga:       { es: "¡Confirma para dejar de tocar la milonga!",                                                        en: "Confirm to stop playing the milonga!",                                      fr: "Confirmez pour arrêter la diffusion de la milonga !" },
    scorePlayedOrPlaying:     { es: "¡La partitura está reproduciendo/se ha reproducido!",                                              en: "Score is playing/has played!",                                              fr: "La pièce joue/a joué!" },
    tandaPlayedOrPlaying:     { es: "¡La tanda está reproduciendo/se ha reproducido!",                                                  en: "Tanda is playing/has played!",                                              fr: "La tanda joue/a joué!" },

    language:                 "en",
    setLanguage:              function() {
        var navLanguage                     = (window.navigator.userLanguage || window.navigator.language).split("-")[0];
        this.language                       = messages[Object.keys(messages)[0]][navLanguage]? navLanguage: "en";
        document.querySelectorAll("[id]").forEach(e => {
            if (this[e.id]) {
                ((e.id.indexOf("Title") > -1) || (e.id.indexOf("List") > -1))? e.title = this[e.id][this.language]: e.innerHTML = this[e.id][this.language];
            }
        });        
    },
    getMessage:               function(messageId) { return this[messageId][this.language]; }
};

/* -\\- */
