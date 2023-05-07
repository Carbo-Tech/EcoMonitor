# Air Quality APIs
This repository contains three APIs that allow users to query data related to air quality. The APIs are:

- `/api/v1/stations`
- `/api/v1/stations/{station}/pollutants`
- `/api/v1/stations/{station}/pollutants/{pollutant}`
## Usage    
To use the APIs, make an HTTP requests to the appropriate URL. Here are some examples:

`/api/v1/stations`

This API returns a list of air quality monitoring stations.

#### example request

```
GET /api/v1/stations HTTP/1.1
Host: example.com
```

#### Example response

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "lat": 45.05560684,
    "lon": 12.03500652,
    "nome": "Adria"
  },
  {
    "lat": 45.60152817,
    "lon": 11.90351582,
    "nome": "Alta Padovana"
  },
  ...
]
```
`/api/v1/stations/{station}/pollutants`
This API returns a list of pollutants measured at a given station.

#### Example request
```
GET /api/v1/stations/Alta%20Padovana/pollutants HTTP/1.1
Host: example.com
```
#### Example response
```HTTP/1.1 200 OK
Content-Type: application/json

[
  "Ozono",
  "pm10"
]
```

```/api/v1/stations/{station}/pollutants/{pollutant}```

This API returns a list of air quality measurements for a given station and pollutant.

#### Example request
```
GET /api/v1/stations/Belluno%20Città/pollutants/ozono?orderby=data&limit=10&offset=0 HTTP/1.1
Host: example.com
```
#### Example response

```
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
    "codseqst": "500000068",
    "comune": "Belluno",
    "data": "Tue, 06 Apr 2021 08:10:01 GMT",
    "lat": 46.14192581,
    "localita": "Belluno Citt\u00e0",
    "lon": 12.21760273,
    "nome": "Belluno Citt\u00e0",
    "provincia": "Be",
    "tipoInquinante": "ozono",
    "valore": 46.508
  },
  {
    "codseqst": "500000068",
    "comune": "Belluno",
    "data": "Tue, 06 Apr 2021 09:10:01 GMT",
    "lat": 46.14192581,
    "localita": "Belluno Citt\u00e0",
    "lon": 12.21760273,
    "nome": "Belluno Citt\u00e0",
    "provincia": "Be",
    "tipoInquinante": "ozono",
    "valore": 79.8516
  },
  ...
]
```