import { NextRequest, NextResponse } from 'next/server'
import { getProposal, listProposals } from '@/lib/storage'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const proposal = await getProposal(id)
    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }
    return NextResponse.json(proposal)
  }

  // List all
  const proposals = await listProposals()
  return NextResponse.json(proposals)
}
