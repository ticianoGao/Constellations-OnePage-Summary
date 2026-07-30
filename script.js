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
const districtReportGrid = document.getElementById("districtReportGrid");
const customSelect = document.getElementById("districtSelect");

const reportMapViews = {};
const reportMapMarkerLayers = {};

const selectTrigger = document.getElementById("selectTrigger");
const selectedValue = document.getElementById("selectedValue");
const selectSearch = document.getElementById("selectSearch");
const selectOptionsList = document.getElementById("selectOptions");

const schoolRecommendations = document.getElementById("schoolRecommendations");

const districtRecommendations = document.getElementById(
  "districtRecommendations",
);

const reportSchoolYearLabel = "2024 - 2025";

let selectedReportValue = "Georgia Statewide";
let selectedReportType = "state";
let selectedSchoolId = null;
let selectedDistrictName = null;
let selectedSystemId = null;
let selectedGradeRange = null;
let selectedLatitude = null;
let selectedLongitude = null;

let schoolLookupData = [];

window.currentReportSelection = {
  type: selectedReportType,
  value: selectedReportValue,
  schoolId: selectedSchoolId,
  districtName: selectedDistrictName,
  systemId: selectedSystemId,
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
    systemId: selectedSystemId,
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
      stateSnapshotHeading.textContent = `${reportSchoolYearLabel} CS Education Access Statewide Report`;
    }

    if (stateSnapshotSubtitle) {
      stateSnapshotSubtitle.innerHTML = `
        Georgia Statewide
      `;
    }
  }

  if (selectedReportType === "school") {
    if (schoolSnapshotHeading) {
      schoolSnapshotHeading.textContent = `${reportSchoolYearLabel} CS Education Access School Report`;
    }

    if (schoolSnapshotSubtitle) {
      const safeDistrictName = escapeHtml(
        selectedDistrictName || "District unavailable",
      );
      const safeSchoolName = escapeHtml(selectedReportValue);
      const safeGradeRange = escapeHtml(formatGradeRange(selectedGradeRange));

      schoolSnapshotSubtitle.innerHTML = `
        <button
          class="snapshot-district-link"
          type="button"
          data-district-name="${safeDistrictName}"
          aria-label="Open ${safeDistrictName} district report"
        >
          ${safeDistrictName}
        </button>
        <span>•</span>
        ${safeSchoolName}
        <span>•</span>
        ${safeGradeRange}
      `;
    }
  }

  if (selectedReportType === "district") {
    if (districtSnapshotHeading) {
      districtSnapshotHeading.textContent = `${reportSchoolYearLabel} CS Education Access District Report`;
    }

    if (districtSnapshotSubtitle) {
      districtSnapshotSubtitle.innerHTML = `
        ${selectedDistrictName || selectedReportValue}
      `;
    }
  }
}

const sampleSchoolSummaryData = {
  default: {
    totalStudents: "1049",
    csCourses: "2",
    approvedCsCourses: "1",
    approvedCsCoursesVerb: "was",
    csCourseAverageSentence:
      "On average, high schools in Georgia had 3 computer science courses available.",
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
    category3: "0",
    category4: "13",
    studentTeacherRatio: "28",
    studentTeacherRatioComparison: "NULL",
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
    category3: "0",
    category4: "13",
    studentTeacherRatio: "28",
    studentTeacherRatioComparison: "NULL",
  },
};

function setTextById(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function setHtmlById(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.innerHTML = value;
  }
}

function parsePercentText(value) {
  const number = Number(
    String(value || "")
      .replace("%", "")
      .trim(),
  );

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function updateComparisonColor(valueCellId, benchmarkCellId) {
  const valueCell = document.getElementById(valueCellId);
  const benchmarkCell = document.getElementById(benchmarkCellId);

  if (!valueCell || !benchmarkCell) {
    return;
  }

  valueCell.classList.remove(
    "comparison-higher",
    "comparison-lower",
    "comparison-same",
  );

  const value = parsePercentText(valueCell.textContent);
  const benchmark = parsePercentText(benchmarkCell.textContent);

  if (value === null || benchmark === null) {
    return;
  }

  // A higher CS Enrollment/Total Enrollment percentage indicates
  // more CS course enrollments relative to the student population.
  if (value > benchmark) {
    valueCell.classList.add("comparison-higher");
  } else if (value < benchmark) {
    valueCell.classList.add("comparison-lower");
  } else {
    valueCell.classList.add("comparison-same");
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function goToDistrictReport(districtName) {
  if (!districtName || !selectOptionsList) {
    return;
  }

  const districtOption = Array.from(
    selectOptionsList.querySelectorAll('li[data-type="district"]'),
  ).find((option) => {
    return (
      option.dataset.value === districtName ||
      option.dataset.district === districtName ||
      option.dataset.label === districtName
    );
  });

  if (districtOption) {
    selectDropdownOption(districtOption);
  }
}

function fitSummaryMetricNumbers() {
  const metricNumbers = document.querySelectorAll(
    ".school-summary-card .metric-number",
  );

  metricNumbers.forEach((element) => {
    const maxFontSize = 21.6; // 1.35rem
    const minFontSize = 12;

    element.style.fontSize = `${maxFontSize}px`;

    let currentFontSize = maxFontSize;

    while (
      element.scrollWidth > element.clientWidth &&
      currentFontSize > minFontSize
    ) {
      currentFontSize -= 0.5;
      element.style.fontSize = `${currentFontSize}px`;
    }
  });
}

function updateSchoolSummaryFromData(data) {
  setTextById("schoolTotalStudents", data.totalStudents);
  setTextById("schoolCsCourses", data.csCourses);
  setTextById("schoolCsTeachers", data.csTeachers);
  setTextById("schoolCsEnrollments", data.csEnrollments);

  setTextById("schoolTotalStudentsText", data.totalStudents);
  setTextById("schoolCsCoursesText", data.csCourses);
  setTextById("schoolApprovedCsCoursesText", data.approvedCsCourses);
  setTextById("schoolApprovedCsCoursesVerb", data.approvedCsCoursesVerb);
  setTextById("schoolCsCourseAverageSentence", data.csCourseAverageSentence);
  setTextById("schoolCsCoursesComparison", data.csCoursesComparison);
  setHtmlById("schoolApCsa", data.apCsa);
  setHtmlById("schoolApCsp", data.apCsp);
  setHtmlById("schoolOtherCourses", data.otherCourses);
  setTextById("schoolCsEnrollmentsText", data.csEnrollments);
  setTextById("schoolCsEnrollmentPercent", data.csEnrollmentPercent);
  setTextById("schoolCsEnrollmentComparison", data.csEnrollmentComparison);
  setTextById("schoolCategory1", data.category1);
  setTextById("schoolCategory2", data.category2);
  setTextById("schoolCategory3", data.category3);
  setTextById("schoolCategory4", data.category4);

  setTextById("schoolTableCsEnrollments", data.schoolTableCsEnrollments);
  setTextById("districtTableCsEnrollments", data.districtTableCsEnrollments);
  setTextById("stateTableCsEnrollments", data.stateTableCsEnrollments);

  setTextById(
    "schoolTableCsEnrollmentPercent",
    data.schoolTableCsEnrollmentPercent,
  );
  setTextById(
    "districtTableCsEnrollmentPercent",
    data.districtTableCsEnrollmentPercent,
  );
  setTextById(
    "stateTableCsEnrollmentPercent",
    data.stateTableCsEnrollmentPercent,
  );

  updateComparisonColor(
    "schoolTableCsEnrollmentPercent",
    "stateTableCsEnrollmentPercent",
  );

  setTextById("schoolTableCategory1", data.schoolTableCategory1);
  setTextById("districtTableCategory1", data.districtTableCategory1);
  setTextById("stateTableCategory1", data.stateTableCategory1);

  setTextById("schoolTableCategory2", data.schoolTableCategory2);
  setTextById("districtTableCategory2", data.districtTableCategory2);
  setTextById("stateTableCategory2", data.stateTableCategory2);

  setTextById("schoolTableCategory3", data.schoolTableCategory3);
  setTextById("districtTableCategory3", data.districtTableCategory3);
  setTextById("stateTableCategory3", data.stateTableCategory3);

  setTextById("schoolTableCategory4", data.schoolTableCategory4);
  setTextById("districtTableCategory4", data.districtTableCategory4);
  setTextById("stateTableCategory4", data.stateTableCategory4);

  setTextById("schoolCsTeachersText", data.csTeachers);
  setTextById("schoolStudentTeacherRatio", data.studentTeacherRatio);
  setTextById(
    "schoolStudentTeacherRatioComparison",
    data.studentTeacherRatioComparison,
  );

  requestAnimationFrame(fitSummaryMetricNumbers);
}

function updateDistrictSummaryFromData(data) {
  setTextById("districtTotalStudents", data.totalStudents);
  setTextById("districtCsCourses", data.csCourses);
  setTextById("districtCsTeachers", data.csTeachers);
  setTextById("districtCsEnrollments", data.csEnrollments);

  setTextById("districtTotalStudentsText", data.totalStudents);
  setTextById("districtCsCoursesText", data.csCourses);
  setTextById("districtCsCoursesComparison", data.csCoursesComparison);
  setHtmlById("districtApCsa", data.apCsa);
  setHtmlById("districtApCsp", data.apCsp);
  setHtmlById("districtOtherCourses", data.otherCourses);
  setTextById("districtCsEnrollmentsText", data.csEnrollments);
  setTextById("districtCsEnrollmentPercent", data.csEnrollmentPercent);
  setTextById("districtCsEnrollmentComparison", data.csEnrollmentComparison);
  setTextById("districtCategory1", data.category1);
  setTextById("districtCategory2", data.category2);
  setTextById("districtCategory3", data.category3);
  setTextById("districtCategory4", data.category4);

  setTextById(
    "districtReportTableCsEnrollments",
    data.districtReportTableCsEnrollments,
  );
  setTextById(
    "districtReportStateTableCsEnrollments",
    data.districtReportStateTableCsEnrollments,
  );

  setTextById(
    "districtReportTableCsEnrollmentPercent",
    data.districtReportTableCsEnrollmentPercent,
  );
  setTextById(
    "districtReportStateTableCsEnrollmentPercent",
    data.districtReportStateTableCsEnrollmentPercent,
  );
  updateComparisonColor(
    "districtReportTableCsEnrollmentPercent",
    "districtReportStateTableCsEnrollmentPercent",
  );

  setTextById(
    "districtReportTableCategory1",
    data.districtReportTableCategory1,
  );
  setTextById(
    "districtReportStateTableCategory1",
    data.districtReportStateTableCategory1,
  );

  setTextById(
    "districtReportTableCategory2",
    data.districtReportTableCategory2,
  );
  setTextById(
    "districtReportStateTableCategory2",
    data.districtReportStateTableCategory2,
  );

  setTextById(
    "districtReportTableCategory3",
    data.districtReportTableCategory3,
  );
  setTextById(
    "districtReportStateTableCategory3",
    data.districtReportStateTableCategory3,
  );

  setTextById(
    "districtReportTableCategory4",
    data.districtReportTableCategory4,
  );
  setTextById(
    "districtReportStateTableCategory4",
    data.districtReportStateTableCategory4,
  );

  setTextById("districtCsTeachersText", data.csTeachers);
  setTextById("districtStudentTeacherRatio", data.studentTeacherRatio);
  setTextById(
    "districtStudentTeacherRatioComparison",
    data.studentTeacherRatioComparison,
  );

  requestAnimationFrame(fitSummaryMetricNumbers);
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
  selectedSystemId = option.dataset.systemId || null;
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
  updateSummaryForSelection();

  if (typeof window.updateReportMapsForSelection === "function") {
    window.updateReportMapsForSelection();
  }

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
        schoolId: row.ga_full_id || row.FullID || "",
        schoolName: row.SCHOOL_NAME || row.SchoolName || "",
        districtName: row.SYSTEM_NAME || row.SystemName || "",
        systemId: row.SYSTEM_ID || row.LEAID || row.SystemName || "",
        gradeRange: row.GRADE_RANGE || row.GradeRange || "",
        schoolType: row.FAC_SCHTYPE || row.SchoolType || "",
        lat: row.LAT || row.Latitude || "",
        lon: row.LON || row.Longitude || "",
      };
    })
    .filter((row) => row.schoolName.trim() !== "");
}

function makeGroupId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    const districtName = school.districtName || "District unavailable";

    if (!districtMap.has(districtName)) {
      districtMap.set(districtName, {
        districtName,
        systemId: school.systemId,
        schools: [],
      });
    }

    districtMap.get(districtName).schools.push(school);
  });

  const districts = Array.from(districtMap.values()).sort((a, b) => {
    return a.districtName.localeCompare(b.districtName);
  });

  districts.forEach((district) => {
    const groupId = makeGroupId(district.districtName);

    const districtOption = createDropdownOption({
      label: district.districtName,
      displayText: `${district.districtName} — ${district.schools.length} schools`,
      value: district.districtName,
      type: "district",
      district: district.districtName,
      systemId: district.systemId,
    });

    districtOption.classList.add("district-group-option");
    districtOption.dataset.groupId = groupId;

    selectOptionsList.appendChild(districtOption);

    const schools = [...district.schools].sort((a, b) => {
      return a.schoolName.localeCompare(b.schoolName);
    });

    schools.forEach((school) => {
      const schoolOption = createDropdownOption({
        label: school.schoolName,
        displayText: school.schoolName,
        value: school.schoolName,
        type: "school",
        schoolId: school.schoolId,
        district: school.districtName,
        gradeRange: school.gradeRange,
        lat: school.lat,
        lon: school.lon,
        systemId: school.systemId,
      });

      schoolOption.classList.add("school-sub-option");
      schoolOption.dataset.groupId = groupId;

      selectOptionsList.appendChild(schoolOption);
    });
  });

  selectedReportValue = "Georgia Statewide";
  selectedReportType = "state";
  selectedSchoolId = null;
  selectedDistrictName = null;
  selectedSystemId = null;
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

