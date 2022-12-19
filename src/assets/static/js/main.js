// Language menu toggle
document.getElementById('languages-menu-label').onclick = function(e) {
    e.preventDefault();
    var languagesMenu = document.getElementById("languages");
    languagesMenu.classList.toggle("open");
}