const BASE_URL = "http://localhost:3001/api";

export async function getHello() {
  const res = await fetch(`${BASE_URL}/hello`);

  if (!res.ok) {
    throw new Error("Failed to fetch hello message");
  }

  return res.json();
}

export async function getSafehouses() {
  const res = await fetch(`${BASE_URL}/safehouses`);

  if (!res.ok) {
    throw new Error("Failed to fetch safehouses");
  }

  return res.json();
}

export async function getSurvivors(filters = {}) {
  const params = new URLSearchParams();

  if (filters.health_status) {
    params.append("health_status", filters.health_status);
  }

  if (filters.skill) {
    params.append("skill", filters.skill);
  }

  if (filters.safehouse_id) {
    params.append("safehouse_id", filters.safehouse_id);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/survivors?${queryString}`
    : `${BASE_URL}/survivors`;

  const res = await fetch(url);

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch survivors");
  }

  return res.json();
}

export async function createSurvivor(newSurvivor) {
  const res = await fetch(`${BASE_URL}/survivors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSurvivor),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create survivor");
  }

  return data;
}

export async function deleteSurvivor(id) {
  const res = await fetch(`${BASE_URL}/survivors/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete survivor");
  }

  return data;
}

export async function getSupplies() {
  const res = await fetch(`${BASE_URL}/supplies`);

  if (!res.ok) {
    throw new Error("Failed to fetch supplies");
  }

  return res.json();
}

export async function deleteSupply(id) {
  const res = await fetch(`${BASE_URL}/supplies/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete supply");
  }

  return data;
}
