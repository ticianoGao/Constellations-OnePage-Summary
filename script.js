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

const stateReportGrid = document.getElementById("stateReportGrid");
const schoolGrid = document.getElementById("schoolGrid");
const districtGrid = document.getElementById("districtGrid");
const districtReportGrid = document.getElementById("districtReportGrid");
const customSelect = document.getElementById("districtSelect");

const reportMapViews = {};

const selectTrigger = document.getElementById("selectTrigger");
const selectedValue = document.getElementById("selectedValue");
const selectSearch = document.getElementById("selectSearch");
const selectOptionsList = document.getElementById("selectOptions");

const reportSchoolYearLabel = "2024–25";

let selectedReportValue = "Georgia Statewide";
let selectedReportType = "state";
let selectedSchoolId = null;
let selectedDistrictName = null;
let selectedGradeRange = null;
let selectedLatitude = null;
let selectedLongitude = null;

let schoolLookupData = [];

window.currentReportSelection = {
  type: selectedReportType,
  value: selectedReportValue,
  schoolId: selectedSchoolId,
  districtName: selectedDistrictName,
  gradeRange: selectedGradeRange,
  latitude: selectedLatitude,
  longitude: selectedLongitude,
};

function updateCurrentReportSelection() {
  window.currentReportSelection = {
    type: selectedReportType,
    value: selectedReportValue,
    schoolId: selectedSchoolId,
    districtName: selectedDistrictName,
    gradeRange: selectedGradeRange,
    latitude: selectedLatitude,
    longitude: selectedLongitude,
  };
}

function formatGradeRange(gradeRange) {
  if (!gradeRange) {
    return "Grade range unavailable";
  }

  const formatted = gradeRange
    .replaceAll("PK", "Pre-K")
    .replaceAll("KK", "Kindergarten")
    .replace(/\b0(\d)\b/g, "$1")
    .replaceAll("-", "–")
    .replaceAll(",", ", ");

  return `Grades ${formatted}`;
}

function updateSnapshotTitles() {
  const stateSnapshotHeading = document.getElementById("stateSnapshotHeading");
  const stateSnapshotSubtitle = document.getElementById(
    "stateSnapshotSubtitle",
  );

  const schoolSnapshotHeading = document.getElementById(
    "schoolSnapshotHeading",
  );
  const schoolSnapshotSubtitle = document.getElementById(
    "schoolSnapshotSubtitle",
  );

  const districtSnapshotHeading = document.getElementById(
    "districtSnapshotHeading",
  );
  const districtSnapshotSubtitle = document.getElementById(
    "districtSnapshotSubtitle",
  );

  if (selectedReportType === "state") {
    if (stateSnapshotHeading) {
      stateSnapshotHeading.textContent = `${reportSchoolYearLabel} Computing Education Resources Statewide Report`;
    }

    if (stateSnapshotSubtitle) {
      stateSnapshotSubtitle.innerHTML = `
        Georgia Statewide
        <span>–</span>
        State Report
      `;
    }
  }

  if (selectedReportType === "school") {
    if (schoolSnapshotHeading) {
      schoolSnapshotHeading.textContent = `${reportSchoolYearLabel} Computing Education Resources School Report`;
    }

    if (schoolSnapshotSubtitle) {
      schoolSnapshotSubtitle.innerHTML = `
        ${selectedDistrictName || "District unavailable"}
        <span>–</span>
        ${selectedReportValue}
        <span>–</span>
        ${formatGradeRange(selectedGradeRange)}
      `;
    }
  }

  if (selectedReportType === "district") {
    if (districtSnapshotHeading) {
      districtSnapshotHeading.textContent = `${reportSchoolYearLabel} Computing Education Resources District Report`;
    }

    if (districtSnapshotSubtitle) {
      districtSnapshotSubtitle.innerHTML = `
        ${selectedDistrictName || selectedReportValue}
        <span>–</span>
        District Report
      `;
    }
  }
}

const sampleSchoolSummaryData = {
  default: {
    totalStudents: "1049",
    csCourses: "2",
    csTeachers: "1",
    csEnrollments: "28",
    csCoursesComparison: "NULL%",
    apCsa: "Unavailable",
    apCsp: "Available",
    otherCourses: "Introduction to Digital Technology",
    csEnrollmentPercent: "2.67%",
    csEnrollmentComparison: "NULL%",
    category1: "15",
    category2: "0",
    category34: "13",
    teacherStudentRatio: "0.04",
    teacherStudentRatioComparison: "NULL",
  },
};

