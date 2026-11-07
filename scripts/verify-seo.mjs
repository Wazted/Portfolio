import assert from 'node:assert/strict'

const base = new URL(process.argv[2] || 'http://localhost:3000')
const canonicalOrigin = 'https://www.wazted.fr'
const read = async path => {
  const response = await fetch(new URL(path, base))
  assert.equal(response.status, 200, `${path}: expected HTTP 200`)
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${path}: noindex HTTP header`)
  return response.text()
}
const sitemap = await read('/sitemap.xml')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))
assert.equal(urls.length, 5, 'Expected five indexable pages')
const titles = new Set()
const descriptions = new Set()
for (const url of urls) {
  assert.equal(url.origin, canonicalOrigin, 'Sitemap must use the public canonical domain')
  const html = await read(url.pathname)
  const tag = (name, attr, value) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match => match[0]).find(item => item.includes(`${attr}="${value}"`)) || ''
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = tag('meta', 'name', 'description').match(/content="([^"]+)"/)?.[1]
  assert.ok(title && !titles.has(title), `${url.pathname}: missing or duplicate title`)
  assert.ok(description && !descriptions.has(description), `${url.pathname}: missing or duplicate description`)
  titles.add(title)
  descriptions.add(description)
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${url.pathname}: expected one server-rendered h1`)
  assert.ok(/<html[^>]*lang="fr"/.test(html), `${url.pathname}: expected French language`)
  const canonical = tag('link', 'rel', 'canonical').match(/href="([^"]+)"/)?.[1]
  assert.equal(new URL(canonical).href, url.href, `${url.pathname}: incorrect canonical`)
  assert.ok(!/noindex/.test(tag('meta', 'name', 'robots')), `${url.pathname}: noindex meta tag`)
  assert.ok(tag('meta', 'property', 'og:image'), `${url.pathname}: missing social image`)
  const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  assert.ok(data.length, `${url.pathname}: missing structured data`)
  for (const [, json] of data) assert.ok(JSON.parse(json)['@context'])
  console.log(`PASS ${url.pathname}: HTML, metadata, canonical, structured data`)
}
const robots = await read('/robots.txt')
assert.ok(robots.includes('Allow: /') && robots.includes(`${canonicalOrigin}/sitemap.xml`), 'Crawler access or sitemap missing')
const image = await fetch(new URL('/opengraph-image', base))
assert.equal(image.status, 200)
assert.match(image.headers.get('content-type') || '', /image\/png/)
const missing = await fetch(new URL('/realisations/inexistant', base))
assert.equal(missing.status, 404, 'Unknown case studies must return HTTP 404')
console.log('PASS sitemap, robots, social image and HTTP 404')
