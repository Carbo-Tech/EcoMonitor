        // Get a reference to the table body element
        const tableBody = document.querySelector('tbody');

        // Fetch the data from the API
        fetch('/api/v1/stations/any/pollutants/any?orderby=nome')
            .then(response => response.json())
            .then(data => {
                // Clear the existing table data
                tableBody.innerHTML = '';

                // Loop over each row of data and add it to the table
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    const stationNameTd = document.createElement('td');
                    const dateTd = document.createElement('td');
                    const pollutantTypeTd = document.createElement('td');
                    const valueTd = document.createElement('td');

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
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });