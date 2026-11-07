import { ImageResponse } from 'next/og'

export const alt = 'Matias Campos — Développeur web et mobile freelance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px', background: '#050505', color: '#f5f5f5', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26 }}><span style={{ color: '#a5a7ff' }}>{'<W />'}</span><span>Matias Campos</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 72, lineHeight: 1.1, letterSpacing: '-3px' }}><span>Développeur</span><span style={{ color: '#a5a7ff' }}>Web & Mobile</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #33333d', paddingTop: 24, fontSize: 24 }}><span>Sites vitrines sur mesure</span><span style={{ color: '#a5a7ff' }}>wazted.fr</span></div>
    </div>, size
  )
}
