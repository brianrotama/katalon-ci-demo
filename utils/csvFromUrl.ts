export async function readCsvFromUrl(url: string) {
  // 🔥 Cache busting supaya selalu ambil data terbaru
  const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_ts=${Date.now()}`;

  const res = await fetch(cacheBustUrl, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  if (!text.trim()) {
    return [];
  }

  const [headerLine, ...lines] = text
    .trim()
    .split('\n')
    .filter(Boolean);

  // 🔑 Normalize header: trim + lowercase
  const headers = headerLine
    .split(',')
    .map(h => h.trim().toLowerCase());

  return lines.map((line, rowIndex) => {
    const values = line.split(',').map(v => v.trim());

    return Object.fromEntries(
      headers.map((header, colIndex) => {
        const raw = values[colIndex];

        if (raw === undefined || raw === '') {
          return [header, ''];
        }

        const lower = raw.toLowerCase();

        // ✅ Boolean normalization
        if (lower === 'true') return [header, true];
        if (lower === 'false') return [header, false];

        return [header, raw];
      })
    );
  });
}
