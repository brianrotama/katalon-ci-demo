/**
 * Read CSV data from Google Sheet (published CSV)
 * - Pure JavaScript
 * - Anti cache
 * - CI safe
 */

export async function readCsvFromUrl(url) {
  // 🛡️ Guard ENV
  if (!url) {
    throw new Error(
      'GSHEET_LOGIN_URL is undefined. ' +
      'Pastikan env diset (.env local / CI secrets).'
    );
  }

  // 🔥 HARD CACHE BUSTING
  const cacheBustUrl =
    `${url}${url.includes('?') ? '&' : '?'}_ts=${Date.now()}_${Math.random()}`;

  const res = await fetch(cacheBustUrl, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  if (!text.trim()) {
    throw new Error(
      'CSV kosong. Pastikan Google Sheet sudah Publish to web (CSV).'
    );
  }

  const rows = text
    .trim()
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    throw new Error('CSV format tidak valid (butuh header + data)');
  }

  const [headerLine, ...dataLines] = rows;

  // Normalize header
  const headers = headerLine
    .split(',')
    .map(h => h.replace(/^"(.*)"$/, '$1').trim().toLowerCase());

  const result = dataLines.map(line => {
    const values = line
      .split(',')
      .map(v => v.replace(/^"(.*)"$/, '$1').trim());

    const row = {};

    headers.forEach((header, index) => {
      const raw = values[index] ?? '';
      const lower = raw.toLowerCase();

      if (lower === 'true') row[header] = true;
      else if (lower === 'false') row[header] = false;
      else row[header] = raw;
    });

    return row;
  });

  console.log(`[GSHEET] Loaded ${result.length} rows`);
  return result;
}