const sampleDistrictSummaryData = {
  default: {
    totalStudents: "1049",
    csCourses: "2",
    csTeachers: "1",
    csEnrollments: "28",
    csCoursesComparison: "NULL%",
    apCsa: "Unavailable",
    apCsp: "Available",
    otherCourses: "Introduction to Digital Technology",
    csEnrollmentPercent: "2.67%",
    csEnrollmentComparison: "NULL%",
    category1: "15",
    category2: "0",
    category34: "13",
    teacherStudentRatio: "0.04",
    teacherStudentRatioComparison: "NULL",
  },
};

function setTextById(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function updateSchoolSummaryFromData(data) {
  setTextById("schoolTotalStudents", data.totalStudents);
  setTextById("schoolCsCourses", data.csCourses);
  setTextById("schoolCsTeachers", data.csTeachers);
  setTextById("schoolCsEnrollments", data.csEnrollments);

  setTextById("schoolTotalStudentsText", data.totalStudents);
  setTextById("schoolCsCoursesText", data.csCourses);
  setTextById("schoolCsCoursesComparison", data.csCoursesComparison);
  setTextById("schoolApCsa", data.apCsa);
  setTextById("schoolApCsp", data.apCsp);
  setTextById("schoolOtherCourses", data.otherCourses);
  setTextById("schoolCsEnrollmentsText", data.csEnrollments);
  setTextById("schoolCsEnrollmentPercent", data.csEnrollmentPercent);
  setTextById("schoolCsEnrollmentComparison", data.csEnrollmentComparison);
  setTextById("schoolCategory1", data.category1);
  setTextById("schoolCategory2", data.category2);
  setTextById("schoolCategory34", data.category34);
  setTextById("schoolCsTeachersText", data.csTeachers);
  setTextById("schoolTeacherStudentRatio", data.teacherStudentRatio);
  setTextById(
    "schoolTeacherStudentRatioComparison",
    data.teacherStudentRatioComparison,
  );
}

function updateDistrictSummaryFromData(data) {
  setTextById("districtTotalStudents", data.totalStudents);
  setTextById("districtCsCourses", data.csCourses);
  setTextById("districtCsTeachers", data.csTeachers);
  setTextById("districtCsEnrollments", data.csEnrollments);

  setTextById("districtTotalStudentsText", data.totalStudents);
  setTextById("districtCsCoursesText", data.csCourses);
  setTextById("districtCsCoursesComparison", data.csCoursesComparison);
  setTextById("districtApCsa", data.apCsa);
  setTextById("districtApCsp", data.apCsp);
  setTextById("districtOtherCourses", data.otherCourses);
  setTextById("districtCsEnrollmentsText", data.csEnrollments);
  setTextById("districtCsEnrollmentPercent", data.csEnrollmentPercent);
  setTextById("districtCsEnrollmentComparison", data.csEnrollmentComparison);
  setTextById("districtCategory1", data.category1);
  setTextById("districtCategory2", data.category2);
  setTextById("districtCategory34", data.category34);
  setTextById("districtCsTeachersText", data.csTeachers);
  setTextById("districtTeacherStudentRatio", data.teacherStudentRatio);
  setTextById(
    "districtTeacherStudentRatioComparison",
    data.teacherStudentRatioComparison,
  );
}

function updateSummaryFromSampleData() {
  if (selectedReportType === "school") {
    const schoolData =
      sampleSchoolSummaryData[selectedReportValue] ||
      sampleSchoolSummaryData.default;

    updateSchoolSummaryFromData(schoolData);
  }

  if (selectedReportType === "district") {
    const districtData =
      sampleDistrictSummaryData[selectedDistrictName] ||
      sampleDistrictSummaryData[selectedReportValue] ||
      sampleDistrictSummaryData.default;

    updateDistrictSummaryFromData(districtData);
  }
}

function hideAllReportGrids() {
  if (stateReportGrid) {
    stateReportGrid.classList.remove("show");
  }

  if (schoolGrid) {
    schoolGrid.classList.remove("show");
  }

  if (districtGrid) {
    districtGrid.classList.remove("show");
  }

  if (districtReportGrid) {
    districtReportGrid.classList.remove("show");
  }
}

function showReportByType(type) {
  hideAllReportGrids();

  if (type === "state" && stateReportGrid) {
    stateReportGrid.classList.add("show");
  }

  if (type === "school" && schoolGrid) {
    schoolGrid.classList.add("show");
  }

  if (type === "district" && districtReportGrid) {
    districtReportGrid.classList.add("show");
  }
}

function clearDropdownSearch() {
  if (selectSearch) {
    selectSearch.value = "";
  }

  document.querySelectorAll("#selectOptions li").forEach((item) => {
    item.classList.remove("hidden");
  });
}

function selectDropdownOption(option) {
  const value = option.dataset.value;
  const type = option.dataset.type;

  selectedReportValue = value;
  selectedReportType = type;
  selectedSchoolId = option.dataset.schoolId || null;
  selectedDistrictName = option.dataset.district || null;
  selectedGradeRange = option.dataset.gradeRange || null;
  selectedLatitude = option.dataset.lat || null;
  selectedLongitude = option.dataset.lon || null;

  selectedValue.textContent = option.dataset.label || value;

  document.querySelectorAll("#selectOptions li").forEach((item) => {
    item.classList.remove("selected");
  });

  option.classList.add("selected");

  showReportByType(type);

  customSelect.classList.remove("open");
  clearDropdownSearch();
  updateCurrentReportSelection();
  updateSnapshotTitles();
  updateSummaryFromSampleData();

  console.log("Selected report option:", window.currentReportSelection);
}

function createDropdownOption({
  label,
  displayText,
  type,
  value,
  schoolId = "",
  district = "",
  gradeRange = "",
  lat = "",
  lon = "",
  systemId = "",
}) {
  const option = document.createElement("li");

  option.dataset.label = label;
  option.dataset.value = value || label;
  option.dataset.type = type;
  option.dataset.schoolId = schoolId;
  option.dataset.district = district;
  option.dataset.gradeRange = gradeRange;
  option.dataset.lat = lat;
  option.dataset.lon = lon;
  option.dataset.systemId = systemId;

  option.textContent = displayText || label;

  option.addEventListener("click", () => {
    selectDropdownOption(option);
  });

  return option;
}

function cleanSchoolRows(rows) {
  return rows
    .map((row) => {
      return {
        schoolId: row.ga_full_id || "",
        schoolName: row.SCHOOL_NAME || "",
        districtName: row.SYSTEM_NAME || "",
        systemId: row.SYSTEM_ID || "",
        gradeRange: row.GRADE_RANGE || "",
        schoolType: row.FAC_SCHTYPE || "",
        lat: row.LAT || "",
        lon: row.LON || "",
      };
    })
    .filter((row) => row.schoolName.trim() !== "");
}

function buildDropdownFromCsvRows(rows) {
  if (!selectOptionsList) {
    return;
  }

  schoolLookupData = cleanSchoolRows(rows);

  selectOptionsList.innerHTML = "";

  const statewideOption = createDropdownOption({
    label: "Georgia Statewide",
    value: "Georgia Statewide",
    type: "state",
  });

  statewideOption.classList.add("selected");
  selectOptionsList.appendChild(statewideOption);

  const districtMap = new Map();

  schoolLookupData.forEach((school) => {
    if (!school.districtName) {
      return;
    }

    if (!districtMap.has(school.districtName)) {
      districtMap.set(school.districtName, {
        districtName: school.districtName,
        systemId: school.systemId,
        schoolCount: 0,
      });
    }

    districtMap.get(school.districtName).schoolCount += 1;
  });

  const districts = Array.from(districtMap.values()).sort((a, b) => {
    return a.districtName.localeCompare(b.districtName);
  });

  districts.forEach((district) => {
    const districtOption = createDropdownOption({
      label: district.districtName,
      displayText: `${district.districtName} — ${district.schoolCount} schools`,
      value: district.districtName,
      type: "district",
      district: district.districtName,
      systemId: district.systemId,
    });

    selectOptionsList.appendChild(districtOption);
  });

  const schools = [...schoolLookupData].sort((a, b) => {
    return a.schoolName.localeCompare(b.schoolName);
  });

  schools.forEach((school) => {
    const schoolOption = createDropdownOption({
      label: school.schoolName,
      displayText: `${school.schoolName} — ${school.districtName}`,
      value: school.schoolName,
      type: "school",
      schoolId: school.schoolId,
      district: school.districtName,
      gradeRange: school.gradeRange,
      lat: school.lat,
      lon: school.lon,
      systemId: school.systemId,
    });

    selectOptionsList.appendChild(schoolOption);
  });

  selectedReportValue = "Georgia Statewide";
  selectedReportType = "state";
  selectedSchoolId = null;
  selectedDistrictName = null;
  selectedGradeRange = null;
  selectedLatitude = null;
  selectedLongitude = null;

  selectedValue.textContent = "Georgia Statewide";
  showReportByType("state");
  updateCurrentReportSelection();
  updateSnapshotTitles();

  console.log("School lookup loaded:", {
    schoolCount: schoolLookupData.length,
    districtCount: districts.length,
  });
}

function loadSchoolLookupCsv() {
  if (typeof Papa === "undefined") {
    console.error(
      "PapaParse is not loaded. Check the script tag in index.html.",
    );
    return;
  }

  Papa.parse("data/lookup_version_.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      buildDropdownFromCsvRows(results.data);
    },
    error: function (error) {
      console.error("Could not load lookup_version_.csv:", error);
    },
  });
}

