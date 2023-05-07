function fetchData(station, pollutant) {
    return fetch(`/api/v1/stations/${station}/pollutants/${pollutant}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.data);
            const values = data.map(item => item.valore);
            return { labels, values };
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createGraph(labels, values) {
    if(window.myChart instanceof Chart)
    {
        window.myChart.destroy();
    }
    const ctx = document.getElementById('myChart').getContext('2d');

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Value',
                data: values,
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderWidth: 2,
                pointBackgroundColor: 'white'
            }]
        },
        options: {
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: 'Line Graph'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


}

function fetchPollutants(station) {
    return fetch(`/api/v1/stations/${station}/pollutants`)
        .then(response => response.json())

        .catch(error => {
            console.error('Error:', error);
        });
}
function fetchStations() {
    return fetch(`/api/v1/stations`)
        .then(response => response.json())
        .then(data => data.map(item => item.nome))
        .catch(error => {
            console.error('Error:', error);
        });
}
function displayGraph(station, pollutant) {
    fetchData(station, pollutant)
        .then(({ labels, values }) => createGraph(labels, values));
}

function populateStations() {
    const stationsDropdown = document.getElementById('stations');
    fetchStations().then(stations => {
        stations.forEach(station => {
            const option = document.createElement('option');
            option.text = station;
            option.value = station;
            stationsDropdown.add(option);
        });
        stationsDropdown.disabled = false;
    }).catch(error => console.error(error));
}

// Fetch available pollutants for the selected station and populate the dropdown menu
function populatePollutants() {
    const stationName = document.getElementById('stations').value;
    const pollutantsDropdown = document.getElementById('pollutants');
    fetchPollutants(stationName).then(pollutants => {
        pollutants.forEach(pollutant => {
            const option = document.createElement('option');
            option.text = pollutant;
            option.value = pollutant;
            pollutantsDropdown.add(option);
        });
        pollutantsDropdown.disabled = false;
    }).catch(error => console.error(error));
}


document.getElementById('stations').addEventListener('change', () => {
    document.getElementById('pollutants').disabled = true; // disable pollutants dropdown until station is selected
    const stationName = document.getElementById('stations').value;
    fetchPollutants(stationName) // get pollutants for selected station
        .then(pollutants => {
            const pollutantsDropdown = document.getElementById('pollutants');
            pollutantsDropdown.innerHTML = ''; // clear previous options
            let firstPollutant;
            pollutants.forEach(pollutant => {
                const option = document.createElement('option');
                option.value = pollutant;
                option.text = pollutant;
                pollutantsDropdown.appendChild(option);
                if (!firstPollutant) {
                    firstPollutant = pollutant;
                }
            });
            pollutantsDropdown.disabled = false; // enable pollutants dropdown
            displayGraph(stationName, firstPollutant); // update graph with selected station and pollutant
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('pollutants').addEventListener('change', () => {
    const stationName = document.getElementById('stations').value;
    const pollutantName = document.getElementById('pollutants').value;
    displayGraph(stationName, pollutantName); // update graph with selected station and pollutant
});

// initial call to get available stations and populate dropdown
fetchStations()
    .then(stations => {
        const stationsDropdown = document.getElementById('stations');
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.text = station;
            stationsDropdown.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });







