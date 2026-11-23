import fs from 'node:fs/promises'
import path from 'node:path'

const ASSETS = [
  ['bgTwillLight', 'background-p4l-light.webp', 'https://www.patches4less.com/build/assets/background-p4l-light-BfK_lPMx.webp'],
  ['bgTwillDark', 'background-p4l-dark.webp', 'https://www.patches4less.com/build/assets/background-p4l-dark-D0txnuuJ.webp'],
  ['wallOPatches', 'wall-o-patches.webp', 'https://www.patches4less.com/img/wall-o-patches~Ymx1cj0yJnE9NjAmc2U9d2VicCZ3PTE1MDA.webp?s=e8078a29567558b252739ffe34c0e27d'],
  ['miscPatchStyles', 'misc-patch-styles.webp', 'https://www.patches4less.com/img/home/misc-patch-styles~cT03MCZzZT13ZWJwJnc9OTAw.webp?s=90d09225decdd939270138ea7dd3b64f'],
  ['typeEmbroidered', 'types/embroidered.webp', 'https://www.patches4less.com/img/types/embroidered~cT03MCZzZT13ZWJwJnc9MjQw.webp?s=9066154d57c9ba32f367395c4426802f'],
  ['typeWoven', 'types/woven.webp', 'https://www.patches4less.com/img/types/woven~cT03MCZzZT13ZWJwJnc9MjQw.webp?s=aa9b72667a8bed128847492f1e137bd7'],
  ['typePvc', 'types/pvc.webp', 'https://www.patches4less.com/img/types/pvc~cT03MCZzZT13ZWJwJnc9MjQw.webp?s=a1dd0a8d7fe366c0c5cb2c5347d24bb7'],
  ['typePrinted', 'types/printed.webp', 'https://www.patches4less.com/img/types/printed~cT03MCZzZT13ZWJwJnc9MjQw.webp?s=fca5ac8f277de8180fa11f6359e04819'],
  ['typeName', 'types/name.webp', 'https://www.patches4less.com/img/types/name~cT03MCZzZT13ZWJwJnc9MjQw.webp?s=e60ce23f7604bd6ce74abef3a54b71fe'],
  ['typeLeather', 'types/leather.webp', 'https://www.patches4less.com/img/types/leather~cT03MCZzZT13ZWJwJnc9MjQw.webp?s=2b4cace16cba7a589b5be07a73239f3f'],
  ['home35', 'home3.5.webp', 'https://www.patches4less.com/img/misc/home3.5~cT03MCZzZT13ZWJwJnc9MTAyNA.webp?s=b3781438c9ad13717436ea174ca74839'],
  ['ytThumb', 'yt-how-to-order.webp', 'https://i.ytimg.com/vi_webp/I-k7gbA-3UU/sddefault.webp'],
  ['hatHero', 'hat-hero.webp', 'https://www.patches4less.com/img/styles/hat-hero~cT04MCZzZT13ZWJwJnc9OTYw.webp?s=384662756d915b30f3f9ac62e1088551'],
  ['purposeUniforms', 'home/uniforms.webp', 'https://www.patches4less.com/images/home/uniforms.webp'],
  ['purposeBusiness', 'home/business.webp', 'https://www.patches4less.com/images/home/business.webp'],
  ['purposePersonal', 'home/personal.webp', 'https://www.patches4less.com/images/home/personal.webp'],
  ['purposeEvent', 'home/event.webp', 'https://www.patches4less.com/images/home/event.webp'],
  ['home4', 'home4.webp', 'https://www.patches4less.com/img/misc/home4~cT03MCZzZT13ZWJw.webp?s=8f3722ca3f4663134ed4570dbdc29f1a'],
  ['step1Napkin', 'designing/design-napkin.webp', 'https://www.patches4less.com/images/designing/design-napkin.webp'],
  ['step2Proof', 'designing/design-proof-1.webp', 'https://www.patches4less.com/images/designing/design-proof-1.webp'],
  ['step3Patch', 'designing/embroidered-patch-example.webp', 'https://www.patches4less.com/images/designing/embroidered-patch-example.webp'],
  ['lowPricesWhite', 'misc/low-prices-white.webp', 'https://www.patches4less.com/images/misc/low-prices-white.webp'],
  ['bestPrice', 'misc/best-price.webp', 'https://www.patches4less.com/images/misc/best-price.webp'],
  ['designProcess', 'misc/design-process.webp', 'https://www.patches4less.com/images/misc/design-process.webp'],
  ['variety1', 'misc/variety-1.webp', 'https://www.patches4less.com/images/misc/variety-1.webp'],
  ['clientAmazon', 'clients/amazon.webp', 'https://www.patches4less.com/images/clients/amazon.webp'],
  ['clientAcs', 'clients/american-cancer-society.webp', 'https://www.patches4less.com/images/clients/american-cancer-society.webp'],
  ['clientAtt', 'clients/att.webp', 'https://www.patches4less.com/images/clients/att.webp'],
  ['clientBww', 'clients/buffalo-wild-wings.webp', 'https://www.patches4less.com/images/clients/buffalo-wild-wings.webp'],
  ['clientDunkin', 'clients/dunkin-donuts.webp', 'https://www.patches4less.com/images/clients/dunkin-donuts.webp'],
  ['clientGoogle', 'clients/google.webp', 'https://www.patches4less.com/images/clients/google.webp'],
  ['clientIndyCar', 'clients/indy-car.png', 'https://www.patches4less.com/images/clients/indy-car.png'],
  ['clientMicrosoft', 'clients/microsoft.webp', 'https://www.patches4less.com/images/clients/microsoft.webp'],
  ['clientNasa', 'clients/nasa.webp', 'https://www.patches4less.com/images/clients/nasa.webp'],
  ['clientSans', 'clients/sans.webp', 'https://www.patches4less.com/images/clients/sans.webp'],
  ['clientSkillz', 'clients/skillz.webp', 'https://www.patches4less.com/images/clients/skillz.webp'],
  ['clientWalkingDead', 'clients/the-walking-dead.webp', 'https://www.patches4less.com/images/clients/the-walking-dead.webp'],
  ['clientUnitedWay', 'clients/united-way.webp', 'https://www.patches4less.com/images/clients/united-way.webp'],
  ['bumperIronOn', 'bumper-iron-on.webp', 'https://www.patches4less.com/img/iron-on/bumper-iron-on~cT04NSZzZT13ZWJwJnc9MTkyMA.webp?s=dce379fbbc801f084ed55e58a3ffce7e'],
  ['blogQr', 'blog/p4l-qr-codes-01.jpg', 'https://blogmedia.patches4less.com/2737/responsive-images/p4l-qr-codes-01___responsive_895_503.jpg'],
  ['blogMinimal', 'blog/p4l-minimal-02.jpg', 'https://blogmedia.patches4less.com/2730/responsive-images/p4l-minimal-02___responsive_307_173.jpg'],
  ['blogDirect', 'blog/p4l-patches-vs-direct-02.jpg', 'https://blogmedia.patches4less.com/2727/responsive-images/p4l-patches-vs-direct-02___responsive_307_173.jpg'],
  ['bbbSeal', 'tjm-promos-225617490.png', 'https://seal-centralflorida.bbb.org/logo/rbhzbum/tjm-promos-225617490.png'],
  ['favicon32', 'favicon-32x32.png', 'https://www.patches4less.com/favicon-32x32.png'],
  ['footerPaw', 'patches-paw.webp', 'https://www.patches4less.com/images/patches-paw.webp'],
]

