const API_KEY = "AIzaSyCnS5_RVtWCCJU_cWiTBU89L_qTKONR96Q"; // Replace with your actual API Key
const SHEET_ID = "1DV4wXnq7Ftcq1lPzpWxBbNK028nMCotMgkkzCYo9IoI"; // Replace with your Sheet ID

// Markdown Converter
const converter = new showdown.Converter();

// Fetch data from Google Sheets API
async function fetchData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}&includeGridData=true`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Extract all sheets
    const sheets = data.sheets;

    // Populate Intro (About Me) section
    populateIntro(sheets[0]); // First sheet is Intro

    // Populate right panel with all sheets starting from the second one
    populateDynamicSections(sheets.slice(1)); // Remaining sheets
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
  }
}

// Populate the Intro section (first sheet) with Markdown support
function populateIntro(sheet) {
  const introContent = document.querySelector("#about-content");
  const rows = sheet.data[0].rowData || [];

  introContent.innerHTML = ""; // Clear existing content
  rows.forEach(row => {
    const cell = row.values && row.values[0]; // First cell in the row
    if (cell && cell.formattedValue) {
      const markdownContent = converter.makeHtml(cell.formattedValue); // Convert Markdown to HTML
      introContent.innerHTML += markdownContent; // Append converted HTML
    }
  });
}

// Populate dynamic sections (all sheets starting from the second one) with Markdown support
function populateDynamicSections(sheets) {
  const contentContainer = document.getElementById("dynamic-content");
  contentContainer.innerHTML = ""; // Clear existing content

  sheets.forEach(sheet => {
    const sectionTitle = sheet.properties.title; // Tab name as section title
    const rows = sheet.data[0].rowData || []; // Rows in the tab

    // Create section
    const section = document.createElement("section");
    section.id = sectionTitle.toLowerCase().replace(/\s+/g, "-"); // Convert title to an ID
    section.innerHTML = `<h2>${sectionTitle}</h2>`;

    // Create a list for points
    const list = document.createElement("ul");

    rows.forEach(row => {
      const cell = row.values && row.values[0]; // Get the first cell in each row
      if (cell && cell.formattedValue) {
        const listItem = document.createElement("li");
        const markdownContent = converter.makeHtml(cell.formattedValue); // Convert Markdown to HTML
        listItem.innerHTML = markdownContent; // Add converted HTML
        list.appendChild(listItem);
      }
    });

    section.appendChild(list);
    contentContainer.appendChild(section);
  });
}

// Fetch data on page load
fetchData();
