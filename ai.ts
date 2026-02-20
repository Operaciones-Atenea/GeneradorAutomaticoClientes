import Anthropic from '@anthropic-ai/sdk'
import { GenerateRequest, ProposalData, Diagnosis, ServiceRecommendation } from './types'
import { v4 as uuidv4 } from 'uuid'

const client = new Anthropic()

const ALL_SERVICES = [
  {
    id: 'paid-media',
    name: 'Paid Media (Meta + Google Ads)',
    icon: '📈',
  },
  {
    id: 'cro',
    name: 'CRO + Análisis de Funnel',
    icon: '🎯',
  },
  {
    id: 'ai-creatives',
    name: 'AI Creatives + AdGen',
    icon: '🤖',
  },
  {
    id: 'automation',
    name: 'Automatización con IA',
    icon: '⚡',
  },
]

export async function generateProposal(request: GenerateRequest): Promise<ProposalData> {
  const prompt = `Sos un experto en growth marketing analizando el sitio web de un potencial cliente para Atenea Growth, una agencia especializada en:
- Paid Media (Meta + Google Ads)
- CRO + Análisis de Funnel
- AI Creatives + AdGen (creación de creatividades con IA)
- Automatización con IA (workflows con n8n, etc.)

**DATOS DEL CLIENTE:**
- Empresa: ${request.clientName}
- URL: ${request.clientUrl}
- Industria: ${request.clientIndustry}
- Contexto adicional: ${request.extraContext || 'Ninguno'}

**TU TAREA:**
Analiza todo lo que sabes sobre esta empresa/industria y genera una propuesta comercial personalizada y convincente.

Respondé ÚNICAMENTE con un JSON válido con esta estructura exacta:

{
  "heroHeadline": "Titular impactante y personalizado para ${request.clientName} (máx 10 palabras, en español)",
  "heroSubheadline": "Subtítulo que describe el resultado esperado (máx 20 palabras)",
  "problemStatement": "Párrafo de 2-3 oraciones describiendo el problema central que tiene ${request.clientName} en su marketing digital actual, basado en su industria y lo que se puede inferir de su negocio. Muy específico, no genérico.",
  "diagnosis": {
    "currentState": "Descripción de cómo está el marketing digital de empresas como ${request.clientName} típicamente en ${request.clientIndustry}",
    "mainProblems": [
      "Problema específico 1 para esta industria",
      "Problema específico 2",
      "Problema específico 3"
    ],
    "opportunities": [
      "Oportunidad de crecimiento 1",
      "Oportunidad de crecimiento 2",
      "Oportunidad de crecimiento 3"
    ],
    "competitiveGap": "Descripción del gap competitivo que tiene ${request.clientName} vs. competidores que sí invierten en growth marketing"
  },
  "services": [
    {
      "id": "paid-media",
      "name": "Paid Media (Meta + Google Ads)",
      "description": "Descripción personalizada de cómo este servicio beneficia a ${request.clientName} específicamente",
      "impact": "Impacto concreto esperado (ej: +40% en conversiones en 90 días)",
      "icon": "📈",
      "priority": "high"
    },
    {
      "id": "cro",
      "name": "CRO + Análisis de Funnel",
      "description": "Descripción personalizada para ${request.clientName}",
      "impact": "Impacto concreto esperado",
      "icon": "🎯",
      "priority": "high"
    },
    {
      "id": "ai-creatives",
      "name": "AI Creatives + AdGen",
      "description": "Descripción personalizada para ${request.clientName}",
      "impact": "Impacto concreto esperado",
      "icon": "🤖",
      "priority": "medium"
    },
    {
      "id": "automation",
      "name": "Automatización con IA",
      "description": "Descripción personalizada para ${request.clientName}",
      "impact": "Impacto concreto esperado",
      "icon": "⚡",
      "priority": "medium"
    }
  ]
}

IMPORTANTE: Todo el contenido debe ser en español, personalizado para ${request.clientName}, específico para la industria ${request.clientIndustry}, y sonar como un consultor senior que conoce el negocio.`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  // Extract JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in response')

  const aiData = JSON.parse(jsonMatch[0])

  const proposal: ProposalData = {
    id: uuidv4().slice(0, 8),
    createdAt: new Date().toISOString(),
    clientName: request.clientName,
    clientUrl: request.clientUrl,
    clientIndustry: request.clientIndustry,
    contactName: request.contactName,
    contactWhatsapp: request.contactWhatsapp,
    calendlyUrl: request.calendlyUrl,
    pricing: request.pricing,
    heroHeadline: aiData.heroHeadline,
    heroSubheadline: aiData.heroSubheadline,
    problemStatement: aiData.problemStatement,
    diagnosis: aiData.diagnosis,
    services: aiData.services,
  }

  return proposal
}
