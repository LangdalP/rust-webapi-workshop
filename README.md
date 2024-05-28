# rust-webapi-workshop

1. Lag din eigen applikasjon i Rust som kan svare på HTTP-requests
2. Start applikasjonen din lokalt og kopier URL-en den køyrer på (f.eks. `http://localhost:8080`)
2. Gå i mappa verify og rediger `package.json` slik at den peikar på riktig URL:
```json
  "scripts": {
    "test": "API_URL=<SETT INN> jest"
  },
```
3. Køyr `npm run test` for å sjekke kor mange testar som går gjennom for din applikasjon
4. Iterer på applikasjonen din til alle testane er grøne
