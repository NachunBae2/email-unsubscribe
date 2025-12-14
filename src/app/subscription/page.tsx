'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Listmonk URL 파라미터
  const uuid = searchParams.get('uuid') || searchParams.get('u')
  const campaign = searchParams.get('c') || searchParams.get('campaign')
  const list = searchParams.get('l') || searchParams.get('list')

  const handleUnsubscribe = async () => {
    if (!uuid) {
      setMessage('유효하지 않은 구독 취소 링크입니다.')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, campaign, list })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('구독이 성공적으로 취소되었습니다.')
      } else {
        setStatus('error')
        setMessage(data.error || '구독 취소 중 오류가 발생했습니다.')
      }
    } catch {
      setStatus('error')
      setMessage('서버 연결 오류가 발생했습니다.')
    }
  }

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
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#333', fontSize: '24px' }}>
          구독 취소
        </h1>

        {status === 'idle' && (
          <>
            <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
              이메일 수신을 더 이상 원하지 않으시면<br />
              아래 버튼을 클릭해주세요.
            </p>
            <button
              onClick={handleUnsubscribe}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
            >
              구독 취소하기
            </button>
          </>
        )}

        {status === 'loading' && (
          <p style={{ color: '#666' }}>처리 중...</p>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
            <p style={{ color: '#27ae60', fontSize: '18px' }}>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✗</div>
            <p style={{ color: '#e74c3c', fontSize: '18px' }}>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>로딩 중...</div>}>
      <UnsubscribeContent />
    </Suspense>
  )
}
