'use client'

import { ProposalData } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'

export default function ProposalClient({ proposal }: { proposal: ProposalData }) {
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const isVisible = (id: string) => visibleSections.has(id)

  const whatsappUrl = `https://wa.me/${proposal.contactWhatsapp?.replace(/\D/g, '')}?text=Hola! Vi la propuesta de Atenea Growth para ${proposal.clientName} y quiero saber más.`
  const priorityOrder = ['high', 'medium', 'low']
  const sortedServices = [...proposal.services].sort(
    (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  )

  return (
    <div className="min-h-screen bg-[#020e1a] overflow-x-hidden">
      {/* Sticky nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-[#020e1a]/95 backdrop-blur border-b border-[#00d867]/10' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#00d867] rounded-md flex items-center justify-center">
              <span className="text-[#04192c] font-display font-extrabold text-xs">A</span>
            </div>
            <span className="font-display font-bold text-white text-sm hidden sm:block">Atenea Growth</span>
          </div>
          <div className="flex items-center gap-3">
            {proposal.contactWhatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-display font-bold text-[#04192c] bg-[#00d867] px-4 py-2 rounded-lg hover:bg-[#00d867]/90 transition-all"
              >
                Hablemos
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center grid-bg overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d867]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#04192c]/80 rounded-full blur-3xl" />
          {/* Decorative lines */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#00d867]/20 to-transparent" />
          <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#00d867]/10 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#00d867]/10 border border-[#00d867]/30 rounded-full px-4 py-2 mb-8 animate-fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d867] animate-pulse" />
                <span className="text-[#00d867] font-body text-xs tracking-widest uppercase">
                  Propuesta exclusiva para {proposal.clientName}
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] mb-6 animate-fade-up delay-100">
                {proposal.heroHeadline.split(' ').map((word, i) => (
                  <span key={i}>
                    {i === Math.floor(proposal.heroHeadline.split(' ').length / 2) ? (
                      <span className="text-[#00d867] text-glow">{word} </span>
                    ) : (
                      word + ' '
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-white/50 font-body text-lg leading-relaxed mb-10 animate-fade-up delay-200">
                {proposal.heroSubheadline}
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
                {proposal.calendlyUrl && (
                  <a
                    href={proposal.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00d867] text-[#04192c] font-display font-bold px-8 py-4 rounded-xl hover:bg-[#00d867]/90 hover:shadow-[0_0_30px_rgba(0,216,103,0.4)] transition-all text-sm"
                  >
                    Agendar reunión →
                  </a>
                )}
                {proposal.contactWhatsapp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#00d867]/30 text-[#00d867] font-display font-semibold px-8 py-4 rounded-xl hover:bg-[#00d867]/10 transition-all text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Stats card */}
            <div className="relative animate-fade-up delay-400">
              <div className="bg-[#04192c]/60 backdrop-blur border border-[#00d867]/20 rounded-2xl p-8 glow-green">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#00d867]/10 border border-[#00d867]/30 flex items-center justify-center text-lg">
                    🏢
                  </div>
                  <div>
                    <p className="font-display font-bold text-white">{proposal.clientName}</p>
                    <a
                      href={proposal.clientUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00d867]/60 text-xs font-body hover:text-[#00d867] transition-colors"
                    >
                      {proposal.clientUrl.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Servicios propuestos', value: `${proposal.services.length}` },
                    { label: 'Industria', value: proposal.clientIndustry },
                    { label: 'Prioridad alta', value: `${proposal.services.filter(s => s.priority === 'high').length} áreas` },
                    { label: 'Propuesta generada', value: new Date(proposal.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                      <p className="text-[#00d867] font-display font-bold text-lg mb-0.5">{stat.value}</p>
                      <p className="text-white/40 font-body text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-white/30 font-body text-xs">Preparado exclusivamente por Atenea Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-[#00d867]/40 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#00d867]/40" />
        </div>
      </section>

      {/* DIAGNOSIS */}
      <section
        id="diagnosis"
        data-observe
        className={`py-24 relative transition-all duration-700 ${isVisible('diagnosis') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-4">
            <span className="text-[#00d867] font-body text-xs tracking-widest uppercase">02 — Diagnóstico</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white mb-4">
            La situación actual
          </h2>
          <p className="text-white/50 font-body max-w-2xl mb-16 leading-relaxed">
            {proposal.problemStatement}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current state */}
            <div className="bg-[#04192c]/40 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center text-lg mb-4">⚠️</div>
              <h3 className="font-display font-bold text-white mb-3">Estado actual</h3>
              <p className="text-white/50 font-body text-sm leading-relaxed">{proposal.diagnosis.currentState}</p>
            </div>

            {/* Problems */}
            <div className="bg-[#04192c]/40 border border-red-500/20 rounded-2xl p-6">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-lg mb-4">🔴</div>
              <h3 className="font-display font-bold text-white mb-4">Problemas identificados</h3>
              <ul className="space-y-3">
                {proposal.diagnosis.mainProblems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5 text-xs">✕</span>
                    <span className="text-white/50 font-body text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-[#04192c]/40 border border-[#00d867]/20 rounded-2xl p-6">
              <div className="w-10 h-10 bg-[#00d867]/10 border border-[#00d867]/30 rounded-xl flex items-center justify-center text-lg mb-4">🚀</div>
              <h3 className="font-display font-bold text-white mb-4">Oportunidades detectadas</h3>
              <ul className="space-y-3">
                {proposal.diagnosis.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#00d867] mt-0.5 text-xs">✓</span>
                    <span className="text-white/50 font-body text-sm leading-relaxed">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitive gap */}
          <div
            className={`mt-6 bg-gradient-to-r from-[#00d867]/5 to-transparent border border-[#00d867]/20 rounded-2xl p-6 flex gap-4 items-start`}
          >
            <div className="text-2xl shrink-0">💡</div>
            <div>
              <p className="font-display font-semibold text-[#00d867] mb-1 text-sm">Gap competitivo</p>
              <p className="text-white/60 font-body text-sm leading-relaxed">{proposal.diagnosis.competitiveGap}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        data-observe
        className={`py-24 relative transition-all duration-700 delay-100 ${isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-4">
            <span className="text-[#00d867] font-body text-xs tracking-widest uppercase">03 — Servicios</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white mb-4">
            Lo que proponemos
          </h2>
          <p className="text-white/50 font-body max-w-2xl mb-16 leading-relaxed">
            Servicios seleccionados y personalizados específicamente para las necesidades de {proposal.clientName}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedServices.map((service, index) => (
              <div
                key={service.id}
                className={`relative group bg-[#04192c]/40 border rounded-2xl p-7 transition-all duration-300 hover:border-[#00d867]/40 hover:bg-[#04192c]/70 ${
                  service.priority === 'high' ? 'border-[#00d867]/30' : 'border-white/10'
                }`}
              >
                {service.priority === 'high' && (
                  <div className="absolute -top-3 right-6 bg-[#00d867] text-[#04192c] font-display font-bold text-xs px-3 py-1 rounded-full">
                    Prioridad alta
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    service.priority === 'high'
                      ? 'bg-[#00d867]/10 border border-[#00d867]/30'
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-white/50 font-body text-sm leading-relaxed mb-4">{service.description}</p>
                    <div className="flex items-center gap-2 bg-[#00d867]/5 border border-[#00d867]/20 rounded-lg px-3 py-2">
                      <span className="text-[#00d867] text-xs">→</span>
                      <span className="text-[#00d867] font-body text-xs">{service.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {proposal.pricing && proposal.pricing.length > 0 && (
        <section
          id="pricing"
          data-observe
          className={`py-24 relative transition-all duration-700 delay-100 ${isVisible('pricing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-4">
              <span className="text-[#00d867] font-body text-xs tracking-widest uppercase">04 — Inversión</span>
            </div>
            <h2 className="font-display text-4xl font-extrabold text-white mb-4">
              Planes y precios
            </h2>
            <p className="text-white/50 font-body max-w-2xl mb-16 leading-relaxed">
              Opciones diseñadas para crecer con {proposal.clientName} en cada etapa.
            </p>

            <div className={`grid gap-6 ${proposal.pricing.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : proposal.pricing.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
              {proposal.pricing.map((tier, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                    tier.highlighted
                      ? 'bg-[#04192c] border-2 border-[#00d867] shadow-[0_0_60px_rgba(0,216,103,0.15)]'
                      : 'bg-[#04192c]/40 border border-white/10'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00d867] text-[#04192c] font-display font-extrabold text-xs px-5 py-1.5 rounded-full">
                      RECOMENDADO
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="font-display font-bold text-white/60 text-sm mb-3 uppercase tracking-wider">{tier.name}</p>
                    <p className={`font-display font-extrabold text-4xl ${tier.highlighted ? 'text-[#00d867]' : 'text-white'}`}>
                      {tier.price}
                    </p>
                  </div>
                  {tier.description && (
                    <p className="text-white/50 font-body text-sm leading-relaxed mb-8 flex-1">{tier.description}</p>
                  )}
                  <a
                    href={proposal.calendlyUrl || whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center font-display font-bold text-sm py-4 rounded-xl transition-all ${
                      tier.highlighted
                        ? 'bg-[#00d867] text-[#04192c] hover:bg-[#00d867]/90'
                        : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    Empezar con este plan →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section
        id="cta"
        data-observe
        className={`py-24 transition-all duration-700 delay-100 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#04192c] to-[#020e1a] border border-[#00d867]/30 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#00d867]/3 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#00d867]/50 to-transparent" />

            <div className="relative z-10">
              <span className="text-[#00d867] font-body text-xs tracking-widest uppercase mb-6 block">
                05 — Siguiente paso
              </span>
              <h2 className="font-display text-4xl font-extrabold text-white mb-4">
                ¿Listo para crecer?
              </h2>
              <p className="text-white/50 font-body max-w-lg mx-auto mb-10 leading-relaxed">
                Esta propuesta fue preparada exclusivamente para {proposal.clientName}. Agendá una llamada o escribinos para resolver tus dudas.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                {proposal.calendlyUrl && (
                  <a
                    href={proposal.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00d867] text-[#04192c] font-display font-extrabold px-10 py-5 rounded-xl hover:bg-[#00d867]/90 hover:shadow-[0_0_40px_rgba(0,216,103,0.4)] transition-all text-base"
                  >
                    📅 Agendar reunión gratuita
                  </a>
                )}
                {proposal.contactWhatsapp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-[#00d867]/40 text-[#00d867] font-display font-bold px-10 py-5 rounded-xl hover:bg-[#00d867]/10 hover:border-[#00d867] transition-all text-base flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Escribir por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00d867] rounded flex items-center justify-center">
              <span className="text-[#04192c] font-display font-extrabold text-xs">A</span>
            </div>
            <span className="text-white/30 font-body text-xs">Atenea Growth</span>
          </div>
          <p className="text-white/20 font-body text-xs">
            Propuesta generada el {new Date(proposal.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </footer>
    </div>
  )
}
