function fetchData(station, pollutant) {
    return fetch(`/api/v1/stations/${station}/pollutants/${pollutant}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => {
                const date = new Date(item.data);
                return date.toISOString()
            });
            const values = data.map(item => item.valore);

            const redLabels = [];
            const redValues = [];
            const valuesCopy = [...values];
            for (let i = 0; i < values.length; i += 7) {
                const weekValues = valuesCopy.slice(i, i + 7);
                const weekAverage = weekValues.reduce((acc, val) => acc + val, 0) / weekValues.length;

                for (let j = i; j < i + 7; j++) {
                    if (j === i + 3) {
                        redValues.push(weekAverage);
                        redLabels.push(labels[j]);
                    } else {
                        redValues.push(null);
                        redLabels.push(labels[j]);
                    }
                }
            }


            return { labels, values, redLabels, redValues };
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function createGraph(labels, values, redLabels, redValues) {

    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    const ctx = document.getElementById('myChart').getContext('2d');

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(label => new Date(label).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })),
            datasets: [
                {
                    label: 'Weekly Average',
                    data: redValues,
                    spanGaps: true,
                    zIndex: 0,
                    backgroundColor: 'transparent',
                    borderColor: 'RGB(255, 0, 0)',
                    borderWidth: 2,
                    pointBackgroundColor: 'RGB(255, 0, 0)',
                    pointRadius: 0,
                    fill: "end",
                    labels: redLabels
                },
                {
                    label: 'Value',
                    data: values,
                    spanGaps: true,

                    backgroundColor: 'transparent',
                    borderColor: 'RGB(211, 211, 211)',
                    borderWidth: 2,
                    pointBackgroundColor: 'RGB(211, 211, 211)',
                    pointRadius: 0,
                    fill: true,
                    zIndex: 1,
                }
            ]
        },
        options: {
            legend: {
                display: true
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: 'Line Graph'
            },
            scales: {
                x: {
                    type: 'category',
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return value;
                        }
                    }
                },
                y: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }
            },
            tooltips: {
                mode: 'nearest',
                intersect: false,

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
        .then(({ labels, values, redLabels, redValues }) => createGraph(labels, values, redLabels, redValues));
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







