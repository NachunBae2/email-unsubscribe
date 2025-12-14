export default function Home() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>구독 관리</h1>
        <p style={{ color: '#666' }}>이메일의 구독 취소 링크를 통해 접속해주세요.</p>
      </div>
    </div>
  )
}
