export const metadata = {
  title: '구독 관리',
  description: '이메일 구독 관리 페이지',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </body>
    </html>
  )
}
