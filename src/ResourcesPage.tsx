import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CrisisResource } from './types'

const RESOURCES: CrisisResource[] = [
  { id: '1', name: '988 Suicide & Crisis Lifeline', description: '24/7 free, confidential support for people in distress.', phone: '988', url: 'https://988lifeline.org', categories: ['Crisis', 'Suicide'], available: '24/7' },
  { id: '2', name: 'Crisis Text Line', description: 'Text-based crisis support. Real humans, trained to help.', text: 'HOME to 741741', url: 'https://crisistextline.org', categories: ['Crisis', 'Text'], available: '24/7' },
  { id: '3', name: 'SAMHSA National Helpline', description: 'Free, confidential, 24/7 treatment referral for substance use.', phone: '1-800-662-4357', url: 'https://samhsa.gov', categories: ['Addiction', 'Recovery'], available: '24/7' },
  { id: '4', name: 'National Sexual Assault Hotline', description: 'RAINN provides support for survivors and their loved ones.', phone: '1-800-656-4673', url: 'https://rainn.org', categories: ['Trauma', 'Assault'], available: '24/7' },
  { id: '5', name: 'Veterans Crisis Line', description: 'For veterans and their families. Press 1 after calling 988.', phone: '988 then 1', text: '838255', url: 'https://veteranscrisisline.net', categories: ['Veteran', 'Crisis'], available: '24/7' },
  { id: '6', name: 'Postpartum Support International', description: 'Support for new parents experiencing depression or anxiety.', phone: '1-800-944-4773', url: 'https://postpartum.net', categories: ['Parenting', 'Mental Health'], available: 'Mon-Fri 9am-5pm' },
  { id: '7', name: 'National Domestic Violence Hotline', description: 'Support for anyone experiencing relationship abuse.', phone: '1-800-799-7233', text: 'START to 88788', url: 'https://thehotline.org', categories: ['Abuse', 'Crisis'], available: '24/7' },
  { id: '8', name: 'LGBTQ+ Trevor Lifeline', description: 'Crisis intervention and suicide prevention for LGBTQ+ youth.', phone: '1-866-488-7386', text: 'START to 678678', url: 'https://thetrevorproject.org', categories: ['LGBTQ+', 'Youth'], available: '24/7' },
  { id: '9', name: 'NAMI HelpLine', description: 'Information, referrals, and support for mental health conditions.', phone: '1-800-950-6264', url: 'https://nami.org', categories: ['Mental Health', 'Support'], available: 'Mon-Fri 10am-6pm' },
  { id: '10', name: 'GriefShare', description: 'Find local and online grief support groups.', url: 'https://griefshare.org', categories: ['Grief', 'Support Group'], available: 'Varies' },
  { id: '11', name: 'Smart Recovery', description: 'Self-empowering addiction recovery support meetings.', url: 'https://smartrecovery.org', categories: ['Recovery', 'Addiction'], available: 'Online 24/7' },
  { id: '12', name: '7 Cups', description: 'Free emotional support through trained listeners.', url: 'https://7cups.com', categories: ['Support', 'Listening'], available: '24/7' },
]

const CATEGORIES = ['All', 'Crisis', 'Addiction', 'Recovery', 'Veteran', 'Parenting', 'Grief', 'Mental Health', 'Support Group']

export default function ResourcesPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? RESOURCES
    : RESOURCES.filter(r => r.categories.includes(activeCategory))

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <button onClick={() => navigate('/sanctuary')} style={{ marginBottom: '1rem', padding: '0.5rem', background: 'none', border: 'none', color: '#a8b5a3', cursor: 'pointer' }}>← Back</button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#9e7b7b', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>❤️ Crisis & Resources</h1>

        <div style={{ background: '#1a2e18', border: '1px solid #3d2a2a', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#a8b5a3' }}>
            If you are in immediate danger, call <strong style={{ color: '#9e7b7b' }}>911</strong> or your local emergency number.
            The resources below are always here, always free, always confidential.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.75rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: activeCategory === cat ? '#9e7b7b' : '#1a2e18', color: activeCategory === cat ? 'white' : '#a8b5a3' }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {filtered.map(resource => (
            <div key={resource.id} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{resource.name}</h3>
                <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', background: '#0a0f0a', borderRadius: '999px', color: '#6b7a66' }}>{resource.available}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#a8b5a3', marginBottom: '0.75rem' }}>{resource.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {resource.phone && (
                  <a href={`tel:${resource.phone}`} style={{ fontSize: '0.75rem', color: '#9e7b7b', textDecoration: 'underline' }}>📞 {resource.phone}</a>
                )}
                {resource.text && (
                  <span style={{ fontSize: '0.75rem', color: '#6b7a66' }}>💬 Text: {resource.text}</span>
                )}
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#7fb069', textDecoration: 'underline' }}>🌐 Website →</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}