// Also locate hashed mask assets referenced by the live CSS bundle
try {
  const cssRes = await fetch('https://www.patches4less.com/build/assets/app-kpG4sdX1.css', {
    signal: AbortSignal.timeout(15000),
  })
  if (cssRes.ok) {
    const cssText = await cssRes.text()
    const maskKeys = [
      ['maskPatchStyles', 'masks/misc-patch-styles-mask.webp', /\/build\/assets\/misc-patch-styles-mask-[A-Za-z0-9_-]+\.webp/],
      ['maskHome35', 'masks/home3.5-mask.webp', /\/build\/assets\/home3\.5-mask-[A-Za-z0-9_-]+\.webp/],
      ['maskHome4', 'masks/home4-mask.webp', /\/build\/assets\/home4-mask-[A-Za-z0-9_-]+\.webp/],
    ]
    for (const [key, relPath, regex] of maskKeys) {
      const match = cssText.match(regex)
      if (match) {
        ASSETS.push([key, relPath, `https://www.patches4less.com${match[0]}`])
      }
    }
  }
} catch {
  // ignore mask lookup failures
}

const publicDir = path.resolve('public/assets')
const manifest = {}
let localCount = 0
let fallbackCount = 0

await Promise.all(
  ASSETS.map(async ([key, relPath, url]) => {
    const dest = path.join(publicDir, relPath)
    await fs.mkdir(path.dirname(dest), { recursive: true })
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(15000),
      })
      const contentType = res.headers.get('content-type') || ''
      if (res.ok && contentType.startsWith('image/')) {
        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length > 0) {
          await fs.writeFile(dest, buf)
          manifest[key] = `/assets/${relPath}`
          localCount++
          return
        }
      }
      manifest[key] = url
      fallbackCount++
    } catch {
      manifest[key] = url
      fallbackCount++
    }
  }),
)

const orderedManifest = Object.fromEntries(ASSETS.map(([key]) => [key, manifest[key]]))
const content = `// Auto-generated by scripts/fetch-assets.mjs\nexport const ASSETS = ${JSON.stringify(orderedManifest, null, 2)}\n`
await fs.mkdir(path.resolve('src/data'), { recursive: true })
await fs.writeFile(path.resolve('src/data/assets.js'), content, 'utf8')
console.log(`Assets ready: ${localCount} downloaded locally, ${fallbackCount} kept as live URLs.`)
