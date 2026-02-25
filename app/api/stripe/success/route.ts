export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id') || '';

  return new Response(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'STRIPE_SUCCESS', sessionId: '${sessionId}' }, '*');
            window.close();
          } else {
            window.location.href = '/settings?success=true&session_id=${sessionId}';
          }
        </script>
        <p>Payment successful! This window should close automatically.</p>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}
