const backendUrl = "https://widget-backend.vercel.app";
const apiKey = "vb9q3478ge48orhfiavi3qi48gbifer8e3";

const values = {
  sum: 10,
  min: 10,
  max: 10,
  count: 10,
  average: 10,
  median: 10,
};

async function fetchTickerValues(id: Number) {
  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify({ id: id, ...values }),
    });
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
}

fetchTickerValues(1);
