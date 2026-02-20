import { getProposal } from '@/lib/storage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const proposal = await getProposal(params.id)
  if (!proposal) return { title: 'Propuesta no encontrada' }
  return {
    title: `Propuesta para ${proposal.clientName} — Atenea Growth`,
    description: proposal.heroSubheadline,
  }
}

export default async function ProposalPage({ params }: { params: { id: string } }) {
  const proposal = await getProposal(params.id)
  if (!proposal) notFound()
  return <ProposalClient proposal={proposal} />
}
