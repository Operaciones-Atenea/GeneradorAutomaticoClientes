import { Redis } from '@upstash/redis'
const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})import { ProposalData } from './types'

export async function saveProposal(proposal: ProposalData): Promise<void> {
  await kv.set(`proposal:${proposal.id}`, JSON.stringify(proposal))
}

export async function getProposal(id: string): Promise<ProposalData | null> {
  const data = await kv.get<string>(`proposal:${id}`)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data
}

export async function listProposals(): Promise<ProposalData[]> {
  const keys = await kv.keys('proposal:*')
  if (!keys.length) return []
  const proposals = await Promise.all(
    keys.map(async (key) => {
      const data = await kv.get<string>(key)
      if (!data) return null
      return typeof data === 'string' ? JSON.parse(data) : data
    })
  )
  return proposals
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
