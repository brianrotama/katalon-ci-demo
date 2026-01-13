export async function readCsvFromUrl(url) {
  // 🛡️ GUARD: cegah error undefined di CI
  if (!url) {
    throw new Error(
      'GSHEET_URL is undefined. Pastikan environment variable GSHEET_URL diset ' +
      '(local .env atau GitHub Actions secrets).'
    );
  }

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
    throw new Error(
      'CSV response kosong. Pastikan Google Sheet sudah Publish to web.'
    );
  }

  const [headerLine, ...lines] = text
    .trim()
    .split('\n')
    .filter(Boolean);

  if (!headerLine || lines.length === 0) {
    throw new Error('CSV format tidak valid (header atau data kosong).');
  }

  // 🔑 Normalize header: trim + lowercase
  const headers = headerLine
    .split(',')
    .map(h => h.trim().toLowerCase());

  return lines.map(line => {
    const values = line.split(',').map(v => v.trim());

    return Object.fromEntries(
      headers.map((header, colIndex) => {
        const raw = values[colIndex];

        if (!raw) {
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