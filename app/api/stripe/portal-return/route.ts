export async function GET(req: Request) {
  return new Response(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.close();
          } else {
            window.location.href = '/settings';
          }
        </script>
        <p>You can close this window now.</p>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}
