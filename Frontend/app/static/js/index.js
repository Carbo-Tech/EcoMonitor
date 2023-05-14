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
        currentPageSpan.classList.remove("fade-in");
        currentPageSpan.classList.add("fade-out", "slide-out-right");
        previousButton.classList.add("slide-out-left");
        nextButton.classList.remove("slide-out-left");
        setTimeout(() => {
          currentPageSpan.classList.remove("fade-out");
          currentPageSpan.classList.add("fade-in", "slide-in-left");
          previousButton.classList.remove("slide-out-left");
          nextButton.classList.remove("slide-out-right");
        }, 300);
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

async function fetchUsingRest() {
  try {
    const response = await fetch("/api/v1/stations");
    const stations = await response.json();

    const pollutants = await Promise.all(
      stations.map(async (station) => {
        console.log(station["nome"])
        const response = await fetch(`/api/v1/stations/${station.nome}/pollutants`);
        const pollutants = await response.json();
        return { station, pollutants };
      })
    );
    const records = await Promise.all(
      pollutants.map(async (row) => {
        try {
          const response = await Promise.all(
            row.pollutants.map(async (pollutant) => {
              const records = await fetch(`/api/v1/stations/${row.station.nome}/pollutants/${pollutant}`).then((response) => response.json());
              return { pollutant, records };
            })
          );
          return { station: row.station, pollutants: response };
        } catch (error) {
          console.error("Error fetching data:", error);
          return { station: row.station, pollutants: null };
        }
      })
    );
    const flattenedData = data.map(({ pollutants }) =>
      pollutants.flatMap(({ records }) => records)
    );
    console.log(flattenedData)
    return flattenedData

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}



fetch("/api/v1/stations/any/pollutants/any?orderby=nome")
  .then((response) => response.json())
  .then((data) => {
    console.log(JSON.stringify(data))
    fillTable(data);
    paginateTable(10);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
const res = await fetchUsingRest()
/* fillTable(res)
paginateTable(10) */