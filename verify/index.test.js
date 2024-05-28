
const apiUrl = process.env.API_URL;

test("01: Kall til /hei gir tekstsvar 'Det er ingen løyndom at nynorsk er best'", async () => {
  const url = `${apiUrl}/hei`;
  const response = await fetch(url);;
  const text = await response.text();

  expect(text).toBe("Det er ingen løyndom at nynorsk er best");
});

test("02: Kall til /teapot gir statuskode 418", async () => {
  const url = `${apiUrl}/teapot`;
  const response = await fetch(url);;

  expect(response.status).toBe(418);
});

test("03: Kall til /nikolas med query parameter flink=verdi gir tekstsvar 'Nikolas er flink til å <flink-verdi>'", async () => {
  const url = `${apiUrl}/nikolas?flink=spele%20magic%20the%20gathering`;
  const response = await fetch(url);;
  const text = await response.text();

  expect(text).toBe("Nikolas er flink til å spele magic the gathering");
});

/*
 * Førespurnad (døme):
 * {
 *   "fornavn": "Nikolas",
 *   "mellomnavn": "Rølland",
 *   "etternavn": "Hugsted"
 * }
 * skal gi respons:
 * {
 *   "navn": "Nikolas Rølland Hugsted"
 * }
 *
 */
test("04: POST med JSON til /navn skal sette saman fornavn, mellomnavn og etternavn", async () => {
  const route = `${apiUrl}/navn`;
  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fornavn: "Peder",
      mellomnavn: "Voldnes",
      etternavn: "Langdal",
    })
  })
  const responseJson = await response.json();


  const response2 = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fornavn: "Erik",
      mellomnavn: "Aadal",
      etternavn: "Gustafsson",
    })
  })
  const responseJson2 = await response2.json();

  expect(responseJson.navn).toBe("Peder Voldnes Langdal");
  expect(responseJson2.navn).toBe("Erik Aadal Gustafsson");
});


/*
 * For å implementere denne må serveren ha tilstand, den må ha ein akkumulator som startar på 0.
 * Alle kall til /addisjon skal legge til talet i body til akkumulatoren og returnere den nye verdien.
 *
 * Førespurnad:
 * {
 *   "addend": <tal>
 * }
 * skal gi respons:
 * {
 *   "sum": <akkumulator + tal>
 * }
 *
 */
test("05: POST til /addisjon med addend i JSON skal gi tilbake akkumulator + addend", async () => {
  const apiUrl = process.env.API_URL;

  const route = `${apiUrl}/addisjon`;
  const firstResponse = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      addend: 1000
    })
  })

  const firstResult = (await firstResponse.json()).sum;

  const secondResponse = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      addend: 337
    })
  })

  const secondResult = (await secondResponse.json()).sum;


  expect(firstResult).toBe(1000);
  expect(secondResult).toBe(1337);
});

/*
 * Korrekt brukarnamn: "AzureDiamond"
 * Korrekt passord: "hunter2"
 *
 * Info om basic auth:
 * - https://datatracker.ietf.org/doc/html/rfc7617
 * - https://en.wikipedia.org/wiki/Basic_access_authentication
 *
 */
test("06: GET til /secret utan basic auth gir 401, korrekt brukarnamn og passord gir 200", async () => {
  const apiUrl = process.env.API_URL;

  const route = `${apiUrl}/secret`;

  const firstResponse = await fetch(route, {
    method: "GET",
    headers: {
    }
  })

  const username = "AzureDiamond";
  const password = "hunter2";

  const credentialsBase64 = Buffer.from(username + ":" + password).toString('base64');

  const secondResponse = await fetch(route, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${credentialsBase64}`
    }
  })

  expect(firstResponse.status).toBe(401);
  expect(secondResponse.status).toBe(200);
});

/*
 * - Det kule bildet som må bli returnert er "api_respons.jpg"
 * - Content-Type på respons må settast til "image/jpeg"
 * - Om du prøver å opne bildet i nettlesaren skal nettlesaren vise bildet
 *
 */
test("07: GET til /cool gir kult bilde i respons", async () => {
  const apiUrl = process.env.API_URL;

  const route = `${apiUrl}/cool`;

  const response = await fetch(route)

  const blob = await response.blob();

  expect(response.status).toBe(200);
  expect(blob.type).toBe("image/jpeg");
  expect(blob.size).toBeGreaterThanOrEqual(3474998);
  expect(blob.size).toBeLessThanOrEqual(3600000);;
});

/*
 * - De skal bruke dette API-et: https://jsonplaceholder.typicode.com/
 * - Spesifikt skal de gjere følgande kall: GET https://jsonplaceholder.typicode.com/todos/<id>
 *
 * - Deretter skal de gi følgande respons som JSON:
 * {
 *   "tittel": "<tittel>",
 *   ferdig: true|false
 * }
 *
 */
test("08: GET til /artiklar/<id> hentar riktig artikkel frå API-et", async () => {
  const apiUrl = process.env.API_URL;

  const route = `${apiUrl}/artiklar`;

  const firstReponse = await fetch(`${route}/1`);
  const firstJson = await firstReponse.json();

  const secondReponse = await fetch(`${route}/4`);
  const secondJson = await secondReponse.json();

  expect(firstJson.tittel).toBe("delectus aut autem");
  expect(firstJson.ferdig).toBe(false);

  expect(secondJson.tittel).toBe("et porro tempora");
  expect(secondJson.ferdig).toBe(true);
});
