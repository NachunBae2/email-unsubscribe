import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SIMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>수신 거부</title>
</head>
<body style="margin:0;padding:50px 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f5;text-align:center;">
  <div style="background:white;padding:50px 40px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);max-width:400px;margin:0 auto;">
    <div style="font-size:48px;margin-bottom:20px;color:#27ae60;">✓</div>
    <h1 style="font-size:24px;color:#333;margin:0 0 15px 0;">수신 거부되었습니다</h1>
    <p style="color:#666;font-size:14px;margin:0;">더 이상 이메일을 받지 않습니다.</p>
  </div>
</body>
</html>`

export async function POST(request: NextRequest) {
  try {
    const { uuid, campaign, list } = await request.json()

    if (!uuid) {
      return NextResponse.json(
        { error: '유효하지 않은 요청입니다.' },
        { status: 400 }
      )
    }

    // Supabase에 구독 취소 기록 저장
    const { error: insertError } = await supabase
      .from('unsubscribe_logs')
      .insert({
        subscriber_uuid: uuid,
        campaign_id: campaign || null,
        list_id: list || null,
        unsubscribed_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
    }

    return NextResponse.json({ success: true, message: '구독이 취소되었습니다.' })

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // GET 요청 처리 (이메일에서 직접 링크 클릭 시)
  const { searchParams } = new URL(request.url)
  const uuid = searchParams.get('uuid') || searchParams.get('u')
  const campaign = searchParams.get('c') || searchParams.get('campaign')
  const list = searchParams.get('l') || searchParams.get('list')

  if (uuid) {
    // 백그라운드로 Supabase에 구독 취소 기록 저장
    supabase
      .from('unsubscribe_logs')
      .insert({
        subscriber_uuid: uuid,
        campaign_id: campaign || null,
        list_id: list || null,
        unsubscribed_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })
      .then(() => {})
      .catch(() => {})
  }

  // 단순 HTML만 반환 - Vercel 페이지 없이 바로 표시
  return new NextResponse(SIMPLE_HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
