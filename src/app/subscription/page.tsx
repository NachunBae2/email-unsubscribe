'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function UnsubscribeContent() {
  const searchParams = useSearchParams()

  const uuid = searchParams.get('uuid') || searchParams.get('u')
  const campaign = searchParams.get('c') || searchParams.get('campaign')
  const list = searchParams.get('l') || searchParams.get('list')

  useEffect(() => {
    // 백그라운드로 구독 취소 데이터 전송
    if (uuid) {
      fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, campaign, list })
      }).catch(() => {})
    }
  }, [uuid, campaign, list])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px 40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px', color: '#27ae60' }}>✓</div>
        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '15px' }}>
          수신 거부되었습니다
        </h1>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
          더 이상 이메일을 받지 않습니다.
        </p>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '50px 40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', color: '#27ae60' }}>✓</div>
          <h1 style={{ fontSize: '24px', color: '#333' }}>수신 거부되었습니다</h1>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
