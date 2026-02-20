export interface ProposalData {
  id: string
  createdAt: string

  // Client info (entered manually)
  clientName: string
  clientUrl: string
  clientIndustry: string
  contactName: string
  contactWhatsapp: string
  calendlyUrl: string

  // Pricing (entered manually)
  pricing: PricingItem[]

  // AI-generated content
  diagnosis: Diagnosis
  services: ServiceRecommendation[]
  heroHeadline: string
  heroSubheadline: string
  problemStatement: string
}

export interface PricingItem {
  name: string
  price: string
  description: string
  highlighted?: boolean
}

export interface Diagnosis {
  currentState: string
  mainProblems: string[]
  opportunities: string[]
  competitiveGap: string
}

export interface ServiceRecommendation {
  id: string
  name: string
  description: string
  impact: string
  icon: string
  priority: 'high' | 'medium' | 'low'
}

export interface GenerateRequest {
  clientName: string
  clientUrl: string
  clientIndustry: string
  contactName: string
  contactWhatsapp: string
  calendlyUrl: string
  pricing: PricingItem[]
  extraContext?: string
}
