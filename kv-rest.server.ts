const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

export function hasKvRestStorage() {
  return Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
}

export async function runKvCommand<T = unknown>(command: Array<string | number>) {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    throw new Error('KV REST storage is not configured.');
  }

  const response = await fetch(KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`KV REST command failed with status ${response.status}.`);
  }

  const payload = await response.json() as { result?: T; error?: string };
  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result as T;
}

export function parseSortedSetResult(raw: unknown): Array<{ key: string; clicks: number }> {
  if (!Array.isArray(raw)) {
    return [];
  }

  const rows: Array<{ key: string; clicks: number }> = [];
  for (let index = 0; index < raw.length; index += 2) {
    const key = String(raw[index] ?? '');
    const score = Number(raw[index + 1] ?? 0);
    if (key) {
      rows.push({ key, clicks: score });
    }
  }

  return rows;
}