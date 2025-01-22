const API_KEY = "AIzaSyCnS5_RVtWCCJU_cWiTBU89L_qTKONR96Q"; // Replace with your actual API Key
const SHEET_ID = "1DV4wXnq7Ftcq1lPzpWxBbNK028nMCotMgkkzCYo9IoI"; // Replace with your Sheet ID

// Fetch data from Google Sheets API
async function fetchData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?ranges=About&ranges=OutsideWork&ranges=WhitePapers&ranges=Books&key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Populate About section
    const aboutData = data.valueRanges[0].values;
    document.querySelector("#about-content").textContent = aboutData[1][1];

    // Populate Outside Work section
    const workData = data.valueRanges[1].values;
    document.querySelector("#work-content").textContent = workData[1][1];

    // Populate White Papers section
    const papersData = data.valueRanges[2].values.slice(1); // Skip header
    const papersList = document.querySelector("#white-papers-list");
    papersList.innerHTML = ""; // Clear existing data
    papersData.forEach(row => {
      const listItem = document.createElement("li");
      listItem.textContent = `${row[0]}: ${row[1]}`;
      papersList.appendChild(listItem);
    });

    // Populate Books section
    const booksData = data.valueRanges[3].values.slice(1); // Skip header
    const booksList = document.querySelector("#books-list");
    booksList.innerHTML = ""; // Clear existing data
    booksData.forEach(row => {
      const listItem = document.createElement("li");
      listItem.textContent = `${row[0]} by ${row[1]}`;
      booksList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
  }
}

// Fetch data on page load
fetchData();
