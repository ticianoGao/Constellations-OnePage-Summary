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

const reportMapViews = {};

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
            title: function () {
              return "";
            },
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
/* ArcGIS maps inside report cards */

if (typeof require !== "undefined") {
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/rest/support/Query",
    "esri/geometry/Point",
    "esri/geometry/Circle",
    "esri/widgets/Legend",
  ], function (
    Map,
    MapView,
    FeatureLayer,
    GraphicsLayer,
    Graphic,
    Query,
    Point,
    Circle,
    Legend,
  ) {
    const districtLayerUrl =
      "https://services2.arcgis.com/I9cUOJUZvdGAJncI/arcgis/rest/services/GADistrictSum/FeatureServer/6";

    const schoolLayerUrl =
      "https://services2.arcgis.com/I9cUOJUZvdGAJncI/arcgis/rest/services/All_GA_2_18/FeatureServer/0";

    const censusLayerUrl =
      "https://services2.arcgis.com/I9cUOJUZvdGAJncI/arcgis/rest/services/Georgia_Census_Tracts_CIC/FeatureServer/9";

    const internetAccessField = "percent_broadband";
    const incomeField = "median_hh_income";

    const selectedSchoolName = "Appling County High School";
    const schoolNameField = "SchoolName";

    async function getSchoolLocationByName(schoolName) {
      const schoolLayer = new FeatureLayer({
        url: schoolLayerUrl,
        outFields: ["SchoolName", "Latitude", "Longitude"],
      });

      const query = new Query();
      query.where = `${schoolNameField} = '${schoolName.replace(/'/g, "''")}'`;
      query.returnGeometry = true;
      query.outFields = ["SchoolName", "Latitude", "Longitude"];

      const result = await schoolLayer.queryFeatures(query);

      if (result.features.length === 0) {
        console.warn("No school found for:", schoolName);
        return null;
      }

      const feature = result.features[0];

      return {
        longitude: feature.attributes.Longitude,
        latitude: feature.attributes.Latitude,
      };
    }

    function createProficiencyMap(
      containerId,
      valueField,
      valueLabel,
      schoolLocation,
    ) {
      const container = document.getElementById(containerId);

      if (!container) {
        return;
      }

      const proficiencyLayer = new FeatureLayer({
        url: districtLayerUrl,
        title: valueLabel,
        outFields: ["*"],

        renderer: {
          type: "class-breaks",
          field: valueField,
          classBreakInfos: [
            {
              minValue: 5.8,
              maxValue: 22.7,
              symbol: {
                type: "simple-fill",
                color: "#4f7f7b",
                outline: {
                  color: "#666666",
                  width: 0.5,
                },
              },
              label: "5.8 - 22.7",
            },
            {
              minValue: 22.7,
              maxValue: 38,
              symbol: {
                type: "simple-fill",
                color: "#6f9992",
                outline: {
                  color: "#666666",
                  width: 0.5,
                },
              },
              label: "> 22.7 - 38",
            },
            {
              minValue: 38,
              maxValue: 52.7,
              symbol: {
                type: "simple-fill",
                color: "#9fbbb0",
                outline: {
                  color: "#666666",
                  width: 0.5,
                },
              },
              label: "> 38 - 52.7",
            },
            {
              minValue: 52.7,
              maxValue: 67,
              symbol: {
                type: "simple-fill",
                color: "#cbdcad",
                outline: {
                  color: "#666666",
                  width: 0.5,
                },
              },
              label: "> 52.7 - 67",
            },
            {
              minValue: 67,
              maxValue: 88,
              symbol: {
                type: "simple-fill",
                color: "#eef4c2",
                outline: {
                  color: "#666666",
                  width: 0.5,
                },
              },
              label: "> 67 - 88",
            },
          ],
        },

        popupTemplate: {
          title: "{NAME}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: valueField,
                  label: valueLabel,
                },
              ],
            },
          ],
        },
      });

      const schoolMarkerLayer = new GraphicsLayer();

      if (schoolLocation) {
        const schoolPoint = new Point({
          longitude: Number(schoolLocation.longitude),
          latitude: Number(schoolLocation.latitude),
          spatialReference: {
            wkid: 4326,
          },
        });

        const schoolCircleGeometry = new Circle({
          center: schoolPoint,
          radius: 5,
          radiusUnit: "kilometers",
          geodesic: true,
        });

        const schoolCircle = new Graphic({
          geometry: schoolCircleGeometry,
          symbol: {
            type: "simple-fill",
            color: [179, 163, 105, 0.28],
            outline: {
              color: [0, 48, 87, 1],
              width: 2,
            },
          },
          popupTemplate: {
            title: selectedSchoolName,
            content: "Selected school area highlight",
          },
        });

        schoolMarkerLayer.add(schoolCircle);
      }

      const map = new Map({
        basemap: "gray-vector",
        layers: [proficiencyLayer, schoolMarkerLayer],
      });

      const view = new MapView({
        container: containerId,
        map: map,
        center: schoolLocation
          ? [schoolLocation.longitude, schoolLocation.latitude]
          : [-83.5, 32.7],
        zoom: schoolLocation ? 7 : 6,
        constraints: {
          rotationEnabled: false,
        },
        ui: {
          components: ["zoom"],
        },
      });

      const legendWrapper = document.createElement("div");
      legendWrapper.className = "legend-wrapper esri-widget";

      const legendToggleButton = document.createElement("button");
      legendToggleButton.className = "legend-toggle-button";
      legendToggleButton.type = "button";
      legendToggleButton.textContent = "Hide Legend";

      const legendContent = document.createElement("div");
      legendContent.className = "legend-content";

      legendWrapper.appendChild(legendToggleButton);
      legendWrapper.appendChild(legendContent);

      const legend = new Legend({
        view: view,
        container: legendContent,
        layerInfos: [
          {
            layer: proficiencyLayer,
            title: valueLabel,
          },
        ],
      });

      let legendVisible = true;

      legendToggleButton.addEventListener("click", () => {
        legendVisible = !legendVisible;

        if (legendVisible) {
          legendContent.classList.remove("legend-content-hidden");
          legendToggleButton.textContent = "Hide Legend";
        } else {
          legendContent.classList.add("legend-content-hidden");
          legendToggleButton.textContent = "Show Legend";
        }
      });

      view.ui.add(legendWrapper, "bottom-right");
      reportMapViews[containerId] = view;
      return view;
    }
    function createContextMap(
      containerId,
      layerUrl,
      valueField,
      valueLabel,
      classBreakInfos,
      schoolLocation,
    ) {
      const container = document.getElementById(containerId);

      if (!container) {
        return;
      }

      const layerOptions = {
        url: layerUrl,
        title: valueLabel,
        outFields: ["*"],

        popupTemplate: {
          title: "{NAME}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: valueField,
                  label: valueLabel,
                },
              ],
            },
          ],
        },
      };

      if (classBreakInfos) {
        layerOptions.renderer = {
          type: "class-breaks",
          field: valueField,
          defaultSymbol: {
            type: "simple-fill",
            color: [220, 220, 220, 0.25],
            outline: {
              color: "#999999",
              width: 0.3,
            },
          },
          defaultLabel: "No data",
          classBreakInfos: classBreakInfos,
        };
      }

      const contextLayer = new FeatureLayer(layerOptions);

      const schoolMarkerLayer = new GraphicsLayer();

      if (schoolLocation) {
        const schoolPoint = new Point({
          longitude: Number(schoolLocation.longitude),
          latitude: Number(schoolLocation.latitude),
          spatialReference: {
            wkid: 4326,
          },
        });

        const schoolCircleGeometry = new Circle({
          center: schoolPoint,
          radius: 5,
          radiusUnit: "kilometers",
          geodesic: true,
        });

        const schoolCircle = new Graphic({
          geometry: schoolCircleGeometry,
          symbol: {
            type: "simple-fill",
            color: [179, 163, 105, 0.28],
            outline: {
              color: [0, 48, 87, 1],
              width: 2,
            },
          },
          popupTemplate: {
            title: selectedSchoolName,
            content: "Selected school area highlight",
          },
        });

        schoolMarkerLayer.add(schoolCircle);
      }

      const map = new Map({
        basemap: "gray-vector",
        layers: [contextLayer, schoolMarkerLayer],
      });

      const view = new MapView({
        container: containerId,
        map: map,
        center: schoolLocation
          ? [schoolLocation.longitude, schoolLocation.latitude]
          : [-83.5, 32.7],
        zoom: schoolLocation ? 7 : 6,
        constraints: {
          rotationEnabled: false,
        },
        ui: {
          components: ["zoom"],
        },
      });

      const legendWrapper = document.createElement("div");
      legendWrapper.className = "legend-wrapper esri-widget";

      const legendToggleButton = document.createElement("button");
      legendToggleButton.className = "legend-toggle-button";
      legendToggleButton.type = "button";
      legendToggleButton.textContent = "Hide Legend";

      const legendContent = document.createElement("div");
      legendContent.className = "legend-content";

      legendWrapper.appendChild(legendToggleButton);
      legendWrapper.appendChild(legendContent);

      const legend = new Legend({
        view: view,
        container: legendContent,
        layerInfos: [
          {
            layer: contextLayer,
            title: valueLabel,
          },
        ],
      });

      let legendVisible = true;

      legendToggleButton.addEventListener("click", () => {
        legendVisible = !legendVisible;

        if (legendVisible) {
          legendContent.classList.remove("legend-content-hidden");
          legendToggleButton.textContent = "Hide Legend";
        } else {
          legendContent.classList.add("legend-content-hidden");
          legendToggleButton.textContent = "Show Legend";
        }
      });

      view.ui.add(legendWrapper, "bottom-right");
      reportMapViews[containerId] = view;
      return view;
    }

    getSchoolLocationByName(selectedSchoolName).then((schoolLocation) => {
      createProficiencyMap(
        "mathProficiencyMap",
        "MathProf",
        "Mathematics Proficiency Percentage",
        schoolLocation,
      );

      createProficiencyMap(
        "englishProficiencyMap",
        "EngProf",
        "English Language Arts Proficiency Percentage",
        schoolLocation,
      );
      createContextMap(
        "internetAccessMap",
        censusLayerUrl,
        internetAccessField,
        "Percent Households with Broadband Internet",
        [
          {
            minValue: 0,
            maxValue: 20,
            symbol: {
              type: "simple-fill",
              color: "#8a5f1a",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "0 - 20",
          },
          {
            minValue: 20,
            maxValue: 40,
            symbol: {
              type: "simple-fill",
              color: "#a7792d",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 20 - 40",
          },
          {
            minValue: 40,
            maxValue: 60,
            symbol: {
              type: "simple-fill",
              color: "#c6aa7f",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 40 - 60",
          },
          {
            minValue: 60,
            maxValue: 80,
            symbol: {
              type: "simple-fill",
              color: "#e1cda8",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 60 - 80",
          },
          {
            minValue: 80,
            maxValue: 100,
            symbol: {
              type: "simple-fill",
              color: "#f3e4c7",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 80 - 100",
          },
        ],
        schoolLocation,
      );
      createContextMap(
        "internetAccessMap",
        censusLayerUrl,
        internetAccessField,
        "Percent Households with Broadband Internet",
        [
          {
            minValue: 0,
            maxValue: 20,
            symbol: {
              type: "simple-fill",
              color: "#8a5f1a",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "0 - 20",
          },
          {
            minValue: 20,
            maxValue: 40,
            symbol: {
              type: "simple-fill",
              color: "#a7792d",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 20 - 40",
          },
          {
            minValue: 40,
            maxValue: 60,
            symbol: {
              type: "simple-fill",
              color: "#c6aa7f",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 40 - 60",
          },
          {
            minValue: 60,
            maxValue: 80,
            symbol: {
              type: "simple-fill",
              color: "#e1cda8",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 60 - 80",
          },
          {
            minValue: 80,
            maxValue: 100,
            symbol: {
              type: "simple-fill",
              color: "#f3e4c7",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 80 - 100",
          },
        ],
        schoolLocation,
      );
      createContextMap(
        "incomeMap",
        censusLayerUrl,
        incomeField,
        "Median Household Income",
        [
          {
            minValue: 8354,
            maxValue: 64111,
            symbol: {
              type: "simple-fill",
              color: "#f4e3dc",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "8,354 - 64,111",
          },
          {
            minValue: 64111,
            maxValue: 100705,
            symbol: {
              type: "simple-fill",
              color: "#f6a08d",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 64,111 - 100,705",
          },
          {
            minValue: 100705,
            maxValue: 156389,
            symbol: {
              type: "simple-fill",
              color: "#fb5a43",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 100,705 - 156,389",
          },
          {
            minValue: 156389,
            maxValue: 250001,
            symbol: {
              type: "simple-fill",
              color: "#d7191c",
              outline: {
                color: "#777777",
                width: 0.35,
              },
            },
            label: "> 156,389 - 250,001",
          },
        ],
        schoolLocation,
      );
    });
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

/* Export report as PDF */
async function replaceMapsWithScreenshots() {
  const replacements = [];

  const mapIds = [
    "mathProficiencyMap",
    "englishProficiencyMap",
    "internetAccessMap",
    "incomeMap",
  ];

  for (const mapId of mapIds) {
    const mapDiv = document.getElementById(mapId);
    const view = reportMapViews[mapId];

    if (!mapDiv || !view) {
      continue;
    }

    await view.when();

    const screenshot = await view.takeScreenshot({
      width: mapDiv.offsetWidth,
      height: mapDiv.offsetHeight,
      format: "png",
    });

    const img = document.createElement("img");
    img.src = screenshot.dataUrl;
    img.className = "map-export-image";

    replacements.push({
      mapDiv: mapDiv,
      image: img,
      originalDisplay: mapDiv.style.display,
    });

    mapDiv.style.display = "none";
    mapDiv.parentNode.insertBefore(img, mapDiv);
  }

  return replacements;
}

function restoreLiveMaps(replacements) {
  replacements.forEach((item) => {
    item.image.remove();
    item.mapDiv.style.display = item.originalDisplay;
  });
}
const exportReportButton = document.getElementById("exportReportButton");

if (exportReportButton) {
  exportReportButton.addEventListener("click", async () => {
    const reportElement = document.getElementById("schoolGrid");

    if (!reportElement || !reportElement.classList.contains("show")) {
      alert("Please select a report before exporting.");
      return;
    }

    exportReportButton.disabled = true;
    exportReportButton.textContent = "Generating...";

    let mapReplacements = [];

    try {
      reportElement.classList.add("exporting-report");

      mapReplacements = await replaceMapsWithScreenshots();

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#eeeeee",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imageData = canvas.toDataURL("image/png");

      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 24;
      const usableWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * usableWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = margin;

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        position,
        usableWidth,
        imageHeight,
      );
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imageHeight + margin;
        pdf.addImage(
          imageData,
          "PNG",
          margin,
          position,
          usableWidth,
          imageHeight,
        );
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save("constellations-report.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("The PDF could not be generated. Please try again.");
    } finally {
      restoreLiveMaps(mapReplacements);

      reportElement.classList.remove("exporting-report");
      exportReportButton.disabled = false;
      exportReportButton.textContent = "Export";
    }
  });
}
