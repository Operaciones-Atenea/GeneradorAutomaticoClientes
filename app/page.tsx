'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PricingItem } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'idle' | 'analyzing' | 'generating' | 'done'>('idle')

  const [form, setForm] = useState({
    clientName: '',
    clientUrl: '',
    clientIndustry: '',
    contactName: '',
    contactWhatsapp: '',
    calendlyUrl: '',
    extraContext: '',
  })

  const [pricing, setPricing] = useState<PricingItem[]>([
    { name: 'Starter', price: '', description: '', highlighted: false },
    { name: 'Growth', price: '', description: '', highlighted: true },
    { name: 'Scale', price: '', description: '', highlighted: false },
  ])

  const updatePricing = (index: number, field: keyof PricingItem, value: string | boolean) => {
    setPricing(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const addPricingTier = () => {
    setPricing(prev => [...prev, { name: '', price: '', description: '', highlighted: false }])
  }

  const removePricingTier = (index: number) => {
    setPricing(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setStep('analyzing')

    try {
      setTimeout(() => setStep('generating'), 3000)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pricing: pricing.filter(p => p.name && p.price),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar')
      }

      setStep('done')
      setTimeout(() => router.push(`/p/${data.id}`), 1000)
    } catch (err: any) {
      setError(err.message)
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#04192c]/60 border border-[#00d867]/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00d867]/60 focus:bg-[#04192c] transition-all font-body text-sm"
  const labelClass = "block text-xs font-display font-semibold text-[#00d867]/70 uppercase tracking-widest mb-2"

  return (
    <div className="min-h-screen bg-[#020e1a] grid-bg">
      {/* Header */}
      <div className="border-b border-[#00d867]/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00d867] rounded-lg flex items-center justify-center">
              <span className="text-[#04192c] font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-white text-lg">Atenea Growth</span>
            <span className="text-white/20 text-sm font-body">/ Generador de Propuestas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00d867] animate-pulse"></span>
            <span className="text-xs text-white/40 font-body">Sistema activo</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-[#020e1a]/95 z-50 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-[#00d867]/20 border-t-[#00d867] rounded-full animate-spin mx-auto mb-6"></div>
              <div className="font-display text-2xl font-bold text-white mb-3">
                {step === 'analyzing' && '🔍 Analizando el cliente...'}
                {step === 'generating' && '✨ Generando la propuesta...'}
                {step === 'done' && '✅ ¡Propuesta lista!'}
              </div>
              <p className="text-white/40 font-body text-sm">
                {step === 'analyzing' && 'La IA está estudiando el negocio y la industria'}
                {step === 'generating' && 'Creando diagnóstico y servicios personalizados'}
                {step === 'done' && 'Redirigiendo a la propuesta...'}
              </p>
              <div className="mt-8 flex gap-2 justify-center">
                {['analyzing', 'generating', 'done'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      ['analyzing', 'generating', 'done'].indexOf(step) >= i
                        ? 'w-12 bg-[#00d867]'
                        : 'w-4 bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-10">
          <h1 className="font-display text-4xl font-extrabold text-white mb-3">
            Nueva Propuesta
          </h1>
          <p className="text-white/40 font-body text-sm">
            Completá los datos del cliente. La IA analizará el negocio y generará una propuesta personalizada.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 font-body text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Info */}
          <div className="bg-[#04192c]/40 border border-[#00d867]/10 rounded-2xl p-6">
            <h2 className="font-display text-sm font-bold text-[#00d867] uppercase tracking-widest mb-6">
              01 — Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre de la empresa *</label>
                <input
                  type="text"
                  required
                  value={form.clientName}
                  onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))}
                  placeholder="Ej: Tiendas Landmark"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>URL del sitio web *</label>
                <input
                  type="url"
                  required
                  value={form.clientUrl}
                  onChange={e => setForm(p => ({ ...p, clientUrl: e.target.value }))}
                  placeholder="https://cliente.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Industria / Rubro *</label>
                <input
                  type="text"
                  required
                  value={form.clientIndustry}
                  onChange={e => setForm(p => ({ ...p, clientIndustry: e.target.value }))}
                  placeholder="Ej: Retail de moda, eCommerce, SaaS..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Nombre del contacto</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))}
                  placeholder="Ej: Juan García"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp (con código de país)</label>
                <input
                  type="text"
                  value={form.contactWhatsapp}
                  onChange={e => setForm(p => ({ ...p, contactWhatsapp: e.target.value }))}
                  placeholder="+54 9 11 1234-5678"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Link de Calendly / Reunión</label>
                <input
                  type="url"
                  value={form.calendlyUrl}
                  onChange={e => setForm(p => ({ ...p, calendlyUrl: e.target.value }))}
                  placeholder="https://calendly.com/atenea/30min"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Contexto adicional (opcional)</label>
                <textarea
                  value={form.extraContext}
                  onChange={e => setForm(p => ({ ...p, extraContext: e.target.value }))}
                  placeholder="Ej: Ya tienen Meta Ads corriendo pero con ROAS bajo. Están lanzando una nueva línea de productos..."
                  rows={3}
                  className={inputClass + ' resize-none'}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#04192c]/40 border border-[#00d867]/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-sm font-bold text-[#00d867] uppercase tracking-widest">
                02 — Pricing
              </h2>
              <button
                type="button"
                onClick={addPricingTier}
                className="text-xs text-[#00d867]/60 hover:text-[#00d867] font-body border border-[#00d867]/20 hover:border-[#00d867]/50 px-3 py-1.5 rounded-lg transition-all"
              >
                + Agregar plan
              </button>
            </div>
            <div className="space-y-4">
              {pricing.map((tier, index) => (
                <div key={index} className={`border rounded-xl p-4 transition-all ${tier.highlighted ? 'border-[#00d867]/40 bg-[#00d867]/5' : 'border-white/10'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className={labelClass}>Nombre del plan</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={e => updatePricing(index, 'name', e.target.value)}
                        placeholder="Growth"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Precio / Inversión</label>
                      <input
                        type="text"
                        value={tier.price}
                        onChange={e => updatePricing(index, 'price', e.target.value)}
                        placeholder="USD 1.500/mes"
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelClass}>Descripción corta</label>
                      <input
                        type="text"
                        value={tier.description}
                        onChange={e => updatePricing(index, 'description', e.target.value)}
                        placeholder="Incluye paid media + reportes"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          onClick={() => updatePricing(index, 'highlighted', !tier.highlighted)}
                          className={`w-10 h-5 rounded-full transition-all cursor-pointer ${tier.highlighted ? 'bg-[#00d867]' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition-all ${tier.highlighted ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-xs text-white/50 font-body">Destacado</span>
                      </label>
                      {pricing.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePricingTier(index)}
                          className="text-red-400/50 hover:text-red-400 transition-colors text-lg leading-none ml-auto"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00d867] hover:bg-[#00d867]/90 text-[#04192c] font-display font-bold text-lg py-5 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(0,216,103,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generar Propuesta con IA →
          </button>
          <p className="text-center text-white/20 font-body text-xs">
            La generación toma ~15 segundos. Se creará un link permanente para compartir con el cliente.
          </p>
        </form>
      </div>
    </div>
  )
}
