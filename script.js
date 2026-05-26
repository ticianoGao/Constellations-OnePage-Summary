const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    mainNav.classList.toggle("active");

    if (mainNav.classList.contains("active")) {
      menuButton.textContent = "Close";
    } else {
      menuButton.textContent = "Menu";
    }
  });
}

/* Step 1 searchable dropdown */

const customSelect = document.getElementById("districtSelect");
const selectTrigger = document.getElementById("selectTrigger");
const selectedValue = document.getElementById("selectedValue");
const selectSearch = document.getElementById("selectSearch");
const selectOptions = document.querySelectorAll("#selectOptions li");

if (customSelect && selectTrigger && selectedValue && selectSearch && selectOptions.length > 0) {
  selectTrigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");

    if (customSelect.classList.contains("open")) {
      selectSearch.focus();
    }
  });

  selectOptions.forEach(option => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;

      selectedValue.textContent = value;

      selectOptions.forEach(item => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");
      customSelect.classList.remove("open");
      selectSearch.value = "";

      selectOptions.forEach(item => {
        item.classList.remove("hidden");
      });
    });
  });

  selectSearch.addEventListener("input", () => {
    const searchValue = selectSearch.value.toLowerCase();

    selectOptions.forEach(option => {
      const optionText = option.textContent.toLowerCase();

      if (optionText.includes(searchValue)) {
        option.classList.remove("hidden");
      } else {
        option.classList.add("hidden");
      }
    });
  });

  document.addEventListener("click", event => {
    if (!customSelect.contains(event.target)) {
      customSelect.classList.remove("open");
    }
  });
}