import fetch from "node-fetch";

export async function findProviders(postcode, type) {
  try {
    const res = await fetch(
      `https://api.zorgkaartnederland.nl/v1/providers?postcode=${postcode}&type=${type}`
    );
    const data = await res.json();
    return data.providers.slice(0, 3).map(p => ({
      naam: p.name,
      adres: p.address,
      telefoon: p.phone
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}
