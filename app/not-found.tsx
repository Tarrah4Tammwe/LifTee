export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0d0918',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '64px', margin: '0 0 20px 0', color: '#a855f7' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>Page Not Found</h2>
      <p style={{ fontSize: '16px', color: '#999', marginBottom: '30px' }}>
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#a855f7',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        Back to Home
      </a>
    </div>
  );
}
