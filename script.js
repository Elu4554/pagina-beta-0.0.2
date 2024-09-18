function openTab(evt, tabName) {
    var i, tabContent, tabButtons;

    // Ocultar todas las pestañas
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Quitar la clase "active" de todos los botones
    tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    // Mostrar la pestaña seleccionada
    document.getElementById(tabName).style.display = "block";

    // Añadir la clase "active" al botón que abrió la pestaña
    evt.currentTarget.className += " active";
}
