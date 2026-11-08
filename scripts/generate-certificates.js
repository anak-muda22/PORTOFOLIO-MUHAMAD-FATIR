// Scans public/certificates and writes public/certificates.json.
// Optional metadata: public/certificates/metadata.json { "file.png": {title,issuer,date,credentialId,verifyUrl,category} }
import fs from 'fs'
import path from 'path'

const dir = 'public/certificates'
fs.mkdirSync(dir, { recursive: true })
const metadataPath = path.join(dir, 'metadata.json')
const metadata = fs.existsSync(metadataPath)
  ? JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
  : {}
const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.pdf']
const certificates = fs.readdirSync(dir)
  .filter(file => extensions.includes(path.extname(file).toLowerCase()))
  .sort()
  .map(file => {
    const details = metadata[file] || {}
    const extension = path.extname(file).toLowerCase()
    return {
      file,
      url: `./certificates/${encodeURIComponent(file)}`,
      type: extension === '.pdf' ? 'pdf' : 'image',
      title: details.title || path.basename(file, extension).replace(/[-_]+/g, ' '),
      issuer: details.issuer || '',
      date: details.date || '',
      year: (details.date || '').slice(0, 4),
      credentialId: details.credentialId || '',
      verifyUrl: details.verifyUrl || '',
      category: details.category || 'Other',
    }
  })

fs.writeFileSync('public/certificates.json', JSON.stringify(certificates, null, 2))
console.log(`certificates.json: ${certificates.length} item(s)`)
