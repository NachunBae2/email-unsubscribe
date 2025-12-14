import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  // GET 요청도 처리 (이메일 클라이언트에서 직접 링크 클릭 시)
  const { searchParams } = new URL(request.url)
  const uuid = searchParams.get('uuid') || searchParams.get('u')
  const campaign = searchParams.get('c') || searchParams.get('campaign')
  const list = searchParams.get('l') || searchParams.get('list')

  if (uuid) {
    // 구독 취소 기록
    await supabase
      .from('unsubscribe_logs')
      .insert({
        subscriber_uuid: uuid,
        campaign_id: campaign || null,
        list_id: list || null,
        unsubscribed_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })
  }

  // 구독 취소 페이지로 리다이렉트
  return NextResponse.redirect(new URL(`/subscription?uuid=${uuid}&c=${campaign}&l=${list}`, request.url))
}