if (customSelect && selectTrigger && selectedValue && selectSearch) {
  selectTrigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");

    if (customSelect.classList.contains("open")) {
      selectSearch.focus();
    }
  });

  selectSearch.addEventListener("input", () => {
    const searchValue = selectSearch.value.toLowerCase();

    document.querySelectorAll("#selectOptions li").forEach((option) => {
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

  loadSchoolLookupCsv();
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

/* This is for district reports */

const districtRaceEthnicityChartCanvas = document.getElementById(
  "districtRaceEthnicityChart",
);

if (districtRaceEthnicityChartCanvas && typeof Chart !== "undefined") {
  new Chart(districtRaceEthnicityChartCanvas, {
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

/* Gender double bar chart for district reports */

const districtGenderChartCanvas = document.getElementById(
  "districtGenderChart",
);

if (districtGenderChartCanvas && typeof Chart !== "undefined") {
  new Chart(districtGenderChartCanvas, {
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
      legendToggleButton.textContent = "Hide";

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

      container.classList.remove("legend-is-hidden");

      legendToggleButton.addEventListener("click", () => {
        legendVisible = !legendVisible;

        if (legendVisible) {
          legendContent.classList.remove("legend-content-hidden");
          legendToggleButton.textContent = "Hide";
          container.classList.remove("legend-is-hidden");
        } else {
          legendContent.classList.add("legend-content-hidden");
          legendToggleButton.textContent = "Show";
          container.classList.add("legend-is-hidden");
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
      legendToggleButton.textContent = "Hide";

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

      container.classList.remove("legend-is-hidden");

      legendToggleButton.addEventListener("click", () => {
        legendVisible = !legendVisible;

        if (legendVisible) {
          legendContent.classList.remove("legend-content-hidden");
          legendToggleButton.textContent = "Hide";
          container.classList.remove("legend-is-hidden");
        } else {
          legendContent.classList.add("legend-content-hidden");
          legendToggleButton.textContent = "Show";
          container.classList.add("legend-is-hidden");
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
        "Math Proficiency",
        schoolLocation,
      );

      createProficiencyMap(
        "englishProficiencyMap",
        "EngProf",
        "English Language Arts Proficiency",
        schoolLocation,
      );

      createProficiencyMap(
        "districtMathProficiencyMap",
        "MathProf",
        "Math Proficiency",
        schoolLocation,
      );

      createProficiencyMap(
        "districtEnglishProficiencyMap",
        "EngProf",
        "English Language Arts Proficiency",
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
      createContextMap(
        "districtInternetAccessMap",
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
        "districtIncomeMap",
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

    mapDiv.classList.add("exporting-map");
    mapDiv.appendChild(img);

    replacements.push({
      mapDiv: mapDiv,
      image: img,
    });
  }

  return replacements;
}

function restoreLiveMaps(replacements) {
  replacements.forEach((item) => {
    item.image.remove();
    item.mapDiv.classList.remove("exporting-map");
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

      const margin = 24;

      // Use A4 width, but custom height based on the report image
      const pageWidth = 595.28;
      const usableWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * usableWidth) / canvas.width;
      const pageHeight = imageHeight + margin * 2;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [pageWidth, pageHeight],
      });

      pdf.addImage(imageData, "PNG", margin, margin, usableWidth, imageHeight);

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
