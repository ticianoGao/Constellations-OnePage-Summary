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

const schoolGrid = document.getElementById("schoolGrid");
const districtGrid = document.getElementById("districtGrid");
const customSelect = document.getElementById("districtSelect");
const selectTrigger = document.getElementById("selectTrigger");
const selectedValue = document.getElementById("selectedValue");
const selectSearch = document.getElementById("selectSearch");
const selectOptions = document.querySelectorAll("#selectOptions li");

if (
  customSelect &&
  selectTrigger &&
  selectedValue &&
  selectSearch &&
  selectOptions.length > 0
) {
  selectTrigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");

    if (customSelect.classList.contains("open")) {
      selectSearch.focus();
    }
  });

  selectOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      const type = option.dataset.type;

      if (schoolGrid) {
        schoolGrid.classList.remove("show");
      }

      if (districtGrid) {
        districtGrid.classList.remove("show");
      }

      if ((type === "school" || type === "state") && schoolGrid) {
        schoolGrid.classList.add("show");
      }

      if (type === "district" && districtGrid) {
        districtGrid.classList.add("show");
      }

      selectedValue.textContent = value;

      selectOptions.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");
      customSelect.classList.remove("open");
      selectSearch.value = "";

      selectOptions.forEach((item) => {
        item.classList.remove("hidden");
      });
    });
  });
  const defaultSelectedOption = document.querySelector(
    "#selectOptions li.selected",
  );

  if (defaultSelectedOption) {
    const defaultType = defaultSelectedOption.dataset.type;
    const defaultValue = defaultSelectedOption.dataset.value;

    selectedValue.textContent = defaultValue;

    if (schoolGrid) {
      schoolGrid.classList.remove("show");
    }

    if (districtGrid) {
      districtGrid.classList.remove("show");
    }

    if ((defaultType === "school" || defaultType === "state") && schoolGrid) {
      schoolGrid.classList.add("show");
    }

    if (defaultType === "district" && districtGrid) {
      districtGrid.classList.add("show");
    }
  }

  selectSearch.addEventListener("input", () => {
    const searchValue = selectSearch.value.toLowerCase();

    selectOptions.forEach((option) => {
      const optionText = option.textContent.toLowerCase();

      if (optionText.includes(searchValue)) {
        option.classList.remove("hidden");
      } else {
        option.classList.add("hidden");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!customSelect.contains(event.target)) {
      customSelect.classList.remove("open");
    }
  });
}

/* Demographic Participation Chart.js chart */

const demographicChartCanvas = document.getElementById("demographicChart");

if (demographicChartCanvas && typeof Chart !== "undefined") {
  new Chart(demographicChartCanvas, {
    type: "bar",
    data: {
      labels: ["Asian", "Black", "Hispanic", "White"],
      datasets: [
        {
          label: "CS Enrollment",
          data: [1, 24, 19, 52],
          backgroundColor: "#003057",
          borderRadius: 8,
          barThickness: 14,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.raw + "%";
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
          grid: {
            color: "#eeeeee",
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

/* Race/Ethnicity double bar chart */

const raceEthnicityChartCanvas = document.getElementById("raceEthnicityChart");

if (raceEthnicityChartCanvas && typeof Chart !== "undefined") {
  new Chart(raceEthnicityChartCanvas, {
    type: "bar",
    data: {
      labels: [
        "Asian and Pacific Islander",
        "Black",
        "Hispanic",
        "Native American",
        "White",
        "Two or More Races",
      ],
      datasets: [
        {
          label: "School",
          // 0.5 is used to represent <1% for the Native American category
          data: [1, 24, 19, 0.5, 52, 4],
          backgroundColor: "#B3A369",
          borderRadius: 8,
          barThickness: 10,
        },
        {
          label: "CS",
          data: [0, 32, 25, 0, 39, 4],
          backgroundColor: "#003057",
          borderRadius: 8,
          barThickness: 10,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            font: {
              family: "Arial",
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            title: function () {
              return "";
            },
            label: function (context) {
              const label = context.dataset.label;
              const value = context.raw;

              if (value === 0.5 && label === "School") {
                return label + ": <1%";
              }

              return label + ": " + value + "%";
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 60,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
          grid: {
            color: "#eeeeee",
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "Arial",
              size: 11,
            },
          },
        },
      },
    },
  });
}

/* Gender double bar chart */

const genderChartCanvas = document.getElementById("genderChart");

if (genderChartCanvas && typeof Chart !== "undefined") {
  new Chart(genderChartCanvas, {
    type: "bar",
    data: {
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "School",
          data: [52, 48],
          backgroundColor: "#B3A369",
          borderRadius: 8,
          barThickness: 12,
        },
        {
          label: "CS",
          data: [75, 25],
          backgroundColor: "#003057",
          borderRadius: 8,
          barThickness: 12,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            font: {
              family: "Arial",
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.raw + "%";
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
          grid: {
            color: "#eeeeee",
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "Arial",
              size: 12,
            },
          },
        },
      },
    },
  });
}

/* Card info popup */

const cardInfoButtons = document.querySelectorAll(".info-button");
const cardInfoCloseButtons = document.querySelectorAll(".card-info-close");

cardInfoButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const card = button.closest(".report-card");
    const popup = card.querySelector(".card-info-popup");

    document.querySelectorAll(".card-info-popup").forEach((item) => {
      if (item !== popup) {
        item.classList.remove("show");
      }
    });

    if (popup) {
      popup.classList.toggle("show");
    }
  });
});

cardInfoCloseButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const popup = button.closest(".card-info-popup");

    if (popup) {
      popup.classList.remove("show");
    }
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".card-info-popup").forEach((popup) => {
    popup.classList.remove("show");
  });
});

document.querySelectorAll(".card-info-popup").forEach((popup) => {
  popup.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});
