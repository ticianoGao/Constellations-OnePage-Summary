const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

menuButton.addEventListener("click", () => {
  mainNav.classList.toggle("active");

  if (mainNav.classList.contains("active")) {
    menuButton.textContent = "Close";
  } else {
    menuButton.textContent = "Menu";
  }
});