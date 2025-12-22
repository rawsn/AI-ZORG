import fetch from "node-fetch";
export async function zoekZorgaanbieders(postcode, type) {
  const url = `https://www.zorgkaartnederland.nl/api/v1/search?type=${type}&postcode=${postcode}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.results?.slice(0,3).map(z=>({naam:z.name,adres:z.address}))||[];
  } catch {
    return [];
  }
}
