import { getProposal } from '@/lib/storage'
import { notFound } from 'next/navigation'
import ProposalClient from './ProposalClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const proposal = await getProposal(id)
  if (!proposal) return { title: 'Propuesta no encontrada' }
  return {
    title: `Propuesta para ${proposal.clientName} — Atenea Growth`,
    description: proposal.heroSubheadline,
  }
}

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const proposal = await getProposal(id)
  if (!proposal) notFound()
  return <ProposalClient proposal={proposal} />
}
