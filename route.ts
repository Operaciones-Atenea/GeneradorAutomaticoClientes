import { NextRequest, NextResponse } from 'next/server'
import { generateProposal } from '@/lib/ai'
import { saveProposal } from '@/lib/storage'
import { GenerateRequest } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    // Validate required fields
    if (!body.clientName || !body.clientUrl || !body.clientIndustry) {
      return NextResponse.json(
        { error: 'clientName, clientUrl y clientIndustry son requeridos' },
        { status: 400 }
      )
    }

    // Generate with AI
    const proposal = await generateProposal(body)

    // Save to KV
    await saveProposal(proposal)

    return NextResponse.json({ id: proposal.id, success: true })
  } catch (error) {
    console.error('Error generating proposal:', error)
    return NextResponse.json(
      { error: 'Error al generar la propuesta' },
      { status: 500 }
    )
  }
}
