export async function GET(req: Request) {
  return new Response(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'STRIPE_CANCEL' }, '*');
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
        <p>Payment canceled. This window should close automatically.</p>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}
