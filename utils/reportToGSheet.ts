export async function reportToGSheet(
  tcName: string,
  status: 'PASSED' | 'FAILED'
) {
  const url = process.env.GSHEET_WEBHOOK_URL;
  if (!url) return;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tc_name: tcName,
      status,
    }),
  });
}