const fetchRetry = require("fetch-retry")(fetch, {
  retries: 100,
  retryDelay: 800,
});

export async function compute(csvData, categoryID, methodID, args = {}) {
  const response = await fetchRetry(
    `http://127.0.0.1:4242/compute/${categoryID}/${methodID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: csvData,
        args,
      }),
    }
  );

  const resp = await response.json();
  return resp;
}