const schoolLookupLayerQueryUrl =
  "https://services2.arcgis.com/I9cUOJUZvdGAJncI/arcgis/rest/services/All_GA_2_18/FeatureServer/0/query";

async function fetchAllSchoolLookupRowsFromArcGIS() {
  const pageSize = 2000;
  let resultOffset = 0;
  const allRows = [];

  while (true) {
    const queryParams = new URLSearchParams({
      where: "SchoolName IS NOT NULL",
      outFields:
        "FullID,SchoolName,SystemName,GradeRange,SchoolType,Latitude,Longitude,LEAID",
      returnGeometry: "false",
      orderByFields: "SchoolName ASC",
      resultOffset: String(resultOffset),
      resultRecordCount: String(pageSize),
      f: "json",
    });

    const response = await fetch(`${schoolLookupLayerQueryUrl}?${queryParams}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    const features = data.features || [];

    allRows.push(...features.map((feature) => feature.attributes));

    if (features.length < pageSize) {
      break;
    }

    resultOffset += pageSize;
  }

  return allRows;
}

async function loadSchoolLookupFromArcGIS() {
  if (!selectOptionsList) {
    return;
  }

  try {
    selectedValue.textContent = "Loading schools...";

    if (selectTrigger) {
      selectTrigger.disabled = true;
    }

    const rows = await fetchAllSchoolLookupRowsFromArcGIS();

    buildDropdownFromCsvRows(rows);

    console.log("School lookup loaded from ArcGIS:", {
      rowCount: rows.length,
    });
  } catch (error) {
    console.error("Could not load school lookup from ArcGIS:", error);

    selectedValue.textContent = "Georgia Statewide";

    // Fallback to CSV while testing.
    loadSchoolLookupCsv();
  } finally {
    if (selectTrigger) {
      selectTrigger.disabled = false;
    }
  }
}

const approvedCourseLabels = new Set([
  "AP Computer Science A",
  "AP Computer Science Principles",

  "IB Computer Science Year 1",
  "IB Computer Science Year 2",
  "IB Computer Science, Year One",
  "IB Computer Science, Year Two",

  "Web Development",
  "Embedded Computing",
  "Game Design: Animation and Simulation",
  "Foundations of Artificial Intelligence",
  "Artificial Intelligence Concepts",
  "Artificial Intelligence Applications",
  "Introduction to Software Technology",
  "Cloud Computing",
  "Introduction to Hardware Technology",
  "Coding for Fintech",
  "Computer Science Principles",
  "Programming, Games, Apps, and Society",
  "Introduction to Cybersecurity",
  "Advanced Cybersecurity",

  "Foundations of Secure Information Systems",
  "Foundations of Computer Programming",
  "Foundations of Interactive Design",
  "MS Computer Science I",
  "MS Computer Science II",
]);

function isApprovedCourseLabel(label) {
  return approvedCourseLabels.has(String(label || "").trim());
}

const otherCourseFields = [
  { field: "IB_ONE", label: "IB Computer Science, Year One" },
  { field: "IB_TWO", label: "IB Computer Science, Year Two" },
  { field: "CSP", label: "Computer Science Principles" },
  { field: "PGAS", label: "Programming, Games, Apps, and Society" },
  { field: "WEBDEV", label: "Web Development" },
  { field: "EMBCOMP", label: "Embedded Computing" },
  { field: "GDAAS", label: "Game Design: Animation and Simulation" },
  { field: "CYBERSEC", label: "Introduction to Cybersecurity" },
  { field: "ADVCYBER", label: "Advanced Cybersecurity" },
  { field: "FINTECH", label: "Coding for Fintech" },
  { field: "PYTHON", label: "Introduction to Python" },
  { field: "INTROSW", label: "Introduction to Software Technology" },
  { field: "INTRODIG", label: "Introduction to Digital Technology" },
  { field: "INTROHARD", label: "Introduction to Hardware Technology" },
];

function escapeSqlValue(value) {
  return String(value || "").replaceAll("'", "''");
}

function isAvailable(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return false;
  }

  return !["no", "n", "0", "false", "null", "none", "unavailable"].includes(
    normalized,
  );
}

function getApprovedCourseAsterisk(targetId) {
  return `<button
    class="inline-info-link"
    type="button"
    data-info-target="${targetId}"
    aria-label="Show approved Georgia CS course list note"
  >*</button>`;
}

function formatApprovedAvailability(value, targetId, courseLabel) {
  if (!isAvailable(value)) {
    return "Unavailable";
  }

  if (isApprovedCourseLabel(courseLabel)) {
    return `Available${getApprovedCourseAsterisk(targetId)}`;
  }

  return "Available";
}

function formatApprovedCourseLabels(courseLabels, targetId) {
  if (!courseLabels || courseLabels.length === 0) {
    return "None listed";
  }

  return courseLabels
    .map((label) => {
      if (isApprovedCourseLabel(label)) {
        return `${label}${getApprovedCourseAsterisk(targetId)}`;
      }

      return label;
    })
    .join(", ");
}

function formatWholeNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  return Math.round(number).toLocaleString();
}

function formatPercent(value) {
  let number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  if (Math.abs(number) <= 1) {
    number = number * 100;
  }

  return `${number.toFixed(2).replace(/\.?0+$/, "")}%`;
}

function formatDecimal(value, digits = 2) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  return number.toFixed(digits).replace(/\.?0+$/, "");
}

/* Benchmark / comparison helpers */

let statewideComparisonFeaturesPromise = null;

const comparisonCourseFields = [
  { field: "APCSA", label: "AP Computer Science A" },
  { field: "APCSP", label: "AP Computer Science Principles" },
  ...otherCourseFields,
];

const comparisonOutFields = [
  "SystemName",
  "SchoolType",
  "StudentCou",
  "NumCSEnrol",
  "NumCSCours",
  "NumApprove",
  "NumCSTeach",
  "NumCategor",
  "NumCateg_1",
  "NumCateg_2",
  "NumCateg_3",
  "RatioCStoSchool",
  "RatioCSTeacherToStudent",
  ...comparisonCourseFields.map((course) => course.field),
].join(",");

function toFiniteNumber(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

const schoolTypePluralLabels = {
  E: "elementary schools",
  H: "high schools",
  M: "middle schools",
  K12: "K-12 schools",
};

function getSchoolTypePluralLabel(schoolType) {
  return schoolTypePluralLabels[schoolType] || "schools";
}

function getApprovedCourseVerb(value) {
  const number = toFiniteNumber(value);

  return number === 1 ? "was" : "were";
}

function getCourseUnit(value) {
  const number = toFiniteNumber(value);

  return number === 1 ? "course" : "courses";
}

function formatCourseAverageSentence(schoolType, averageCourseCount) {
  const average = toFiniteNumber(averageCourseCount);
  const schoolTypeLabel = getSchoolTypePluralLabel(schoolType);

  if (average === null) {
    return `On average, ${schoolTypeLabel} in Georgia had -- computer science courses available.`;
  }

  const formattedAverage = formatDecimal(average, 1);
  const courseUnit = getCourseUnit(average);

  return `On average, ${schoolTypeLabel} in Georgia had ${formattedAverage} computer science ${courseUnit} available.`;
}

function safeDivide(numerator, denominator) {
  const top = toFiniteNumber(numerator);
  const bottom = toFiniteNumber(denominator);

  if (top === null || bottom === null || bottom === 0) {
    return null;
  }

  return top / bottom;
}

function formatEnrollmentIntensity(totalEnrollment, csEnrollments) {
  const enrollmentRate = safeDivide(csEnrollments, totalEnrollment);

  if (enrollmentRate === null) {
    return "--";
  }

  return `${formatDecimal(enrollmentRate * 100, 2)}%`;
}

/* Readiness Component B:
   CS enrollments / total enrollment compared with the
   75th percentile among comparable schools.
*/

function toReadinessNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function clampReadinessScore(value) {
  const number = toReadinessNumber(value);

  // Unavailable components receive 0.
  if (number === null) {
    return 0;
  }

  return Math.max(0, Math.min(100, number));
}

function getEnrollmentSizeGroup(totalEnrollment) {
  const enrollment = toReadinessNumber(totalEnrollment);

  if (enrollment === null || enrollment < 0) {
    return null;
  }

  // This assigns exactly 500 students to the small group,
  // avoiding a gap between the size categories.
  if (enrollment <= 500) {
    return "small";
  }

  if (enrollment <= 1000) {
    return "medium";
  }

  return "large";
}

function calculatePercentile(values, percentile) {
  const sortedValues = values
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (sortedValues.length === 0) {
    return null;
  }

  const position = (sortedValues.length - 1) * percentile;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);

  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  }

  const weight = position - lowerIndex;

  return (
    sortedValues[lowerIndex] * (1 - weight) + sortedValues[upperIndex] * weight
  );
}

function getReadinessEnrollmentRatio(attributes) {
  const totalEnrollment = toReadinessNumber(attributes.StudentCou);
  const csEnrollments = toReadinessNumber(attributes.NumCSEnrol);

  if (
    totalEnrollment === null ||
    totalEnrollment <= 0 ||
    csEnrollments === null ||
    csEnrollments < 0
  ) {
    return null;
  }

  return csEnrollments / totalEnrollment;
}

function calculateSchoolReadinessB(attributes, statewideFeatures = []) {
  const schoolRatio = getReadinessEnrollmentRatio(attributes);
  const schoolType = attributes.SchoolType;
  const schoolSizeGroup = getEnrollmentSizeGroup(attributes.StudentCou);

  if (
    schoolRatio === null ||
    !schoolType ||
    !schoolSizeGroup ||
    !Array.isArray(statewideFeatures)
  ) {
    return {
      score: 0,
      schoolRatio,
      peerBenchmark: null,
      peerCount: 0,
    };
  }

  const peerRatios = statewideFeatures
    .map((feature) => feature.attributes || {})
    .filter((peerAttributes) => {
      return (
        peerAttributes.SchoolType === schoolType &&
        getEnrollmentSizeGroup(peerAttributes.StudentCou) === schoolSizeGroup
      );
    })
    .map((peerAttributes) => {
      return getReadinessEnrollmentRatio(peerAttributes);
    })
    .filter((value) => value !== null);

  const peerBenchmark = calculatePercentile(peerRatios, 0.75);

  // No valid benchmark means the B component receives 0.
  if (peerBenchmark === null) {
    return {
      score: 0,
      schoolRatio,
      peerBenchmark: null,
      peerCount: peerRatios.length,
    };
  }

  let score = 0;

  if (peerBenchmark === 0) {
    // A positive ratio exceeds a peer benchmark of zero.
    score = schoolRatio > 0 ? 100 : 0;
  } else {
    score = clampReadinessScore((schoolRatio / peerBenchmark) * 100);
  }

  return {
    score,
    schoolRatio,
    peerBenchmark,
    peerCount: peerRatios.length,
  };
}

const readinessComponentLetters = ["A", "B", "C", "D", "E"];
const readinessMinimumGroupSize = 15;

function getComparableReadinessPeers(attributes, statewideFeatures = []) {
  const schoolType = attributes.SchoolType;
  const schoolSizeGroup = getEnrollmentSizeGroup(attributes.StudentCou);

  if (!schoolType || !schoolSizeGroup || !Array.isArray(statewideFeatures)) {
    return [];
  }

  return statewideFeatures
    .map((feature) => getFeatureAttributes(feature))
    .filter((peerAttributes) => {
      return (
        peerAttributes.SchoolType === schoolType &&
        getEnrollmentSizeGroup(peerAttributes.StudentCou) === schoolSizeGroup
      );
    });
}

/* A — Course Access */

function calculateSchoolReadinessA(attributes, statewideFeatures = []) {
  const schoolType = normalizeReadinessSchoolType(attributes.SchoolType);

  /*
    Elementary access:
    Any reported CS course demonstrates course access.

    Course quantity is evaluated separately in Component C,
    so A and C do not use the same formula.
  */
  if (schoolType === "E") {
    const schoolCourseCount = toReadinessNumber(attributes.NumCSCours);

    if (schoolCourseCount === null || schoolCourseCount < 0) {
      return {
        score: 0,
        schoolValue: null,
        peerBenchmark: null,
        peerCount: 0,
        method: "elementaryCourseAccess",
      };
    }

    return {
      score: schoolCourseCount > 0 ? 100 : 0,
      schoolValue: schoolCourseCount,
      peerBenchmark: null,
      peerCount: 0,
      method: "elementaryCourseAccess",
    };
  }

  /*
    Middle, high, and K-12 access:
    Compare approved-course count with the 75th percentile
    among comparable schools.
  */
  const schoolApprovedCourses = toReadinessNumber(attributes.NumApprove);

  if (schoolApprovedCourses === null || schoolApprovedCourses < 0) {
    return {
      score: 0,
      schoolValue: null,
      peerBenchmark: null,
      peerCount: 0,
      method: "approvedCourseBenchmark",
    };
  }

  const peerValues = getComparableReadinessPeers(attributes, statewideFeatures)
    .map((peerAttributes) => {
      return toReadinessNumber(peerAttributes.NumApprove);
    })
    .filter((value) => {
      return value !== null && value >= 0;
    });

  const peerBenchmark = calculatePercentile(peerValues, 0.75);

  if (peerBenchmark === null) {
    return {
      score: 0,
      schoolValue: schoolApprovedCourses,
      peerBenchmark: null,
      peerCount: peerValues.length,
      method: "approvedCourseBenchmark",
    };
  }

  const score =
    peerBenchmark === 0
      ? schoolApprovedCourses > 0
        ? 100
        : 0
      : clampReadinessScore((schoolApprovedCourses / peerBenchmark) * 100);

  return {
    score,
    schoolValue: schoolApprovedCourses,
    peerBenchmark,
    peerCount: peerValues.length,
    method: "approvedCourseBenchmark",
  };
}

/* C — Course Progression */

/*
  Current-data progression proxies.

  These mappings use the individual course fields currently available
  in the ArcGIS layer. Update these arrays later if additional course
  fields or explicit pathway-completion fields become available.
*/

const readinessProgressionCourseFields = {
  foundational: ["INTROSW", "INTROHARD", "CSP", "CYBERSEC"],

  intermediate: ["PGAS", "WEBDEV", "EMBCOMP", "GDAAS", "FINTECH"],

  advanced: ["APCSA", "APCSP", "IB_ONE", "IB_TWO", "ADVCYBER"],
};

function normalizeReadinessSchoolType(value) {
  const schoolType = String(value || "")
    .trim()
    .toUpperCase();

  if (["E", "ELEMENTARY", "ELEMENTARY SCHOOL"].includes(schoolType)) {
    return "E";
  }

  if (["M", "MIDDLE", "MIDDLE SCHOOL"].includes(schoolType)) {
    return "M";
  }

  if (["H", "HIGH", "HIGH SCHOOL"].includes(schoolType)) {
    return "H";
  }

  if (["K12", "K-12", "K–12"].includes(schoolType)) {
    return "K12";
  }

  return null;
}

function hasAnyProgressionCourse(attributes, courseFields) {
  return courseFields.some((field) => {
    return isAvailable(attributes[field]);
  });
}

function getApprovedProgressionCourseCount(attributes) {
  const reportedCount = toReadinessNumber(attributes.NumApprove);

  if (reportedCount !== null && reportedCount >= 0) {
    return reportedCount;
  }

  /*
    Fallback when NumApprove is unavailable:
    count approved individual course fields available
    in the current layer.
  */
  return comparisonCourseFields.filter((course) => {
    return (
      isApprovedCourseLabel(course.label) &&
      isAvailable(attributes[course.field])
    );
  }).length;
}

function calculateSchoolReadinessC(attributes, statewideFeatures = []) {
  const schoolType = normalizeReadinessSchoolType(attributes.SchoolType);

  const approvedCourseCount = getApprovedProgressionCourseCount(attributes);

  let milestones = [];

  /*
    High schools and K-12 schools

    25 points:
    1. Foundational course
    2. Intermediate/programming course
    3. Advanced course
    4. At least three approved courses
  */
  if (schoolType === "H" || schoolType === "K12") {
    milestones = [
      {
        key: "foundational",
        met: hasAnyProgressionCourse(
          attributes,
          readinessProgressionCourseFields.foundational,
        ),
      },
      {
        key: "intermediate",
        met: hasAnyProgressionCourse(
          attributes,
          readinessProgressionCourseFields.intermediate,
        ),
      },
      {
        key: "advanced",
        met: hasAnyProgressionCourse(
          attributes,
          readinessProgressionCourseFields.advanced,
        ),
      },
      {
        key: "threeCourseSequence",
        met: approvedCourseCount >= 3,
      },
    ];
  } else if (schoolType === "M" || schoolType === "E") {
    /*
    Middle and elementary schools use total CS course count
    as a course-breadth proxy because individual course names
    and sequence information are not consistently available.

    Schools are compared only with peers of the same school
    type and enrollment-size group.
  */

    const schoolCourseCount = toReadinessNumber(attributes.NumCSCours);

    const peerCourseCounts = getComparableReadinessPeers(
      attributes,
      statewideFeatures,
    )
      .map((peerAttributes) => {
        return toReadinessNumber(peerAttributes.NumCSCours);
      })
      .filter((value) => {
        return value !== null && value >= 0;
      });

    const peerBenchmark = calculatePercentile(peerCourseCounts, 0.75);

    if (schoolCourseCount === null || peerBenchmark === null) {
      return {
        score: 0,
        schoolType,
        courseCount: schoolCourseCount,
        peerBenchmark,
        peerCount: peerCourseCounts.length,
        method: "courseBreadthProxy",
      };
    }

    const score =
      peerBenchmark === 0
        ? schoolCourseCount > 0
          ? 100
          : 0
        : clampReadinessScore((schoolCourseCount / peerBenchmark) * 100);

    return {
      score,
      schoolType,
      courseCount: schoolCourseCount,
      peerBenchmark,
      peerCount: peerCourseCounts.length,
      method: "courseBreadthProxy",
    };
  }

  /*
    Unknown or unavailable school type results in zero,
    following the unavailable-data scoring rule.
  */
  const milestonesMet = milestones.filter((milestone) => milestone.met).length;

  return {
    score: milestonesMet * 25,
    schoolType,
    approvedCourseCount,
    milestones,
    milestonesMet,
  };
}

/* D — Instructional Capacity */

function calculateSchoolReadinessD(attributes, statewideFeatures = []) {
  const csEnrollments = toReadinessNumber(attributes.NumCSEnrol);

  const csTeachers = toReadinessNumber(attributes.NumCSTeach);

  // Missing data, zero enrollments, or no teacher receives 0.
  if (
    csEnrollments === null ||
    csTeachers === null ||
    csEnrollments <= 0 ||
    csTeachers <= 0
  ) {
    return {
      score: 0,
      schoolRatio: null,
      peerBenchmark: null,
      peerCount: 0,
    };
  }

  const schoolRatio = csEnrollments / csTeachers;

  const peerRatios = getComparableReadinessPeers(attributes, statewideFeatures)
    .map((peerAttributes) => {
      const peerEnrollments = toReadinessNumber(peerAttributes.NumCSEnrol);

      const peerTeachers = toReadinessNumber(peerAttributes.NumCSTeach);

      if (
        peerEnrollments === null ||
        peerTeachers === null ||
        peerEnrollments <= 0 ||
        peerTeachers <= 0
      ) {
        return null;
      }

      return peerEnrollments / peerTeachers;
    })
    .filter((value) => value !== null);

  // A lower ratio is better, so use the 25th percentile.
  const peerBenchmark = calculatePercentile(peerRatios, 0.25);

  if (peerBenchmark === null || peerBenchmark <= 0) {
    return {
      score: 0,
      schoolRatio,
      peerBenchmark: null,
      peerCount: peerRatios.length,
    };
  }

  return {
    score: clampReadinessScore((peerBenchmark / schoolRatio) * 100),
    schoolRatio,
    peerBenchmark,
    peerCount: peerRatios.length,
  };
}

/* E — Participation Equity */

function toReadinessShare(value) {
  const number = toReadinessNumber(value);

  if (number === null || number < 0) {
    return null;
  }

  // Current demographic fields are percentages from 0–100.
  return number / 100;
}

function calculateParityDimension(attributes, fieldPairs) {
  const totalStudents = toReadinessNumber(attributes.StudentCou);

  const csEnrollments = toReadinessNumber(attributes.NumCSEnrol);

  if (
    totalStudents === null ||
    csEnrollments === null ||
    totalStudents <= 0 ||
    csEnrollments <= 0
  ) {
    return null;
  }

  const groups = fieldPairs
    .map((field) => {
      return {
        schoolShare: toReadinessShare(attributes[field.schoolField]),
        csShare: toReadinessShare(attributes[field.csField]),
      };
    })
    .filter((group) => {
      return group.schoolShare !== null && group.csShare !== null;
    });

  if (groups.length < 2) {
    return null;
  }

  // Conservatively make the dimension unavailable when an
  // estimated nonzero reporting group contains fewer than 15.
  const hasSuppressedGroup = groups.some((group) => {
    const estimatedSchoolCount = group.schoolShare * totalStudents;

    const estimatedCsCount = group.csShare * csEnrollments;

    return (
      (estimatedSchoolCount > 0 &&
        estimatedSchoolCount < readinessMinimumGroupSize) ||
      (estimatedCsCount > 0 && estimatedCsCount < readinessMinimumGroupSize)
    );
  });

  if (hasSuppressedGroup) {
    return null;
  }

  const schoolShareTotal = groups.reduce(
    (sum, group) => sum + group.schoolShare,
    0,
  );

  const csShareTotal = groups.reduce((sum, group) => sum + group.csShare, 0);

  if (schoolShareTotal <= 0 || csShareTotal <= 0) {
    return null;
  }

  const distributionDifference = groups.reduce((sum, group) => {
    const normalizedSchoolShare = group.schoolShare / schoolShareTotal;

    const normalizedCsShare = group.csShare / csShareTotal;

    return sum + Math.abs(normalizedCsShare - normalizedSchoolShare);
  }, 0);

  return clampReadinessScore(100 * (1 - 0.5 * distributionDifference));
}

function calculateSchoolReadinessE(attributes) {
  const raceParity = calculateParityDimension(
    attributes,
    raceDemographicFields,
  );

  const genderParity = calculateParityDimension(
    attributes,
    genderDemographicFields,
  );

  const availableScores = [raceParity, genderParity].filter((score) =>
    Number.isFinite(score),
  );

  const score =
    availableScores.length === 0
      ? 0
      : availableScores.reduce((sum, value) => sum + value, 0) /
        availableScores.length;

  return {
    score: clampReadinessScore(score),
    raceParity,
    genderParity,
  };
}

function setReadinessComponentScore(reportPrefix, componentLetter, score) {
  const normalizedScore = clampReadinessScore(score);

  const scoreElement = document.getElementById(
    `${reportPrefix}ReadinessComponent${componentLetter}`,
  );

  const barElement = document.getElementById(
    `${reportPrefix}ReadinessComponent${componentLetter}Bar`,
  );

  if (scoreElement) {
    scoreElement.textContent = formatDecimal(normalizedScore, 1);
  }

  if (barElement) {
    barElement.style.width = `${normalizedScore}%`;
  }
}

function calculateSchoolReadinessScores(attributes, statewideFeatures = []) {
  return {
    A: calculateSchoolReadinessA(attributes, statewideFeatures).score,

    B: calculateSchoolReadinessB(attributes, statewideFeatures).score,

    C: calculateSchoolReadinessC(attributes, statewideFeatures).score,

    D: calculateSchoolReadinessD(attributes, statewideFeatures).score,

    E: calculateSchoolReadinessE(attributes).score,
  };
}

function updateReadinessScoreDisplay(reportPrefix, scores) {
  readinessComponentLetters.forEach((letter) => {
    setReadinessComponentScore(reportPrefix, letter, scores[letter]);
  });

  const overallScore =
    readinessComponentLetters.reduce((sum, letter) => {
      return sum + clampReadinessScore(scores[letter]);
    }, 0) / readinessComponentLetters.length;

  setTextById(`${reportPrefix}ReadinessScore`, formatDecimal(overallScore, 1));

  return overallScore;
}

function resetReadinessScores(reportPrefix) {
  updateReadinessScoreDisplay(reportPrefix, {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  });
}

function updateSchoolReadinessScores(attributes, statewideFeatures = []) {
  const scores = calculateSchoolReadinessScores(attributes, statewideFeatures);

  const overallScore = updateReadinessScoreDisplay("school", scores);

  console.log("School readiness scores:", {
    ...scores,
    overallScore,
  });

  return overallScore;
}

function updateDistrictReadinessScores(
  districtFeatures,
  statewideFeatures = [],
) {
  const schoolScoreSets = (districtFeatures || []).map((feature) => {
    return calculateSchoolReadinessScores(
      getFeatureAttributes(feature),
      statewideFeatures,
    );
  });

  const districtScores = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  };

  if (schoolScoreSets.length > 0) {
    readinessComponentLetters.forEach((letter) => {
      districtScores[letter] =
        schoolScoreSets.reduce((sum, scores) => {
          return sum + clampReadinessScore(scores[letter]);
        }, 0) / schoolScoreSets.length;
    });
  }

  const overallScore = updateReadinessScoreDisplay("district", districtScores);

  console.log("District readiness scores:", {
    ...districtScores,
    overallScore,
    schoolCount: schoolScoreSets.length,
  });
}

function getFeatureAttributes(feature) {
  return feature && feature.attributes ? feature.attributes : {};
}

function getSumFromFeatures(features, field) {
  return features.reduce((sum, feature) => {
    const value = toFiniteNumber(getFeatureAttributes(feature)[field]);
    return sum + (value || 0);
  }, 0);
}

function getAverageFieldFromFeatures(features, field) {
  const values = features
    .map((feature) => toFiniteNumber(getFeatureAttributes(feature)[field]))
    .filter((value) => value !== null);

  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getRatioFromFeatureTotals(features, numeratorField, denominatorField) {
  const numerator = getSumFromFeatures(features, numeratorField);
  const denominator = getSumFromFeatures(features, denominatorField);

  return safeDivide(numerator, denominator);
}

function getEnrollmentTableValuesFromAttributes(attributes) {
  return {
    csEnrollments: formatWholeNumber(attributes.NumCSEnrol),

    // CS Enrollment/Total Enrollment =
    // CS course enrollments / total student enrollment
    csEnrollmentPercent: formatEnrollmentIntensity(
      attributes.StudentCou,
      attributes.NumCSEnrol,
    ),

    category1: formatWholeNumber(attributes.NumCategor),
    category2: formatWholeNumber(attributes.NumCateg_1),
    category3: formatWholeNumber(attributes.NumCateg_2),
    category4: formatWholeNumber(attributes.NumCateg_3),
  };
}

function getEnrollmentTableValuesFromFeatures(features) {
  if (!features || features.length === 0) {
    return {
      csEnrollments: "--",
      csEnrollmentPercent: "--",
      category1: "--",
      category2: "--",
      category3: "--",
      category4: "--",
    };
  }

  const totalStudents = getSumFromFeatures(features, "StudentCou");
  const csEnrollments = getSumFromFeatures(features, "NumCSEnrol");
  const category1 = getSumFromFeatures(features, "NumCategor");
  const category2 = getSumFromFeatures(features, "NumCateg_1");
  const category3 = getSumFromFeatures(features, "NumCateg_2");
  const category4 = getSumFromFeatures(features, "NumCateg_3");

  return {
    csEnrollments: formatWholeNumber(csEnrollments),

    // CS Enrollment/Total Enrollment =
    // CS course enrollments / total student enrollment
    csEnrollmentPercent: formatEnrollmentIntensity(
      totalStudents,
      csEnrollments,
    ),

    category1: formatWholeNumber(category1),
    category2: formatWholeNumber(category2),
    category3: formatWholeNumber(category3),
    category4: formatWholeNumber(category4),
  };
}

function buildSchoolEnrollmentTableValues(attributes, statewideFeatures = []) {
  const districtFeatures = getFeaturesForDistrict(
    statewideFeatures,
    attributes.SystemName || selectedDistrictName,
  );

  const schoolValues = getEnrollmentTableValuesFromAttributes(attributes);
  const districtValues = getEnrollmentTableValuesFromFeatures(districtFeatures);
  const stateValues = getEnrollmentTableValuesFromFeatures(statewideFeatures);

  return {
    schoolTableCsEnrollments: schoolValues.csEnrollments,
    districtTableCsEnrollments: districtValues.csEnrollments,
    stateTableCsEnrollments: stateValues.csEnrollments,

    schoolTableCsEnrollmentPercent: schoolValues.csEnrollmentPercent,
    districtTableCsEnrollmentPercent: districtValues.csEnrollmentPercent,
    stateTableCsEnrollmentPercent: stateValues.csEnrollmentPercent,

    schoolTableCategory1: schoolValues.category1,
    districtTableCategory1: districtValues.category1,
    stateTableCategory1: stateValues.category1,

    schoolTableCategory2: schoolValues.category2,
    districtTableCategory2: districtValues.category2,
    stateTableCategory2: stateValues.category2,

    schoolTableCategory3: schoolValues.category3,
    districtTableCategory3: districtValues.category3,
    stateTableCategory3: stateValues.category3,

    schoolTableCategory4: schoolValues.category4,
    districtTableCategory4: districtValues.category4,
    stateTableCategory4: stateValues.category4,
  };
}

function buildDistrictEnrollmentTableValues(
  districtFeatures,
  statewideFeatures = [],
) {
  const districtValues = getEnrollmentTableValuesFromFeatures(districtFeatures);
  const stateValues = getEnrollmentTableValuesFromFeatures(statewideFeatures);

  return {
    districtReportTableCsEnrollments: districtValues.csEnrollments,
    districtReportStateTableCsEnrollments: stateValues.csEnrollments,

    districtReportTableCsEnrollmentPercent: districtValues.csEnrollmentPercent,
    districtReportStateTableCsEnrollmentPercent:
      stateValues.csEnrollmentPercent,

    districtReportTableCategory1: districtValues.category1,
    districtReportStateTableCategory1: stateValues.category1,

    districtReportTableCategory2: districtValues.category2,
    districtReportStateTableCategory2: stateValues.category2,

    districtReportTableCategory3: districtValues.category3,
    districtReportStateTableCategory3: stateValues.category3,

    districtReportTableCategory4: districtValues.category4,
    districtReportStateTableCategory4: stateValues.category4,
  };
}

function formatBenchmarkComparison(currentValue, benchmarkValue) {
  const current = toFiniteNumber(currentValue);
  const benchmark = toFiniteNumber(benchmarkValue);

  if (current === null || benchmark === null || benchmark === 0) {
    return "--";
  }

  const percentDifference = ((current - benchmark) / benchmark) * 100;
  const absoluteDifference = Math.abs(percentDifference);

  if (absoluteDifference < 0.05) {
    return "about the same as";
  }

  const formattedDifference = formatDecimal(absoluteDifference, 1);
  const direction = percentDifference > 0 ? "higher than" : "lower than";

  return `${formattedDifference}% ${direction}`;
}

function normalizeToPercentValue(value) {
  const number = toFiniteNumber(value);

  if (number === null) {
    return null;
  }

  if (Math.abs(number) <= 1) {
    return number * 100;
  }

  return number;
}

function formatPercentagePointComparison(currentValue, benchmarkValue) {
  const currentPercent = normalizeToPercentValue(currentValue);
  const benchmarkPercent = normalizeToPercentValue(benchmarkValue);

  if (currentPercent === null || benchmarkPercent === null) {
    return "--";
  }

  const pointDifference = currentPercent - benchmarkPercent;
  const absoluteDifference = Math.abs(pointDifference);

  if (absoluteDifference < 0.05) {
    return "about the same as";
  }

  const formattedDifference = formatDecimal(absoluteDifference, 1);
  const direction = pointDifference > 0 ? "higher than" : "lower than";

  return `${formattedDifference} % ${direction}`;
}

function formatCountDifferenceComparison(
  currentValue,
  benchmarkValue,
  singularUnit = "course",
  pluralUnit = "courses",
) {
  const current = toFiniteNumber(currentValue);
  const benchmark = toFiniteNumber(benchmarkValue);

  if (current === null || benchmark === null) {
    return "--";
  }

  const difference = current - benchmark;
  const absoluteDifference = Math.abs(difference);

  if (absoluteDifference < 0.05) {
    return "about the same as";
  }

  const formattedDifference = formatDecimal(absoluteDifference, 1);
  const unit = absoluteDifference === 1 ? singularUnit : pluralUnit;
  const direction = difference > 0 ? "higher than" : "lower than";

  return `${formattedDifference} ${unit} ${direction}`;
}

function getCourseCountFromFeatures(features) {
  const courseLabels = new Set();

  features.forEach((feature) => {
    const attributes = getFeatureAttributes(feature);

    comparisonCourseFields.forEach((course) => {
      if (isAvailable(attributes[course.field])) {
        courseLabels.add(course.label);
      }
    });
  });

  return courseLabels.size;
}

function getAverageDistrictCourseCount(features) {
  const districtMap = new Map();

  features.forEach((feature) => {
    const attributes = getFeatureAttributes(feature);
    const districtName = attributes.SystemName || "District unavailable";

    if (!districtMap.has(districtName)) {
      districtMap.set(districtName, []);
    }

    districtMap.get(districtName).push(feature);
  });

  const districtCourseCounts = Array.from(districtMap.values()).map(
    (districtFeatures) => getCourseCountFromFeatures(districtFeatures),
  );

  if (districtCourseCounts.length === 0) {
    return null;
  }

  return (
    districtCourseCounts.reduce((sum, count) => sum + count, 0) /
    districtCourseCounts.length
  );
}

async function fetchAllComparisonFeaturesFromArcGIS() {
  if (statewideComparisonFeaturesPromise) {
    return statewideComparisonFeaturesPromise;
  }

  statewideComparisonFeaturesPromise = (async () => {
    const pageSize = 2000;
    let resultOffset = 0;
    const allFeatures = [];

    while (true) {
      const queryParams = new URLSearchParams({
        where: "1=1",
        outFields: comparisonOutFields,
        returnGeometry: "false",
        resultOffset: String(resultOffset),
        resultRecordCount: String(pageSize),
        f: "json",
      });

      const response = await fetch(
        `${schoolLookupLayerQueryUrl}?${queryParams}`,
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      const features = data.features || [];
      allFeatures.push(...features);

      if (features.length < pageSize) {
        break;
      }

      resultOffset += pageSize;
    }

    return allFeatures;
  })();

  return statewideComparisonFeaturesPromise;
}

function getFeaturesForSchoolType(features, schoolType) {
  if (!schoolType) {
    return features;
  }

  return features.filter((feature) => {
    return getFeatureAttributes(feature).SchoolType === schoolType;
  });
}

function getFeaturesForDistrict(features, districtName) {
  if (!districtName) {
    return [];
  }

  return features.filter((feature) => {
    return getFeatureAttributes(feature).SystemName === districtName;
  });
}

/* Building CS Opportunities Together recommendation logic */

// Suggestions.docx does not define the numerical high-readiness cutoff.
// Change this value if a different threshold is approved.
const highReadinessRecommendationThreshold = 75;

const schoolWhyCsMattersText = {
  E: "Early computing experiences help our students build creativity, recognize patterns, solve problems, and explain their thinking. Schools and families can work together to support these skills through classroom activities, clubs, and age-appropriate learning at home.",
  M: "Middle school is an important time for our students to explore computing, grow their confidence, and discover new interests. Supportive and welcoming opportunities can help every student see that computing is something they can learn and enjoy.",
  H: "High school computing courses help our students build practical problem-solving skills while exploring future opportunities in college, technical education, and a wide range of careers. These experiences can help students better understand how computing connects to the subjects and goals they already care about.",
  K12: "Providing computing experiences across grade levels gives our students the chance to grow their skills over time, from early exploration and creativity to more advanced problem-solving, programming, and real-world applications.",
};

const majorCityDistrictPatterns = [
  "atlanta public",
  "richmond county",
  "muscogee county",
  "savannah-chatham",
  "bibb county",
  "clarke county",
];

function hasRecommendationNumber(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return false;
  }

  return Number.isFinite(Number(value));
}

function getRecommendationNumber(value) {
  return hasRecommendationNumber(value) ? Number(value) : null;
}

function addRecommendation(recommendations, category, text) {
  if (!text) {
    return;
  }

  recommendations.push({
    category,
    text,
  });
}

function renderRecommendations(container, recommendations, emptyMessage) {
  if (!container) {
    return;
  }

  if (!recommendations || recommendations.length === 0) {
    container.innerHTML = `
      <p class="recommendation-empty">${escapeHtml(emptyMessage)}</p>
    `;
    return;
  }

  container.innerHTML = recommendations
    .map((recommendation) => {
      return `
        <section class="recommendation-item">
          <h4>${escapeHtml(recommendation.category)}</h4>
          <p>${escapeHtml(recommendation.text)}</p>
        </section>
      `;
    })
    .join("");
}

function getSchoolComparisonPool(attributes, statewideFeatures = []) {
  const schoolTypeFeatures = getFeaturesForSchoolType(
    statewideFeatures,
    attributes.SchoolType,
  );

  return schoolTypeFeatures.length > 0 ? schoolTypeFeatures : statewideFeatures;
}

function getAverageDistrictFieldTotal(features, fieldName) {
  const districtTotals = new Map();

  features.forEach((feature) => {
    const attributes = getFeatureAttributes(feature);
    const districtName = attributes.SystemName;

    if (!districtName) {
      return;
    }

    const value = getRecommendationNumber(attributes[fieldName]);

    if (!districtTotals.has(districtName)) {
      districtTotals.set(districtName, 0);
    }

    if (value !== null) {
      districtTotals.set(
        districtName,
        districtTotals.get(districtName) + value,
      );
    }
  });

  if (districtTotals.size === 0) {
    return null;
  }

  return (
    Array.from(districtTotals.values()).reduce((sum, value) => {
      return sum + value;
    }, 0) / districtTotals.size
  );
}

function getAverageCourseCountForSchoolGroup(features) {
  return getAverageFieldFromFeatures(features, "NumCSCours");
}

function isAtlantaSchool(attributes) {
  const districtName = String(
    attributes.SystemName || selectedDistrictName || "",
  ).toLowerCase();

  return districtName.includes("atlanta public");
}

function isInMajorCity(attributes) {
  const districtName = String(
    attributes.SystemName || selectedDistrictName || "",
  ).toLowerCase();

  return majorCityDistrictPatterns.some((pattern) => {
    return districtName.includes(pattern);
  });
}

function hasIncompleteSchoolRecommendationData(
  attributes,
  statewideFeatures = [],
) {
  const requiredNumberFields = [
    "StudentCou",
    "NumCSCours",
    "NumCSTeach",
    "NumCSEnrol",
  ];

  return (
    !normalizeReadinessSchoolType(attributes.SchoolType) ||
    requiredNumberFields.some((fieldName) => {
      return !hasRecommendationNumber(attributes[fieldName]);
    }) ||
    !Array.isArray(statewideFeatures) ||
    statewideFeatures.length === 0
  );
}

function buildSchoolRecommendations(
  attributes,
  statewideFeatures = [],
  overallReadinessScore = null,
) {
  const recommendations = [];

  const schoolType = normalizeReadinessSchoolType(attributes.SchoolType);

  const comparisonPool = getSchoolComparisonPool(attributes, statewideFeatures);

  addRecommendation(
    recommendations,
    "Why CS Matters",
    schoolWhyCsMattersText[schoolType] || schoolWhyCsMattersText.K12,
  );

  const courseCount = getRecommendationNumber(attributes.NumCSCours);

  const stateAverageCourseCount =
    getAverageCourseCountForSchoolGroup(comparisonPool);

  if (courseCount === 0) {
    if (schoolType === "E") {
      addRecommendation(
        recommendations,
        "Course Access",
        "Every school starts somewhere. A full CS course may not need to be your first step. We can help you explore playful, age-appropriate computing activities that can fit into existing classes, enrichment periods, library programs, or family events.",
      );
    } else {
      addRecommendation(
        recommendations,
        "Course Access",
        "Every school starts somewhere. We can help you explore a manageable first step—such as an introductory course, an after-school program, or an online option through Georgia Virtual School—while planning the curriculum, staffing, and support needed to build a local program.",
      );
    }
  }

  if (courseCount === 1) {
    addRecommendation(
      recommendations,
      "Course Access",
      "Your school has already created an important starting point. We can help you explore how to strengthen the course, make more students aware of it, and create a next step for students who want to continue learning.",
    );

    if (schoolType === "H") {
      addRecommendation(
        recommendations,
        "Student Leadership",
        "Your school may be ready to establish a Computer Science Honor Society, if it does not already have one, where students can develop leadership skills, engage in service, and build a stronger sense of belonging in computing.",
      );
    }
  }

  if (
    courseCount !== null &&
    stateAverageCourseCount !== null &&
    courseCount > stateAverageCourseCount
  ) {
    addRecommendation(
      recommendations,
      "Course Pathway",
      "Your school has built a strong foundation. We can help you review how the courses connect, identify any gaps in the pathway, and consider how more students can participate and progress.",
    );
  }

  if (
    schoolType === "H" &&
    isAvailable(attributes.APCSA) &&
    isAvailable(attributes.APCSP)
  ) {
    addRecommendation(
      recommendations,
      "Advanced Opportunities",
      "Some students may be ready for college-level computing. We can help families explore advanced options such as Georgia Tech’s online dual-enrollment CS courses (Distance Computer Science Program) and understand the eligibility and prerequisite requirements.",
    );
  }

  const teacherCount = getRecommendationNumber(attributes.NumCSTeach);

  if (teacherCount === 0) {
    addRecommendation(
      recommendations,
      "Teacher Capacity",
      "Starting or expanding a computing program often begins with supporting educators. Our data do not currently identify a CS teacher at your school. Reach out to us, and we can help you explore professional learning, curriculum options, instructional resources, and a realistic plan for building local teaching capacity. Constellations is recognized by CS4GA as a professional-learning provider supporting Georgia CS teachers.",
    );
  } else if (teacherCount === 1) {
    addRecommendation(
      recommendations,
      "Teacher Capacity",
      "Your CS program may depend heavily on one educator. Reach out to us, and we can help you strengthen the program through professional learning, peer connections, curriculum and instructional resources, and preparation for additional educators. Constellations is recognized by CS4GA as a professional-learning provider supporting Georgia CS teachers.",
    );
  }

  if (
    Number.isFinite(overallReadinessScore) &&
    overallReadinessScore >= highReadinessRecommendationThreshold
  ) {
    addRecommendation(
      recommendations,
      "Readiness",
      "Your school appears positioned to lead. Consider documenting what is working, strengthening the program further, and sharing successful practices with nearby schools.",
    );
  }

  if (schoolType === "H" && isAtlantaSchool(attributes)) {
    addRecommendation(
      recommendations,
      "Local Opportunity",
      "Some of your students may benefit from opportunities such as BridgeUP STEM at the Constellations. BridgeUP is designed for eligible Atlanta-area students in grades 10–12 who are first-generation or low-income and have had limited access to coding. It can help families explore current or future program cycles and determine whether the opportunity matches their interests and eligibility.",
    );
  }

  if (!isInMajorCity(attributes)) {
    addRecommendation(
      recommendations,
      "Geographic Access",
      "Your school may be part of a broader geographic gap in computing access. You may want to consider strengthening your school’s CS opportunities by exploring virtual learning through Georgia Virtual School courses, partnering with nearby schools, working with local libraries or universities, or creating after-school programs for students.",
    );
  }

  const schoolParticipation = safeDivide(
    attributes.NumCSEnrol,
    attributes.StudentCou,
  );

  const matchingSchoolTypeParticipation = getRatioFromFeatureTotals(
    comparisonPool,
    "NumCSEnrol",
    "StudentCou",
  );

  if (
    schoolParticipation !== null &&
    matchingSchoolTypeParticipation !== null &&
    schoolParticipation < matchingSchoolTypeParticipation
  ) {
    addRecommendation(
      recommendations,
      "Participation",
      "Offering courses does not always mean students are aware of or able to access them. We can help you examine possible barriers related to scheduling, recruitment, prerequisites, and student awareness.",
    );
  }

  if (hasIncompleteSchoolRecommendationData(attributes, statewideFeatures)) {
    addRecommendation(
      recommendations,
      "Data Review",
      "Some information may need to be confirmed before choosing the next step. We can help your school review the available data and identify what should be verified regarding courses, teachers, or student access.",
    );
  }

  return recommendations;
}

function hasIncompleteDistrictRecommendationData(
  districtFeatures,
  statewideFeatures = [],
) {
  const requiredNumberFields = [
    "StudentCou",
    "NumCSCours",
    "NumCSTeach",
    "NumCSEnrol",
  ];

  return (
    !Array.isArray(districtFeatures) ||
    districtFeatures.length === 0 ||
    !Array.isArray(statewideFeatures) ||
    statewideFeatures.length === 0 ||
    districtFeatures.some((feature) => {
      const attributes = getFeatureAttributes(feature);

      return requiredNumberFields.some((fieldName) => {
        return !hasRecommendationNumber(attributes[fieldName]);
      });
    })
  );
}

function buildDistrictRecommendations(
  districtFeatures,
  statewideFeatures = [],
) {
  const recommendations = [];

  addRecommendation(
    recommendations,
    "Why CS Matters",
    "Computer science helps our students build creativity, problem-solving skills, and confidence while preparing them to participate in a world increasingly shaped by technology. By building connected opportunities across grade levels, districts can help more students discover computing and continue developing their skills over time.",
  );

  const districtCourseCount = getCourseCountFromFeatures(districtFeatures);

  const averageDistrictCourseCount =
    getAverageDistrictCourseCount(statewideFeatures);

  if (
    averageDistrictCourseCount !== null &&
    districtCourseCount < averageDistrictCourseCount
  ) {
    addRecommendation(
      recommendations,
      "Course Access",
      "Your district currently provides fewer CS opportunities than the statewide average. We can help you identify where the largest gaps exist and explore a manageable, phased approach to expanding access.",
    );
  } else if (
    averageDistrictCourseCount !== null &&
    districtCourseCount > averageDistrictCourseCount
  ) {
    addRecommendation(
      recommendations,
      "Course Access",
      "Your district has built a strong foundation for CS education. We can help you look beyond course availability to examine pathways, participation, teacher capacity, and long-term program sustainability.",
    );
  }

  const highSchoolFeatures = districtFeatures.filter((feature) => {
    const schoolType = normalizeReadinessSchoolType(
      getFeatureAttributes(feature).SchoolType,
    );

    return schoolType === "H" || schoolType === "K12";
  });

  const earlyGradeFeatures = districtFeatures.filter((feature) => {
    const schoolType = normalizeReadinessSchoolType(
      getFeatureAttributes(feature).SchoolType,
    );

    return ["E", "M", "K12"].includes(schoolType);
  });

  const hasHighSchool = highSchoolFeatures.length > 0;

  const hasDistrictApCourse = highSchoolFeatures.some((feature) => {
    const attributes = getFeatureAttributes(feature);

    return isAvailable(attributes.APCSA) || isAvailable(attributes.APCSP);
  });

  if (hasHighSchool && !hasDistrictApCourse) {
    addRecommendation(
      recommendations,
      "Advanced Opportunities",
      "Prepared high school students may benefit from advanced or dual-enrollment opportunities. District counselors may want to share information about Georgia Tech’s Distance Computer Science Program, which offers online, asynchronous college-level CS courses to eligible students.",
    );
  } else if (hasHighSchool && hasDistrictApCourse) {
    addRecommendation(
      recommendations,
      "Advanced Opportunities",
      "For students ready to continue beyond existing high-school courses, consider promoting advanced and dual-enrollment options such as Georgia Tech’s Distance Computer Science Program.",
    );
  }

  const districtTeacherTotal = districtFeatures.reduce((sum, feature) => {
    const teacherCount = getRecommendationNumber(
      getFeatureAttributes(feature).NumCSTeach,
    );

    return sum + (teacherCount === null ? 0 : teacherCount);
  }, 0);

  const averageDistrictTeacherTotal = getAverageDistrictFieldTotal(
    statewideFeatures,
    "NumCSTeach",
  );

  if (
    averageDistrictTeacherTotal !== null &&
    districtTeacherTotal < averageDistrictTeacherTotal
  ) {
    addRecommendation(
      recommendations,
      "Teacher Capacity",
      "Building sustainable CS programs begins with supporting educators. Constellations can support districts through professional learning, instructional resources, and capacity-building for Georgia CS teachers.",
    );
  } else if (
    averageDistrictTeacherTotal !== null &&
    districtTeacherTotal > averageDistrictTeacherTotal
  ) {
    addRecommendation(
      recommendations,
      "Teacher Capacity",
      "Your district has built a strong base of CS educators. Consider creating a professional learning community where teachers can align courses, share materials, mentor new educators, and document successful practices. Constellations can support this work by strengthening professional learning, teacher collaboration, and instructional capacity across the district.",
    );
  }

  const districtParticipation = getRatioFromFeatureTotals(
    districtFeatures,
    "NumCSEnrol",
    "StudentCou",
  );

  const statewideParticipation = getRatioFromFeatureTotals(
    statewideFeatures,
    "NumCSEnrol",
    "StudentCou",
  );

  if (
    districtParticipation !== null &&
    statewideParticipation !== null &&
    districtParticipation < statewideParticipation
  ) {
    addRecommendation(
      recommendations,
      "Participation",
      "Offering courses does not always mean students are aware of or able to access them. Consider examining possible barriers related to scheduling, recruitment, prerequisites, and student awareness.",
    );
  } else if (
    districtParticipation !== null &&
    statewideParticipation !== null &&
    districtParticipation >= statewideParticipation
  ) {
    addRecommendation(
      recommendations,
      "Participation",
      "A high share of students participate in CS in your district, suggesting strong student interest and access. Consider sustaining what is working, ensuring participation remains inclusive, and creating clear pathways for students who want to continue learning.",
    );
  }

  const statewideHighSchoolFeatures = statewideFeatures.filter((feature) => {
    const schoolType = normalizeReadinessSchoolType(
      getFeatureAttributes(feature).SchoolType,
    );

    return schoolType === "H" || schoolType === "K12";
  });

  const statewideEarlyGradeFeatures = statewideFeatures.filter((feature) => {
    const schoolType = normalizeReadinessSchoolType(
      getFeatureAttributes(feature).SchoolType,
    );

    return ["E", "M", "K12"].includes(schoolType);
  });

  const districtHighSchoolAverageCourseCount =
    getAverageCourseCountForSchoolGroup(highSchoolFeatures);

  const stateHighSchoolAverageCourseCount = getAverageCourseCountForSchoolGroup(
    statewideHighSchoolFeatures,
  );

  const districtEarlyGradeAverageCourseCount =
    getAverageCourseCountForSchoolGroup(earlyGradeFeatures);

  const stateEarlyGradeAverageCourseCount = getAverageCourseCountForSchoolGroup(
    statewideEarlyGradeFeatures,
  );

  const hasStrongHighSchoolOffering =
    districtHighSchoolAverageCourseCount !== null &&
    stateHighSchoolAverageCourseCount !== null &&
    districtHighSchoolAverageCourseCount > 0 &&
    districtHighSchoolAverageCourseCount >= stateHighSchoolAverageCourseCount;

  const hasEarlyGradeCourse =
    districtEarlyGradeAverageCourseCount !== null &&
    districtEarlyGradeAverageCourseCount > 0;

  const hasLimitedEarlyGradeOffering =
    districtEarlyGradeAverageCourseCount !== null &&
    stateEarlyGradeAverageCourseCount !== null &&
    districtEarlyGradeAverageCourseCount < stateEarlyGradeAverageCourseCount;

  const hasLimitedHighSchoolContinuation =
    districtHighSchoolAverageCourseCount !== null &&
    stateHighSchoolAverageCourseCount !== null &&
    districtHighSchoolAverageCourseCount < stateHighSchoolAverageCourseCount;

  if (
    hasHighSchool &&
    hasStrongHighSchoolOffering &&
    hasLimitedEarlyGradeOffering
  ) {
    addRecommendation(
      recommendations,
      "School-Level Pathways",
      "Your district has created high-school opportunities, but students may have limited exposure before they reach high school.",
    );
  }

  if (
    hasHighSchool &&
    hasEarlyGradeCourse &&
    hasLimitedHighSchoolContinuation
  ) {
    addRecommendation(
      recommendations,
      "School-Level Pathways",
      "Students in your district may begin exploring computing without having a clear opportunity to continue in advanced levels.",
    );
  }

  if (
    hasIncompleteDistrictRecommendationData(districtFeatures, statewideFeatures)
  ) {
    addRecommendation(
      recommendations,
      "Data Review",
      "Some information may need to be confirmed before determining your district’s next steps. We can help you review unexpected patterns and identify which course, teacher, school, or participation records should be verified.",
    );
  }

  return recommendations;
}

function updateSchoolRecommendations(
  attributes,
  statewideFeatures = [],
  overallReadinessScore = null,
) {
  const recommendations = buildSchoolRecommendations(
    attributes,
    statewideFeatures,
    overallReadinessScore,
  );

  renderRecommendations(
    schoolRecommendations,
    recommendations,
    "Select a school to view tailored recommendations.",
  );
}

function updateDistrictRecommendations(
  districtFeatures,
  statewideFeatures = [],
) {
  const recommendations = buildDistrictRecommendations(
    districtFeatures,
    statewideFeatures,
  );

  renderRecommendations(
    districtRecommendations,
    recommendations,
    "Select a district to view tailored recommendations.",
  );
}

function resetSchoolRecommendations(message) {
  renderRecommendations(
    schoolRecommendations,
    [],
    message || "Select a school to view tailored recommendations.",
  );
}

function resetDistrictRecommendations(message) {
  renderRecommendations(
    districtRecommendations,
    [],
    message || "Select a district to view tailored recommendations.",
  );
}

function buildSchoolComparisonValues(attributes, statewideFeatures) {
  const schoolTypeFeatures = getFeaturesForSchoolType(
    statewideFeatures,
    attributes.SchoolType,
  );

  const districtFeatures = getFeaturesForDistrict(
    statewideFeatures,
    attributes.SystemName || selectedDistrictName,
  );

  const comparisonPool =
    schoolTypeFeatures.length > 0 ? schoolTypeFeatures : statewideFeatures;

  const stateAverageCsCourses = getAverageFieldFromFeatures(
    comparisonPool,
    "NumCSCours",
  );

  const schoolEnrollmentIntensity = safeDivide(
    attributes.NumCSEnrol,
    attributes.StudentCou,
  );

  const stateEnrollmentIntensity = getRatioFromFeatureTotals(
    comparisonPool,
    "NumCSEnrol",
    "StudentCou",
  );

  const stateStudentTeacherRatio = getRatioFromFeatureTotals(
    comparisonPool,
    "NumCSEnrol",
    "NumCSTeach",
  );

  return {
    csCoursesComparison: formatCountDifferenceComparison(
      attributes.NumCSCours,
      stateAverageCsCourses,
      "course",
      "courses",
    ),
    csCourseAverageSentence: formatCourseAverageSentence(
      attributes.SchoolType,
      stateAverageCsCourses,
    ),
    csEnrollmentComparison: formatBenchmarkComparison(
      schoolEnrollmentIntensity,
      stateEnrollmentIntensity,
    ),
    studentTeacherRatioComparison: formatDecimal(stateStudentTeacherRatio),
  };
}

function buildDistrictComparisonValues(
  districtFeatures,
  statewideFeatures,
  districtCourseCount,
) {
  const districtEnrollmentIntensity = getRatioFromFeatureTotals(
    districtFeatures,
    "NumCSEnrol",
    "StudentCou",
  );

  const stateEnrollmentIntensity = getRatioFromFeatureTotals(
    statewideFeatures,
    "NumCSEnrol",
    "StudentCou",
  );

  const stateStudentTeacherRatio = getRatioFromFeatureTotals(
    statewideFeatures,
    "NumCSEnrol",
    "NumCSTeach",
  );

  const averageDistrictCourseCount =
    getAverageDistrictCourseCount(statewideFeatures);

  return {
    csCoursesComparison: formatCountDifferenceComparison(
      districtCourseCount,
      averageDistrictCourseCount,
      "course",
      "courses",
    ),
    csEnrollmentComparison: formatBenchmarkComparison(
      districtEnrollmentIntensity,
      stateEnrollmentIntensity,
    ),
    studentTeacherRatioComparison: formatDecimal(stateStudentTeacherRatio),
  };
}

/* Demographic chart helpers */

let raceEthnicityChart = null;
let districtRaceEthnicityChart = null;
let genderChart = null;
let districtGenderChart = null;

const raceDemographicFields = [
  {
    schoolField: "PercentAsi",
    csField: "CSPercen_1",
  },
  {
    schoolField: "PercentBla",
    csField: "CSPercentB",
  },
  {
    schoolField: "PercentHis",
    csField: "CSPercentH",
  },
  {
    schoolField: "PercentAme",
    csField: "CSPercentA",
  },
  {
    schoolField: "PercentWhi",
    csField: "CSPercentW",
  },
  {
    schoolField: "Percent2Or",
    csField: "CSPercent2",
  },
];

const genderDemographicFields = [
  {
    schoolField: "PercentMale",
    csField: "CSPercentM",
  },
  {
    schoolField: "PercentFemale",
    csField: "CSPercentF",
  },
];

function formatChartPercent(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Number(number.toFixed(2));
}

function getSchoolChartDataFromAttributes(attributes, fieldPairs) {
  return {
    schoolData: fieldPairs.map((field) =>
      formatChartPercent(attributes[field.schoolField]),
    ),
    csData: fieldPairs.map((field) =>
      formatChartPercent(attributes[field.csField]),
    ),
  };
}

function getWeightedAveragePercent(features, percentField, weightField) {
  let weightedTotal = 0;
  let totalWeight = 0;

  features.forEach((feature) => {
    const attributes = feature.attributes || {};
    const percent = Number(attributes[percentField]);
    const weight = Number(attributes[weightField]);

    if (Number.isFinite(percent) && Number.isFinite(weight) && weight > 0) {
      weightedTotal += percent * weight;
      totalWeight += weight;
    }
  });

  if (totalWeight === 0) {
    return 0;
  }

  return formatChartPercent(weightedTotal / totalWeight);
}

function getDistrictChartDataFromFeatures(features, fieldPairs) {
  return {
    schoolData: fieldPairs.map((field) =>
      getWeightedAveragePercent(features, field.schoolField, "StudentCou"),
    ),
    csData: fieldPairs.map((field) =>
      getWeightedAveragePercent(features, field.csField, "NumCSEnrol"),
    ),
  };
}

function updateDoubleBarChart(chart, schoolData, csData, maxValue = 100) {
  if (!chart) {
    return;
  }

  chart.data.datasets[0].data = schoolData;
  chart.data.datasets[1].data = csData;

  chart.options.scales.x.max = maxValue;

  chart.update();
}

function updateSchoolDemographicChartsFromAttributes(attributes) {
  const raceData = getSchoolChartDataFromAttributes(
    attributes,
    raceDemographicFields,
  );

  const genderData = getSchoolChartDataFromAttributes(
    attributes,
    genderDemographicFields,
  );

  updateDoubleBarChart(
    raceEthnicityChart,
    raceData.schoolData,
    raceData.csData,
  );
  updateDoubleBarChart(genderChart, genderData.schoolData, genderData.csData);
}

function updateDistrictDemographicChartsFromFeatures(features) {
  const raceData = getDistrictChartDataFromFeatures(
    features,
    raceDemographicFields,
  );

  const genderData = getDistrictChartDataFromFeatures(
    features,
    genderDemographicFields,
  );

  updateDoubleBarChart(
    districtRaceEthnicityChart,
    raceData.schoolData,
    raceData.csData,
  );

  updateDoubleBarChart(
    districtGenderChart,
    genderData.schoolData,
    genderData.csData,
  );
}

function getOtherCourses(attributes, targetId) {
  /*
    Include every individually mapped course that is available,
    regardless of whether it is on the GA DOE approved list.
  */
  const availableCourses = otherCourseFields
    .filter((course) => {
      return isAvailable(attributes[course.field]);
    })
    .map((course) => {
      return course.label;
    });

  if (availableCourses.length > 0) {
    return formatApprovedCourseLabels(availableCourses, targetId);
  }

  /*
    NumCSCours may report courses even when the layer does not
    provide their individual names.
  */
  const reportedCourseCount = toReadinessNumber(attributes.NumCSCours);

  if (reportedCourseCount !== null && reportedCourseCount > 0) {
    return `${formatWholeNumber(
      reportedCourseCount,
    )} courses reported; course names unavailable in the current dataset`;
  }

  return "None reported";
}

function buildSchoolSummaryDataFromAttributes(
  attributes,
  statewideFeatures = [],
) {
  const category3 = Number(attributes.NumCateg_2) || 0;
  const category4 = Number(attributes.NumCateg_3) || 0;

  const comparisonValues = buildSchoolComparisonValues(
    attributes,
    statewideFeatures,
  );

  const enrollmentTableValues = buildSchoolEnrollmentTableValues(
    attributes,
    statewideFeatures,
  );

  return {
    totalStudents: formatWholeNumber(attributes.StudentCou),
    csCourses: formatWholeNumber(attributes.NumCSCours),
    approvedCsCourses: formatWholeNumber(attributes.NumApprove),
    approvedCsCoursesVerb: getApprovedCourseVerb(attributes.NumApprove),
    csCourseAverageSentence: comparisonValues.csCourseAverageSentence,
    csTeachers: formatWholeNumber(attributes.NumCSTeach),
    csEnrollments: formatWholeNumber(attributes.NumCSEnrol),

    ...enrollmentTableValues,

    csCoursesComparison: comparisonValues.csCoursesComparison,
    apCsa: formatApprovedAvailability(
      attributes.APCSA,
      "schoolApprovedCourseNote",
      "AP Computer Science A",
    ),
    apCsp: formatApprovedAvailability(
      attributes.APCSP,
      "schoolApprovedCourseNote",
      "AP Computer Science Principles",
    ),
    otherCourses: getOtherCourses(attributes, "schoolApprovedCourseNote"),

    csEnrollmentPercent: formatEnrollmentIntensity(
      attributes.StudentCou,
      attributes.NumCSEnrol,
    ),
    csEnrollmentComparison: comparisonValues.csEnrollmentComparison,

    category1: formatWholeNumber(attributes.NumCategor),
    category2: formatWholeNumber(attributes.NumCateg_1),
    category3: formatWholeNumber(category3),
    category4: formatWholeNumber(category4),

    studentTeacherRatio: formatDecimal(
      safeDivide(attributes.NumCSEnrol, attributes.NumCSTeach),
    ),
    studentTeacherRatioComparison:
      comparisonValues.studentTeacherRatioComparison,
  };
}

async function querySchoolSummaryByWhere(whereClause) {
  const queryParams = new URLSearchParams({
    where: whereClause,
    outFields: "*",
    returnGeometry: "false",
    resultRecordCount: "1",
    f: "json",
  });

  const response = await fetch(`${schoolLookupLayerQueryUrl}?${queryParams}`);
  const data = await response.json();

  if (data.error) {
    console.error("ArcGIS school summary query error:", data.error);
    return null;
  }

  if (!data.features || data.features.length === 0) {
    return null;
  }

  return data.features[0];
}

async function loadSchoolSummaryFromArcGIS() {
  if (!selectedReportValue) {
    updateSchoolSummaryFromData(sampleSchoolSummaryData.default);
    resetReadinessScores("school");
    resetSchoolRecommendations();
    return;
  }

  const whereClauses = [];

  if (selectedSchoolId) {
    whereClauses.push(`FullID = '${escapeSqlValue(selectedSchoolId)}'`);
  }

  if (selectedReportValue && selectedDistrictName) {
    whereClauses.push(
      `SchoolName = '${escapeSqlValue(selectedReportValue)}' AND SystemName = '${escapeSqlValue(selectedDistrictName)}'`,
    );
  }

  if (selectedReportValue) {
    whereClauses.push(`SchoolName = '${escapeSqlValue(selectedReportValue)}'`);
  }

  try {
    let feature = null;
    let successfulWhereClause = null;

    for (const whereClause of whereClauses) {
      feature = await querySchoolSummaryByWhere(whereClause);

      if (feature) {
        successfulWhereClause = whereClause;
        break;
      }
    }

    if (!feature) {
      console.warn("No ArcGIS school summary found after all attempts:", {
        selectedSchoolId,
        selectedReportValue,
        selectedDistrictName,
        whereClauses,
      });

      updateSchoolSummaryFromData(sampleSchoolSummaryData.default);
      updateSchoolDemographicChartsFromAttributes({});
      resetReadinessScores("school");
      resetSchoolRecommendations(
        "The selected school’s recommendation data could not be loaded.",
      );
      return;
    }

    const attributes = feature.attributes;

    let statewideFeatures = [];

    try {
      statewideFeatures = await fetchAllComparisonFeaturesFromArcGIS();
    } catch (comparisonError) {
      console.warn(
        "Could not load statewide comparison data:",
        comparisonError,
      );
    }

    const schoolSummaryData = buildSchoolSummaryDataFromAttributes(
      attributes,
      statewideFeatures,
    );

    updateSchoolSummaryFromData(schoolSummaryData);
    updateSchoolDemographicChartsFromAttributes(attributes);

    const overallReadinessScore = updateSchoolReadinessScores(
      attributes,
      statewideFeatures,
    );

    updateSchoolRecommendations(
      attributes,
      statewideFeatures,
      overallReadinessScore,
    );

    console.log("Loaded school summary from ArcGIS:", {
      successfulWhereClause,
      attributes,
    });
  } catch (error) {
    console.error("Could not load school summary from ArcGIS:", error);
    updateSchoolSummaryFromData(sampleSchoolSummaryData.default);
    resetReadinessScores("school");
    resetSchoolRecommendations(
      "The selected school’s recommendation data could not be loaded.",
    );
  }
}

// District summary functions
const districtCourseFields = [
  { field: "APCSA", label: "AP Computer Science A" },
  { field: "APCSP", label: "AP Computer Science Principles" },
  ...otherCourseFields,
];

async function fetchDistrictSchoolFeaturesFromArcGIS() {
  if (!selectedDistrictName) {
    return [];
  }

  const pageSize = 2000;
  let resultOffset = 0;
  const allFeatures = [];

  while (true) {
    const queryParams = new URLSearchParams({
      where: `SystemName = '${escapeSqlValue(selectedDistrictName)}'`,
      outFields: "*",
      returnGeometry: "false",
      resultOffset: String(resultOffset),
      resultRecordCount: String(pageSize),
      f: "json",
    });

    const response = await fetch(`${schoolLookupLayerQueryUrl}?${queryParams}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    const features = data.features || [];
    allFeatures.push(...features);

    if (features.length < pageSize) {
      break;
    }

    resultOffset += pageSize;
  }

  return allFeatures;
}

function buildDistrictSummaryDataFromFeatures(
  features,
  statewideFeatures = [],
) {
  const totals = {
    totalStudents: 0,
    csTeachers: 0,
    csEnrollments: 0,
    category1: 0,
    category2: 0,
    category3: 0,
    category4: 0,
  };

  const availableCourseLabels = new Set();

  features.forEach((feature) => {
    const attributes = feature.attributes || {};

    totals.totalStudents += Number(attributes.StudentCou) || 0;
    totals.csTeachers += Number(attributes.NumCSTeach) || 0;
    totals.csEnrollments += Number(attributes.NumCSEnrol) || 0;
    totals.category1 += Number(attributes.NumCategor) || 0;
    totals.category2 += Number(attributes.NumCateg_1) || 0;
    totals.category3 += Number(attributes.NumCateg_2) || 0;
    totals.category4 += Number(attributes.NumCateg_3) || 0;

    districtCourseFields.forEach((course) => {
      if (isAvailable(attributes[course.field])) {
        availableCourseLabels.add(course.label);
      }
    });
  });

  const otherCoursesAvailable = [...availableCourseLabels].filter((label) => {
    return (
      label !== "AP Computer Science A" &&
      label !== "AP Computer Science Principles"
    );
  });

  const enrollmentIntensity = safeDivide(
    totals.csEnrollments,
    totals.totalStudents,
  );

  const studentTeacherRatio =
    totals.csTeachers > 0 ? totals.csEnrollments / totals.csTeachers : null;

  const comparisonValues = buildDistrictComparisonValues(
    features,
    statewideFeatures,
    availableCourseLabels.size,
  );

  const enrollmentTableValues = buildDistrictEnrollmentTableValues(
    features,
    statewideFeatures,
  );

  return {
    totalStudents: formatWholeNumber(totals.totalStudents),
    csCourses: formatWholeNumber(availableCourseLabels.size),
    csTeachers: formatWholeNumber(totals.csTeachers),
    csEnrollments: formatWholeNumber(totals.csEnrollments),

    ...enrollmentTableValues,

    csCoursesComparison: comparisonValues.csCoursesComparison,
    apCsa: formatApprovedAvailability(
      availableCourseLabels.has("AP Computer Science A"),
      "districtApprovedCourseNote",
      "AP Computer Science A",
    ),
    apCsp: formatApprovedAvailability(
      availableCourseLabels.has("AP Computer Science Principles"),
      "districtApprovedCourseNote",
      "AP Computer Science Principles",
    ),
    otherCourses: formatApprovedCourseLabels(
      otherCoursesAvailable,
      "districtApprovedCourseNote",
    ),

    csEnrollmentPercent:
      enrollmentIntensity === null
        ? "--"
        : `${formatDecimal(enrollmentIntensity * 100, 2)}%`,
    csEnrollmentComparison: comparisonValues.csEnrollmentComparison,

    category1: formatWholeNumber(totals.category1),
    category2: formatWholeNumber(totals.category2),
    category3: formatWholeNumber(totals.category3),
    category4: formatWholeNumber(totals.category4),

    studentTeacherRatio: formatDecimal(studentTeacherRatio),
    studentTeacherRatioComparison:
      comparisonValues.studentTeacherRatioComparison,
  };
}

async function loadDistrictSummaryFromArcGIS() {
  if (!selectedDistrictName) {
    updateDistrictSummaryFromData(sampleDistrictSummaryData.default);
    updateDistrictDemographicChartsFromFeatures([]);
    resetReadinessScores("district");
    resetDistrictRecommendations();
    return;
  }

  try {
    const features = await fetchDistrictSchoolFeaturesFromArcGIS();

    if (!features || features.length === 0) {
      console.warn(
        "No ArcGIS district schools found for:",
        selectedDistrictName,
      );
      updateDistrictSummaryFromData(sampleDistrictSummaryData.default);
      updateDistrictDemographicChartsFromFeatures([]);
      resetReadinessScores("district");
      resetDistrictRecommendations(
        "The selected district’s recommendation data could not be loaded.",
      );
      return;
    }

    let statewideFeatures = [];

    try {
      statewideFeatures = await fetchAllComparisonFeaturesFromArcGIS();
    } catch (comparisonError) {
      console.warn(
        "Could not load statewide comparison data:",
        comparisonError,
      );
    }

    const districtSummaryData = buildDistrictSummaryDataFromFeatures(
      features,
      statewideFeatures,
    );

    updateDistrictSummaryFromData(districtSummaryData);
    updateDistrictDemographicChartsFromFeatures(features);

    updateDistrictReadinessScores(features, statewideFeatures);
    updateDistrictRecommendations(features, statewideFeatures);

    console.log("Loaded district summary from ArcGIS:", {
      selectedDistrictName,
      schoolCount: features.length,
      districtSummaryData,
    });
  } catch (error) {
    console.error("Could not load district summary from ArcGIS:", error);
    updateDistrictSummaryFromData(sampleDistrictSummaryData.default);
    resetReadinessScores("district");
    resetDistrictRecommendations(
      "The selected district’s recommendation data could not be loaded.",
    );
  }
}

async function updateSummaryForSelection() {
  if (selectedReportType === "school") {
    await loadSchoolSummaryFromArcGIS();
    return;
  }

  if (selectedReportType === "district") {
    await loadDistrictSummaryFromArcGIS();
    return;
  }
}

if (customSelect && selectTrigger && selectedValue && selectSearch) {
  selectTrigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");

    if (customSelect.classList.contains("open")) {
      selectSearch.focus();
    }
  });

  selectSearch.addEventListener("input", () => {
    const searchValue = selectSearch.value.trim().toLowerCase();
    const options = Array.from(document.querySelectorAll("#selectOptions li"));

    if (!searchValue) {
      options.forEach((option) => {
        option.classList.remove("hidden");
      });
      return;
    }

    const matchingDistrictGroups = new Set();
    const matchingSchoolGroups = new Set();

    options.forEach((option) => {
      const optionText = option.textContent.toLowerCase();
      const groupId = option.dataset.groupId;

      if (!groupId) {
        return;
      }

      if (
        option.classList.contains("district-group-option") &&
        optionText.includes(searchValue)
      ) {
        matchingDistrictGroups.add(groupId);
      }

      if (
        option.classList.contains("school-sub-option") &&
        optionText.includes(searchValue)
      ) {
        matchingSchoolGroups.add(groupId);
      }
    });

    options.forEach((option) => {
      const optionText = option.textContent.toLowerCase();
      const groupId = option.dataset.groupId;

      let shouldShow = false;

      // Statewide option
      if (option.dataset.type === "state") {
        shouldShow = optionText.includes(searchValue);
      }

      // District row:
      // show if district itself matches OR one of its schools matches
      if (option.classList.contains("district-group-option")) {
        shouldShow =
          matchingDistrictGroups.has(groupId) ||
          matchingSchoolGroups.has(groupId);
      }

      // School row:
      // show all schools if parent district matches,
      // or show only matching school if searching by school name
      if (option.classList.contains("school-sub-option")) {
        shouldShow =
          matchingDistrictGroups.has(groupId) ||
          optionText.includes(searchValue);
      }

      if (shouldShow) {
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

  loadSchoolLookupFromArcGIS();
}

/* Race/Ethnicity double bar chart */

const raceEthnicityChartCanvas = document.getElementById("raceEthnicityChart");

if (raceEthnicityChartCanvas && typeof Chart !== "undefined") {
  raceEthnicityChart = new Chart(raceEthnicityChartCanvas, {
    type: "bar",
    data: {
      labels: [
        ["Asian and", "Pacific Islander"],
        "Black",
        "Hispanic",
        ["Native", "American"],
        "White",
        ["Two or", "More Races"],
      ],
      datasets: [
        {
          label: "School",
          // 0.5 is used to represent <1% for the Native American category
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: "#B3A369",
          borderRadius: 8,
          barThickness: 10,
        },
        {
          label: "CS",
          data: [0, 0, 0, 0, 0, 0],
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
              return context.dataset.label + ": " + context.raw + "%";
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
            display: true,
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
  districtRaceEthnicityChart = new Chart(districtRaceEthnicityChartCanvas, {
    type: "bar",
    data: {
      labels: [
        ["Asian and", "Pacific Islander"],
        "Black",
        "Hispanic",
        ["Native", "American"],
        "White",
        ["Two or", "More Races"],
      ],
      datasets: [
        {
          label: "School",
          // 0.5 is used to represent <1% for the Native American category
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: "#B3A369",
          borderRadius: 8,
          barThickness: 10,
        },
        {
          label: "CS",
          data: [0, 0, 0, 0, 0, 0],
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
            display: true,
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
  genderChart = new Chart(genderChartCanvas, {
    type: "bar",
    data: {
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "School",
          data: [0, 0],
          backgroundColor: "#B3A369",
          borderRadius: 8,
          barThickness: 12,
        },
        {
          label: "CS",
          data: [0, 0],
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
  districtGenderChart = new Chart(districtGenderChartCanvas, {
    type: "bar",
    data: {
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "School",
          data: [0, 0],
          backgroundColor: "#B3A369",
          borderRadius: 8,
          barThickness: 12,
        },
        {
          label: "CS",
          data: [0, 0],
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
    "esri/widgets/Legend",
  ], function (
    Map,
    MapView,
    FeatureLayer,
    GraphicsLayer,
    Graphic,
    Query,
    Point,
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
        title: feature.attributes.SchoolName || schoolName,
      };
    }

    function getSelectedCoordinateLocation() {
      const longitude = Number(selectedLongitude);
      const latitude = Number(selectedLatitude);

      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        return null;
      }

      return {
        longitude,
        latitude,
        title: selectedReportValue,
      };
    }

    function getDistrictCenterFromLookup(districtName) {
      if (!districtName) {
        return null;
      }

      const districtSchools = schoolLookupData
        .filter((school) => school.districtName === districtName)
        .map((school) => {
          return {
            longitude: Number(school.lon),
            latitude: Number(school.lat),
          };
        })
        .filter((point) => {
          return (
            Number.isFinite(point.longitude) && Number.isFinite(point.latitude)
          );
        });

      if (districtSchools.length === 0) {
        return null;
      }

      const longitude =
        districtSchools.reduce((sum, point) => sum + point.longitude, 0) /
        districtSchools.length;

      const latitude =
        districtSchools.reduce((sum, point) => sum + point.latitude, 0) /
        districtSchools.length;

      return {
        longitude,
        latitude,
        title: districtName,
      };
    }

    async function getCurrentReportMapLocation() {
      if (selectedReportType === "school") {
        const coordinateLocation = getSelectedCoordinateLocation();

        if (coordinateLocation) {
          return coordinateLocation;
        }

        if (selectedReportValue) {
          return await getSchoolLocationByName(selectedReportValue);
        }
      }

      if (selectedReportType === "district") {
        return getDistrictCenterFromLookup(
          selectedDistrictName || selectedReportValue,
        );
      }

      return null;
    }

    const selectedLocationIconUrl = "pics/Location_Indicator.png";

    const districtReportMapContainerIds = new Set([
      "districtMathProficiencyMap",
      "districtEnglishProficiencyMap",
      "districtIncomeMap",
    ]);

    let districtBoundaryFeaturesPromise = null;

    function isDistrictReportMapContainer(containerId) {
      return districtReportMapContainerIds.has(containerId);
    }

    function normalizeDistrictName(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(
          /\b(public schools|county schools|city schools|school district|schools)\b/g,
          "",
        )
        .replace(/\s+/g, " ")
        .trim();
    }

    function getFirstDistrictSchoolPoint(districtName) {
      if (!districtName) {
        return null;
      }

      const school = schoolLookupData.find((item) => {
        return item.districtName === districtName && item.lon && item.lat;
      });

      if (!school) {
        return null;
      }

      const longitude = Number(school.lon);
      const latitude = Number(school.lat);

      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        return null;
      }

      return {
        longitude,
        latitude,
      };
    }

    async function getAllDistrictBoundaryFeatures() {
      if (districtBoundaryFeaturesPromise) {
        return districtBoundaryFeaturesPromise;
      }

      const districtBoundaryLayer = new FeatureLayer({
        url: districtLayerUrl,
        outFields: ["*"],
      });

      const query = districtBoundaryLayer.createQuery();
      query.where = "1=1";
      query.returnGeometry = true;
      query.outFields = ["*"];

      districtBoundaryFeaturesPromise = districtBoundaryLayer
        .queryFeatures(query)
        .then((result) => {
          const features = result.features || [];

          console.log(
            "District boundary names from API:",
            features.slice(0, 25).map((feature) => feature.attributes?.NAME),
          );

          return features;
        });

      return districtBoundaryFeaturesPromise;
    }

    async function getDistrictBoundaryFeatureByPoint(point) {
      if (!point) {
        return null;
      }

      const districtBoundaryLayer = new FeatureLayer({
        url: districtLayerUrl,
        outFields: ["*"],
      });

      const query = districtBoundaryLayer.createQuery();

      query.geometry = new Point({
        longitude: point.longitude,
        latitude: point.latitude,
        spatialReference: {
          wkid: 4326,
        },
      });

      query.spatialRelationship = "intersects";
      query.returnGeometry = true;
      query.outFields = ["*"];

      const result = await districtBoundaryLayer.queryFeatures(query);

      return result.features?.[0] || null;
    }

    async function getSelectedDistrictBoundaryFeature(districtName, location) {
      if (!districtName) {
        return null;
      }

      const features = await getAllDistrictBoundaryFeatures();
      const targetName = normalizeDistrictName(districtName);

      const nameMatch =
        features.find((feature) => {
          return normalizeDistrictName(feature.attributes?.NAME) === targetName;
        }) || null;

      if (nameMatch) {
        return nameMatch;
      }

      console.warn("No district boundary name match for:", districtName);

      const lookupPoint = getFirstDistrictSchoolPoint(districtName) || location;
      const pointMatch = await getDistrictBoundaryFeatureByPoint(lookupPoint);

      if (pointMatch) {
        console.log("Matched district boundary by school point:", {
          selectedDistrict: districtName,
          matchedBoundaryName: pointMatch.attributes?.NAME,
        });

        return pointMatch;
      }

      return null;
    }

    function buildSelectedDistrictBoundaryGraphic(feature) {
      return new Graphic({
        geometry: feature.geometry,
        symbol: {
          type: "simple-fill",
          color: [255, 255, 255, 0.01],
          outline: {
            color: "#000000",
            width: 3,
          },
        },
        popupTemplate: {
          title: feature.attributes?.NAME || "Selected district",
          content: "Selected school district boundary",
        },
      });
    }

    function buildSelectedLocationMarker(location) {
      const locationPoint = new Point({
        longitude: Number(location.longitude),
        latitude: Number(location.latitude),
        spatialReference: {
          wkid: 4326,
        },
      });

      return new Graphic({
        geometry: locationPoint,
        symbol: {
          type: "picture-marker",
          url: selectedLocationIconUrl,
          width: "34px",
          height: "34px",
          yoffset: "12px",
        },
        popupTemplate: {
          title: location.title || "Selected location",
          content:
            selectedReportType === "district"
              ? "Selected district center"
              : "Selected school location",
        },
      });
    }

    function waitForVisibleReportLayout() {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
    }

    // This is for median household income map for school report, zoom out a bit more
    function getReportMapZoom(containerId) {
      if (selectedReportType === "district") {
        return 6;
      }

      // Zoom out slightly more for the school income map.
      if (containerId === "incomeMap") {
        return 8;
      }

      return 7;
    }

    async function updateOneReportMapLocation(containerId, location) {
      const view = reportMapViews[containerId];
      const selectionLayer = reportMapMarkerLayers[containerId];

      if (!view || !selectionLayer) {
        return;
      }

      try {
        await view.when();
      } catch (error) {
        console.warn("Map view was not ready:", containerId, error);
      }

      if (typeof view.resize === "function") {
        view.resize();
      }

      selectionLayer.removeAll();

      const isDistrictReportMap = isDistrictReportMapContainer(containerId);

      if (selectedReportType === "district" && isDistrictReportMap) {
        const districtName = selectedDistrictName || selectedReportValue;

        const districtFeature = await getSelectedDistrictBoundaryFeature(
          districtName,
          location,
        );

        if (districtFeature) {
          selectionLayer.add(
            buildSelectedDistrictBoundaryGraphic(districtFeature),
          );

          if (districtFeature.geometry?.extent) {
            await view
              .goTo(districtFeature.geometry.extent.expand(1.25))
              .catch(() => {});
          }

          return;
        }

        console.warn("No district boundary found for:", districtName);

        await view
          .goTo({
            center: [-83.5, 32.7],
            zoom: 6,
          })
          .catch(() => {});

        return;
      }

      if (!location) {
        await view
          .goTo({
            center: [-83.5, 32.7],
            zoom: 6,
          })
          .catch(() => {});
        return;
      }

      selectionLayer.add(buildSelectedLocationMarker(location));

      await view
        .goTo({
          center: [Number(location.longitude), Number(location.latitude)],
          zoom: getReportMapZoom(containerId),
        })
        .catch(() => {});
    }

    window.updateReportMapsForSelection = async function () {
      await waitForVisibleReportLayout();

      const location = await getCurrentReportMapLocation();

      await Promise.all(
        Object.keys(reportMapViews).map((containerId) => {
          return updateOneReportMapLocation(containerId, location);
        }),
      );
    };

    function createMathProficiencyMap(containerId, schoolLocation) {
      return createContextMap(
        containerId,
        districtLayerUrl,
        "MathProf",
        "Math Proficiency",
        [
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
        schoolLocation,
        "Percent of Students Proficient or Above in Mathematics",
      );
    }

    function createEnglishProficiencyMap(containerId, schoolLocation) {
      return createContextMap(
        containerId,
        districtLayerUrl,
        "EngProf",
        "English Language Arts Proficiency",
        [
          {
            minValue: 7.6,
            maxValue: 18.4,
            symbol: {
              type: "simple-fill",
              color: "#6677a3",
              outline: {
                color: "#666666",
                width: 0.5,
              },
            },
            label: "7.6 - 18.4",
          },
          {
            minValue: 18.4,
            maxValue: 29.5,
            symbol: {
              type: "simple-fill",
              color: "#a696aa",
              outline: {
                color: "#666666",
                width: 0.5,
              },
            },
            label: "> 18.4 - 29.5",
          },
          {
            minValue: 29.5,
            maxValue: 38.5,
            symbol: {
              type: "simple-fill",
              color: "#c994a0",
              outline: {
                color: "#666666",
                width: 0.5,
              },
            },
            label: "> 29.5 - 38.5",
          },
          {
            minValue: 38.5,
            maxValue: 51.7,
            symbol: {
              type: "simple-fill",
              color: "#edc9aa",
              outline: {
                color: "#666666",
                width: 0.5,
              },
            },
            label: "> 38.5 - 51.7",
          },
          {
            minValue: 51.7,
            maxValue: 78,
            symbol: {
              type: "simple-fill",
              color: "#fff0cc",
              outline: {
                color: "#666666",
                width: 0.5,
              },
            },
            label: "> 51.7 - 78",
          },
        ],
        schoolLocation,
        "Percent of Students Proficient or Above in English Language Arts",
      );
    }

    function createContextMap(
      containerId,
      layerUrl,
      valueField,
      valueLabel,
      classBreakInfos,
      schoolLocation,
      legendTitle = valueLabel,
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

          legendOptions: {
            title: legendTitle,
          },

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
      reportMapMarkerLayers[containerId] = schoolMarkerLayer;

      if (schoolLocation) {
        schoolMarkerLayer.add(buildSelectedLocationMarker(schoolLocation));
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
        zoom: schoolLocation ? getReportMapZoom(containerId) : 6,
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

    getCurrentReportMapLocation().then((schoolLocation) => {
      createMathProficiencyMap("mathProficiencyMap", schoolLocation);

      createEnglishProficiencyMap("englishProficiencyMap", schoolLocation);

      createMathProficiencyMap("districtMathProficiencyMap", schoolLocation);

      createEnglishProficiencyMap(
        "districtEnglishProficiencyMap",
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
        "Median Household Income",
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
        "Median Household Income",
      );
      window.updateReportMapsForSelection();
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

    // Info icon opens the info card normally, without any highlighted note.
    document.querySelectorAll(".info-highlight-active").forEach((item) => {
      item.classList.remove("info-highlight-active");
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

/* Inline asterisk info links */

/* Inline asterisk info links */

document.addEventListener("click", (event) => {
  const link = event.target.closest(".inline-info-link");

  if (!link) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const targetId = link.dataset.infoTarget;
  const card = link.closest(".report-card");

  if (!targetId || !card) {
    return;
  }

  const popup = card.querySelector(".card-info-popup");
  const target = document.getElementById(targetId);

  if (!popup || !target) {
    return;
  }

  document.querySelectorAll(".card-info-popup").forEach((item) => {
    if (item !== popup) {
      item.classList.remove("show");
    }
  });

  document.querySelectorAll(".info-highlight-active").forEach((item) => {
    item.classList.remove("info-highlight-active");
  });

  popup.classList.add("show");
  target.classList.add("info-highlight-active");

  target.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
});

/* Export report as PDF */

function cleanPdfText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getInfoLinesFromPopup(popup) {
  const clone = popup.cloneNode(true);

  const closeButton = clone.querySelector(".card-info-close");
  if (closeButton) {
    closeButton.remove();
  }

  const infoList = clone.querySelector(".info-list");

  if (!infoList) {
    const fallbackText = cleanPdfText(clone.textContent);
    return fallbackText ? [{ text: fallbackText, level: 0 }] : [];
  }

  const lines = [];

  Array.from(infoList.children).forEach((item) => {
    if (!item.matches("li")) {
      return;
    }

    const itemClone = item.cloneNode(true);

    itemClone.querySelectorAll("ul").forEach((nestedList) => {
      nestedList.remove();
    });

    const mainText = cleanPdfText(itemClone.textContent);

    if (mainText) {
      lines.push({
        text: mainText,
        level: 0,
      });
    }

    Array.from(item.children).forEach((child) => {
      if (!child.matches("ul")) {
        return;
      }

      Array.from(child.children).forEach((nestedItem) => {
        if (!nestedItem.matches("li")) {
          return;
        }

        const nestedText = cleanPdfText(nestedItem.textContent);

        if (nestedText) {
          lines.push({
            text: nestedText,
            level: 1,
          });
        }
      });
    });
  });

  return lines;
}

function collectReportInfoItems(reportElement) {
  const cards = reportElement.querySelectorAll(".report-card");
  const infoItems = [];

  cards.forEach((card) => {
    const popup = card.querySelector(".card-info-popup");

    if (!popup) {
      return;
    }

    const cardTitle =
      card.querySelector("h3")?.textContent.trim() || "Report Information";

    const infoLines = getInfoLinesFromPopup(popup);

    if (infoLines.length === 0) {
      return;
    }

    infoItems.push({
      title: cardTitle,
      lines: infoLines,
    });
  });

  return infoItems;
}

function addInfoPageToPdf({
  pdf,
  reportElement,
  pageWidth,
  pageHeight,
  margin,
}) {
  const infoItems = collectReportInfoItems(reportElement);

  if (infoItems.length === 0) {
    return null;
  }

  pdf.addPage([pageWidth, pageHeight], "portrait");

  const usableWidth = pageWidth - margin * 2;
  const bottomMargin = margin;
  let y = margin;

  function addPageIfNeeded(neededHeight) {
    if (y + neededHeight > pageHeight - bottomMargin) {
      pdf.addPage([pageWidth, pageHeight], "portrait");
      y = margin;
    }
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Information Notes", margin, y);

  y += 30;

  infoItems.forEach((item, index) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    const titleLines = pdf.splitTextToSize(
      `${index + 1}. ${item.title}`,
      usableWidth,
    );

    addPageIfNeeded(titleLines.length * 15 + 10);

    pdf.text(titleLines, margin, y);
    y += titleLines.length * 15 + 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    item.lines.forEach((lineItem) => {
      const indent = lineItem.level === 0 ? 14 : 28;
      const bullet = lineItem.level === 0 ? "• " : "– ";

      const bodyLines = pdf.splitTextToSize(
        `${bullet}${lineItem.text}`,
        usableWidth - indent,
      );

      addPageIfNeeded(bodyLines.length * 12 + 8);

      pdf.text(bodyLines, margin + indent, y);
      y += bodyLines.length * 12 + 6;
    });

    y += 14;
  });
  return y;
}

async function replaceMapsWithScreenshots(mapIds) {
  const replacements = [];

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

function waitForImagesToLoad(container) {
  const images = Array.from(container.querySelectorAll("img"));

  return Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
      }

      if (image.decode) {
        return image.decode().catch(() => {});
      }

      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    }),
  );
}

function addCitationPageToPdf({
  pdf,
  pageWidth,
  pageHeight,
  margin,
  startY = null,
}) {
  const usableWidth = pageWidth - margin * 2;
  const bottomMargin = margin;
  let y = startY === null ? margin : startY + 8;

  function addPageIfNeeded(neededHeight) {
    if (y + neededHeight > pageHeight - bottomMargin) {
      pdf.addPage([pageWidth, pageHeight], "portrait");
      y = margin;
    }
  }

  if (startY === null) {
    pdf.addPage([pageWidth, pageHeight], "portrait");
  }

  addPageIfNeeded(150);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Citation and Sources", margin, y);

  y += 32;

  function addLabeledText(label, text) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(label, margin, y);

    const labelWidth = pdf.getTextWidth(label) + 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const lines = pdf.splitTextToSize(text, usableWidth - labelWidth);

    pdf.text(lines, margin + labelWidth, y);

    y += lines.length * 14 + 14;
  }

  addLabeledText(
    "Preferred citation:",
    "Constellations Center for Education in Computing. (2026). K-12 CS Education Resource Access Report Generator. Georgia Institute of Technology.",
  );

  addLabeledText("Contact:", "Zihan Weng, zweng40@gatech.edu");

  addLabeledText("Data Source:", "GADOE CS Dashboard, GOSA, US Census Bureau");

  addLabeledText("Homepage:", "Computing in the Community Dashboard");
}

async function exportReportAsPdf({
  button,
  reportElementId,
  mapIds,
  fileName,
  backgroundColor = "#eeeeee",
}) {
  const reportElement = document.getElementById(reportElementId);

  if (!reportElement || !reportElement.classList.contains("show")) {
    alert("Please select a report before exporting.");
    return;
  }

  if (typeof html2canvas === "undefined") {
    alert("html2canvas is not loaded. Check the script tag in index.html.");
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF is not loaded. Check the script tag in index.html.");
    return;
  }

  button.disabled = true;
  button.textContent = "Generating...";

  let mapReplacements = [];

  try {
    reportElement.classList.add("exporting-report");

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await waitForImagesToLoad(reportElement);

    mapReplacements = await replaceMapsWithScreenshots(mapIds);

    const canvas = await html2canvas(reportElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imageData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const margin = 24;
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

    const notesEndY = addInfoPageToPdf({
      pdf,
      reportElement,
      pageWidth,
      pageHeight,
      margin,
    });

    addCitationPageToPdf({
      pdf,
      pageWidth,
      pageHeight,
      margin,
      startY: notesEndY,
    });

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF export failed:", error);
    alert(
      "The PDF could not be generated. Please check the console for details.",
    );
  } finally {
    restoreLiveMaps(mapReplacements);

    reportElement.classList.remove("exporting-report");
    button.disabled = false;
    button.textContent = "Export";
  }
}

function cleanFileNamePart(value) {
  return String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, " ");
}

function buildReportFileName(reportType) {
  const schoolYear = cleanFileNamePart(reportSchoolYearLabel);
  const districtName = cleanFileNamePart(
    selectedDistrictName || selectedReportValue || "District unavailable",
  );
  const schoolName = cleanFileNamePart(
    selectedReportValue || "School unavailable",
  );

  if (reportType === "school") {
    return `${schoolYear} CS Education Access School Report - ${districtName} - ${schoolName}.pdf`;
  }

  if (reportType === "district") {
    return `${schoolYear} CS Education Access District Report - ${districtName}.pdf`;
  }

  return `${schoolYear} CS Education Access Statewide Report.pdf`;
}

/* School export */

const exportReportButton = document.getElementById("exportReportButton");

if (exportReportButton) {
  exportReportButton.addEventListener("click", () => {
    exportReportAsPdf({
      button: exportReportButton,
      reportElementId: "schoolGrid",
      mapIds: [
        "mathProficiencyMap",
        "englishProficiencyMap",
        // "internetAccessMap",
        "incomeMap",
      ],
      fileName: buildReportFileName("school"),
    });
  });
}

/* District export */

const exportDistrictReportButton = document.getElementById(
  "exportDistrictReportButton",
);

if (exportDistrictReportButton) {
  exportDistrictReportButton.addEventListener("click", () => {
    exportReportAsPdf({
      button: exportDistrictReportButton,
      reportElementId: "districtReportGrid",
      mapIds: [
        "districtMathProficiencyMap",
        "districtEnglishProficiencyMap",
        // "districtInternetAccessMap",
        "districtIncomeMap",
      ],
      fileName: buildReportFileName("district"),
    });
  });
}

window.addEventListener("resize", () => {
  requestAnimationFrame(fitSummaryMetricNumbers);
});

/* District report link click handler */
document.addEventListener("click", (event) => {
  const districtLink = event.target.closest(".snapshot-district-link");

  if (!districtLink) {
    return;
  }

  goToDistrictReport(districtLink.dataset.districtName);
});
