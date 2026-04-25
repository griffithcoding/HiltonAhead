'use client'

import type { Business } from '@/data/localBusinesses'
import { useState, useEffect, useRef } from 'react'

interface Props {
  businesses: Business[]
  featuredBusiness?: Business
}

export default function IndustryNav({ businesses, featuredBusiness }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const allBusinesses = featuredBusiness
    ? [featuredBusiness, ...businesses]
    : businesses

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )

    allBusinesses.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [allBusinesses])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveId(id)
  }

  return (
    <div className="sticky top-0 z-20 -mx-5 border-b border-rule-soft bg-sand/90 px-5 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:border-rule-soft sm:bg-sand-soft">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <span className="mr-1 shrink-0 self-center text-xs font-semibold uppercase tracking-widest text-ink-soft">
          Jump to:
        </span>
        {allBusinesses.map(({ id, name, featured }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeId === id
                ? 'border-ocean bg-ocean text-sand shadow-md'
                : featured
                  ? 'border-gold/50 bg-gold/10 text-gold-deep hover:bg-gold/20'
                  : 'border-rule-soft bg-sand text-ink-soft hover:border-ocean/40 hover:text-ocean'
            }`}
          >
            {featured && '⭐ '}
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
