
test('adds 1 + 2 to equal 3', async () => {
  let resp = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  let respJson = await resp.json();

  console.log(respJson);
  expect(respJson.id).toBe(1);

});

/*
 *
 * TODO: Testar som trengs
 * 1. Få "Nynorsk er best" som respons for ei gitt rute
 * 1. Returnere statuskode 418 for ei gitt rute
 * 1. Få "Nikolas er flink til å X" som respons, der X er ein queryParameter
 * 1. Ta i mot ein post request med json, returnere del av json tilbake
 * 1. Ta i mot ein post request med eit tal i body. På serveren skal det vere ein akkumulator som talet blir addert saman med. Returnere ny verdi for akkumulatoren.
 */


test('posting an article gives status 200', async () => {
  const apiUrl = process.env.API_URL;

  // Node
  // Make a json post request to api
  const route = `${apiUrl}/posts`;
  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "foo",
      body: "bar",
      userId: 1
    })
  })

  expect(response.status).toBe(200);
});
