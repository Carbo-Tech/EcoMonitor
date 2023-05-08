// Get a reference to the table body element
const tableBody = document.querySelector("tbody");

// Function to fill the table with data
function fillTable(data) {
  // Clear the existing table data
  tableBody.innerHTML = "";

  // Loop over each row of data and add it to the table
  data.forEach((row) => {
    const tr = document.createElement("tr");
    const stationNameTd = document.createElement("td");
    const dateTd = document.createElement("td");
    const pollutantTypeTd = document.createElement("td");
    const valueTd = document.createElement("td");

    stationNameTd.textContent = row.nome;
    dateTd.textContent = new Date(row.data).toLocaleString();
    pollutantTypeTd.textContent = row.tipoInquinante;
    valueTd.textContent = row.valore;

    tr.appendChild(stationNameTd);
    tr.appendChild(dateTd);
    tr.appendChild(pollutantTypeTd);
    tr.appendChild(valueTd);

    tableBody.appendChild(tr);
  });
}

// Function to paginate the table
function paginateTable(pageSize) {
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  const pageCount = Math.ceil(rows.length / pageSize);
  let currentPage = 0;

  function createPaginationButtons() {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";

    const previousButton = document.createElement("button");
    previousButton.textContent = "◄";
    previousButton.className = "pagination__button";
    paginationDiv.appendChild(previousButton);

    const currentPageSpan = document.createElement("span");
    currentPageSpan.textContent = currentPage + 1;
    currentPageSpan.className = "pagination__current-page";
    paginationDiv.appendChild(currentPageSpan);

    const nextButton = document.createElement("button");
    nextButton.textContent = "►";
    nextButton.className = "pagination__button";
    paginationDiv.appendChild(nextButton);

    previousButton.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
        currentPageSpan.textContent = currentPage + 1;
      }
    });

    nextButton.addEventListener("click", () => {
      if (currentPage < pageCount - 1) {
        currentPage++;
        showPage(currentPage);
        currentPageSpan.textContent = currentPage + 1;
      }
    });

    return paginationDiv;
  }

  function showPage(page) {
    const start = page * pageSize;
    const end = start + pageSize;
    rows.forEach((row, index) => {
      if (index >= start && index < end) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  const paginationButtons = createPaginationButtons();
  tableBody.insertAdjacentElement("afterend", paginationButtons);

  showPage(currentPage);
}

// Fetch the data from the API
fetch("/api/v1/stations/any/pollutants/any?orderby=nome")
  .then((response) => response.json())
  .then((data) => {
    fillTable(data);
    paginateTable(10);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
