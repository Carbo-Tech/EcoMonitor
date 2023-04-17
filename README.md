<h1 align="center">Benvenuti in EcoMonitor 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-development-blue.svg?cacheSeconds=2592000" />
</p>

[![CodeQL](https://github.com/YourUserName/EcoMonitor/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/YourUserName/EcoMonitor/actions/workflows/github-code-scanning/codeql)

> EcoMonitor è un'applicazione per la gestione e l'analisi dei dati ambientali, con un focus sull'inquinamento da polveri sottili (PM10). L'applicazione è stata sviluppata per la classe 5BI dell'a.s. 2021-22 nell'ambito del corso di Educazione Civica.

## Scopi del Progetto
> L'obiettivo di EcoMonitor è quello di sensibilizzare gli utenti sui problemi dell'inquinamento atmosferico, in particolare sulle conseguenze dell'emissione di polveri sottili (PM10) sull'ambiente e sulla salute umana. L'applicazione fornisce un'interfaccia per la visualizzazione dei dati raccolti da diverse stazioni di monitoraggio ambientale e li analizza in modo critico, fornendo informazioni dettagliate sulla qualità dell'aria, tendenze temporali e suggerimenti sui comportamenti da adottare per ridurre l'impatto dell'inquinamento.

## Realizzazione del Progetto
> EcoMonitor è stato sviluppato utilizzando diverse tecnologie, tra cui Docker per l'ambiente di sviluppo e FastAPI per la parte del backend, in grado di gestire la raccolta e l'elaborazione dei dati. La parte del frontend è stata sviluppata con Flask e il sito è stato organizzato con un'architettura REST e SPA. Il database utilizzato è MySQL. L'applicazione è in grado di processare i dati ambientali forniti dall'ARPA (Agenzia Regionale per la Protezione Ambientale) e di visualizzarli in un formato fruibile per l'utente generico.

### ✨ [Demo locale su localhost:3000](localhost:3000)

## Installazione

È necessario avere docker installato. In caso contrario, consultare https://docs.docker.com/engine/install/.
È inoltre necessario avere docker-compose, che può essere installato con:

```sh
 pip install docker-compose
```

## Usage

Nella cartella del progetto:

```sh
docker-compose up --build
```

per eseguire il progetto, e

```sh
docker-compose down
```

per arrestare i container.

## Authors 👤

Secchi Pietro Giampaolo,  
de' Martini di Valle Aperta Francesco,  
Zaki Pedio,   
Brunelli Tommaso

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
