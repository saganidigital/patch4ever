import { ASSETS } from './assets'

export const CONTACT = {
  email: 'sales@patch4ever.com',
  phone: '1 866-847-2824',
  phoneHref: 'tel:+1-866-847-2824',
  hours: 'Monday - Friday 8am-5pm EST',
  address: '511 NW 48th Terrace Ocala, FL 34482',
}

export const PATCH_TYPES = [
  {
    id: 'embroidered',
    name: 'Embroidered',
    fullName: 'Embroidered patches',
    fromPrice: '$0.47',
    badge: 'Most Popular',
    badgeTone: 'accent',
    href: '/embroidered-patches',
    image: ASSETS.typeEmbroidered,
    tilt: '-3deg',
    turnaround: '14–22 days',
    minQty: 10,
    tagline: 'Classic raised thread texture for uniforms, jackets, clubs & hats.',
    description:
      'Our #1 seller since 2003. Crafted with durable twill backing, crisp merrowed or hot-cut borders, and up to 7 free thread colors.',
  },
  {
    id: 'woven',
    name: 'Woven',
    fullName: 'Woven patches',
    fromPrice: '$0.67',
    badge: null,
    href: '/woven-patches',
    image: ASSETS.typeWoven,
    tilt: '2deg',
    turnaround: '4–6 weeks',
    minQty: 10,
    tagline: 'Ultra-fine threads capture small text and intricate details cleanly.',
    description:
      'Flat, tight weave using thinner threads than embroidery—ideal when your logo has small lettering, thin lines, or photorealistic gradients.',
  },
  {
    id: 'pvc',
    name: 'PVC',
    fullName: 'PVC patches',
    fromPrice: '$0.93',
    badge: null,
    href: '/pvc-patches',
    image: ASSETS.typePvc,
    tilt: '-2deg',
    turnaround: '3–5 weeks',
    minQty: 50,
    tagline: 'Waterproof, weatherproof 2D & 3D molded rubber built for tactical gear.',
    description:
      'Molded flexible PVC that resists rain, mud, UV, and abrasion. Available in sharp 2D layered relief or sculpted 3D contours.',
  },
  {
    id: 'printed',
    name: 'Printed',
    fullName: 'Printed patches',
    fromPrice: '$1.26',
    badge: null,
    href: '/printed-patches',
    image: ASSETS.typePrinted,
    tilt: '2.5deg',
    turnaround: '3–5 weeks',
    minQty: 10,
    tagline: 'Full-color dye sublimation for gradients, photos, and unlimited colors.',
    description:
      'High-resolution dye-sublimated prints framed with an authentic merrowed border so photographic artwork stays sharp without losing the patch look.',
  },
  {
    id: 'name',
    name: 'Name',
    fullName: 'Name patches',
    fromPrice: '$1.85',
    badge: null,
    href: '/name-patches',
    image: ASSETS.typeName,
    tilt: '-2.5deg',
    turnaround: '2–3 weeks',
    minQty: 10,
    tagline: 'Clean embroidered name tags for workwear, mechanics, and uniforms.',
    description:
      'Customizable shapes and thread colors with sew-on, iron-on, or Velcro hook-and-loop backings for easy crew rotation.',
  },
  {
    id: 'leather',
    name: 'Leather',
    fullName: 'Leather patches',
    fromPrice: '$0.75',
    badge: 'New',
    badgeTone: 'primary',
    href: '/leather-patches',
    image: ASSETS.typeLeather,
    tilt: '2.5deg',
    turnaround: '2–3 weeks',
    minQty: 25,
    tagline: 'Laser-engraved, debossed, or UV-printed genuine & faux leather for hats.',
    description:
      'Rugged, retail-ready patches favored for caps, beanies, denim, and outdoor apparel in genuine hide or waterproof vegan faux leather.',
  },
]

export const STYLE_CATEGORIES = [
  {
    heading: 'Sports & Teams',
    items: [
      { name: 'Baseball Patches', href: '/baseball-patches', desc: 'Customize baseball gear with team-inspired designs.', icon: 'circle-dot' },
      { name: 'Football Patches', href: '/football-patches', desc: 'Celebrate football with custom patches for gear and apparel.', icon: 'trophy' },
      { name: 'Hockey Patches', href: '/hockey-patches', desc: 'Show loyalty with custom hockey patches for uniforms.', icon: 'swords' },
      { name: 'Soccer Patches', href: '/soccer-patches', desc: 'Embrace the game with custom soccer patches for jerseys.', icon: 'goal' },
      { name: 'Sports Patches', href: '/sports-patches', desc: 'Show team spirit with customized designs for sports gear.', icon: 'medal' },
    ],
  },
  {
    heading: 'Service & Tactical',
    items: [
      { name: 'Airsoft Patches', href: '/airsoft-patches', desc: 'Enhance your gear with custom designs for team spirit and style', icon: 'crosshair' },
      { name: 'Fire Department Patches', href: '/fire-department-patches', desc: 'Honor firefighters with custom patches for uniforms and gear.', icon: 'flame' },
      { name: 'Military Patches', href: '/military-patches', desc: 'Show pride and honor service with custom emblems and insignias.', icon: 'shield' },
      { name: 'Morale Patches', href: '/morale-patches', desc: 'Boost team spirit with inspirational and motivational designs.', icon: 'thumbs-up' },
      { name: 'Police Patches', href: '/police-patches', desc: 'Represent law enforcement with custom-designed authority patches.', icon: 'badge-check' },
      { name: 'Tactical Patches', href: '/tactical-patches', desc: 'Enhance gear with military-inspired emblems.', icon: 'compass' },
    ],
  },
  {
    heading: 'Clubs & Fun',
    items: [
      { name: 'Award Patches', href: '/award-patches', desc: 'Recognize school, company and club milestones.', icon: 'award' },
      { name: 'Band Patches', href: '/band-patches', desc: 'Customize your merch with band-inspired designs.', icon: 'music' },
      { name: 'Funny Patches', href: '/funny-patches', desc: 'Add humor to your attire with creative and witty designs.', icon: 'smile' },
      { name: 'Motorcycle Patches', href: '/motorcycle-patches', desc: 'Ride in style with custom biker emblems for jackets and gear.', icon: 'bike' },
      { name: 'Scout Patches', href: '/scout-patches', desc: 'Celebrate achievements with custom scouting badges.', icon: 'tent' },
    ],
  },
  {
    heading: 'Garments & Backings',
    items: [
      { name: 'Hat Patches', href: '/hat-patches', desc: 'Perfect for branding, team spirit, and personal expression.', icon: 'hard-hat' },
      { name: 'Iron-On Patches', href: '/iron-on-patches', desc: 'Easily apply to any fabric with an iron for quick customization.', icon: 'sparkles' },
      { name: 'Jacket Patches', href: '/jacket-patches', desc: 'Perfect for personal expression and team spirit', icon: 'shirt' },
      { name: 'Velcro Patches', href: '/velcro-patches', desc: 'Easily attach and remove custom patches with Velcro backing.', icon: 'layers' },
    ],
  },
]

export const ALL_PATCH_STYLES_ALPHA = [
  { name: 'Airsoft Patches', href: '/airsoft-patches', icon: 'crosshair' },
  { name: 'Award Patches', href: '/award-patches', icon: 'award' },
  { name: 'Band Patches', href: '/band-patches', icon: 'music' },
  { name: 'Baseball Patches', href: '/baseball-patches', icon: 'circle-dot' },
  { name: 'Fire Department Patches', href: '/fire-department-patches', icon: 'flame' },
  { name: 'Football Patches', href: '/football-patches', icon: 'trophy' },
  { name: 'Funny Patches', href: '/funny-patches', icon: 'smile' },
  { name: 'Hat Patches', href: '/hat-patches', icon: 'hard-hat' },
  { name: 'Hockey Patches', href: '/hockey-patches', icon: 'swords' },
  { name: 'Iron-On Patches', href: '/iron-on-patches', icon: 'sparkles' },
  { name: 'Jacket Patches', href: '/jacket-patches', icon: 'shirt' },
  { name: 'Military Patches', href: '/military-patches', icon: 'shield' },
  { name: 'Morale Patches', href: '/morale-patches', icon: 'thumbs-up' },
  { name: 'Motorcycle Patches', href: '/motorcycle-patches', icon: 'bike' },
  { name: 'Police Patches', href: '/police-patches', icon: 'badge-check' },
  { name: 'Scout Patches', href: '/scout-patches', icon: 'tent' },
  { name: 'Soccer Patches', href: '/soccer-patches', icon: 'goal' },
  { name: 'Sports Patches', href: '/sports-patches', icon: 'medal' },
  { name: 'Tactical Patches', href: '/tactical-patches', icon: 'compass' },
  { name: 'Velcro Patches', href: '/velcro-patches', icon: 'layers' },
]

export const EXPLORE_LINKS = [
  { name: 'Guide', href: '/custom-patches-guide' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'How to Iron On Patches', href: '/how-to-iron-on-patches' },
  { name: 'Patch University', href: '/patch-university' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Blog', href: '/blog/' },
  { name: 'About Us', href: '/about' },
]

export const VALUE_PROPS = [
  'Free Design & Revisions',
  'Free Setup & Shipping†',
  'Fast Turnaround',
  'Custom Options for Your Brand',
  'Friendly, Expert Guidance',
]

export const PURPOSES = [
  {
    title: 'Uniforms and Apparel',
    image: ASSETS.purposeUniforms,
    body: 'Our custom patches are ideal for all types of uniforms—from sports teams and martial arts clubs to military units and security services. They add a professional touch to work apparel, fostering a sense of pride and belonging among team members.',
  },
  {
    title: 'Businesses and Nonprofits',
    image: ASSETS.purposeBusiness,
    body: 'For businesses and nonprofit organizations, custom patches are essential for branding and identity. They can be used on employee uniforms for a cohesive look, given away at events as unique promotional items, or even sold as a fundraising tool.',
  },
  {
    title: 'Personal Use',
    image: ASSETS.purposePersonal,
    body: 'Our patches aren’t just for organizations—they’re perfect for individuals too. Want to add a touch of personality to your jackets, bags, hats, or other personal items? Our patches are a great way to showcase your interests, hobbies, or personal motto.',
  },
  {
    title: 'Events and Commemorations',
    image: ASSETS.purposeEvent,
    body: 'Custom patches are a fantastic way to commemorate significant events, whether it’s a scout’s first camping trip, a motorcycle club’s annual gathering, or a company milestone. These keepsakes carry the memory of the event, creating a lasting bond among those who shared in the experience.',
  },
]

export const PROCESS_STEPS = [
  {
    num: 1,
    headingPrefix: 'Step 1:',
    title: 'Send Us Your Patch Design',
    image: ASSETS.step1Napkin,
    alt: 'A Brute Squad logo sketched in marker on a coffee shop napkin',
    tilt: '-1.5deg',
    body: 'Send us your patch design—whether it’s a logo, sketch, or an idea. Our graphic artists will transform it into a stunning embroidered patch. Need help? Our team is here to guide you.',
  },
  {
    num: 2,
    headingPrefix: 'Step 2:',
    title: 'Approve Your Digital Patch Proof',
    image: ASSETS.step2Proof,
    alt: 'The same Brute Squad sketch turned into a digital patch proof on a designer’s screen',
    tilt: '1.2deg',
    body: 'We’ll create a digital sample of your patch and send it for your approval. We won’t proceed with production until you’re completely satisfied with the design.',
  },
  {
    num: 3,
    headingPrefix: 'Step 3:',
    title: 'Receive Your Custom Patches',
    image: ASSETS.step3Patch,
    alt: 'A finished embroidered Kissner Farms patch with a tractor in front of a sunset',
    tilt: '-1.2deg',
    body: 'Once you approve the proof and complete payment, we’ll produce and deliver your custom patches. If there’s any defect, we’ll replace it at no extra cost with our 100% Quality Guarantee.',
  },
]

export const WHY_CHOOSE_ROWS = [
  {
    title: 'Competitive Prices',
    image: ASSETS.bestPrice,
    alt: 'PVC patch in the shape of a price tag with the text Best Price in bold white letters, featuring a teal and orange color scheme',
    paragraphs: [
      'At Patch4Ever.com, we are committed to providing top-notch custom patches without straining your budget. Our expertise is dedicated solely to crafting patches that meet your group’s design specifications.',
      'With over twenty years of experience and having produced millions of custom patches, we have the expertise and capability to cater to a wide array of clients. Our clientele includes Scout groups, camping enthusiasts, uniformed professionals such as firefighters, police officers, EMTs, prestigious military units, and Fortune 500 companies.',
      'We take great pride in our work and the value we offer. We are privileged to have created patches for every United States Armed Forces branch.',
      'When you choose Patch4Ever.com, you can be assured that you are receiving the highest-quality patches at the most competitive prices. Your satisfaction is our top priority, as is our dedication to providing you with an exceptional patch-making experience.',
    ],
  },
  {
    title: 'Simple Design Process',
    image: ASSETS.designProcess,
    alt: 'A design transformation image showing a sketch transitioning into a full-color patch.',
    paragraphs: [
      'Creating a patch for your team, organization, or company should be an exciting adventure, not a stressful task. At Patch4Ever.com, we\'ve streamlined the design process to ensure it\'s as easy and enjoyable as possible.',
      'Our talented graphic artists are among the best in the industry, ready to turn your ideas into reality. Simply share a picture of your logo, an existing patch, or any concept you want transformed into a custom embroidered patch.',
      'We accept design images in almost any format, making it incredibly convenient for you. You can even email us a sketch or drawing of your envisioned design. Our goal is to adapt to your needs and bring your design ideas to life.',
    ],
  },
  {
    title: 'Plenty of Customization Options',
    image: ASSETS.variety1,
    alt: 'A stack of embroidered patches with various designs, including one with the text GHOST and another with RAVEN.',
    paragraphs: [
      'At Patch4Ever.com, we understand that variety adds zest to life. That’s why we offer an extensive range of patch options to cater to your unique needs. Our aim is to provide you with a fully personalized product that perfectly captures your vision.',
      'We offer a broad selection of sizes and custom shapes, ensuring your patches fit seamlessly wherever you plan to display them. But our customization options don’t end there. You can choose from a variety of border types to frame your design and a wide spectrum of thread colors to bring it to vibrant life.',
      'Additionally, we provide several attachment methods, allowing you to select the one that best suits your application needs.',
      'Simply tell us what you envision, and our dedicated team of artists will bring it to life. With Patch4Ever.com, creating your dream patch is straightforward and enjoyable. Let us show you how easy and fun the process of ordering custom patches can be!',
    ],
  },
]

export const REVIEWS = [
  {
    quote: '“Acurate,efficient affordable,will do business again in the near future”',
    author: 'Glenda Weatherspoon',
    url: 'https://www.trustpilot.com/reviews/642858370046560ab60f587b',
  },
  {
    quote: '“Prompt service. Friendly staff. Easy-to-use site and a quality product.”',
    author: 'Elliot',
    url: 'https://www.trustpilot.com/reviews/5b74922514b7d80940a42243',
  },
  {
    quote: '“Communication, design, delivery we’re all excellent and extremely fast. I wish the iron-on adhesive was a little stronger.”',
    author: 'Drew',
    url: 'https://www.trustpilot.com/reviews/64fc9df08a1a8c8910b20a08',
  },
  {
    quote: '“Super helpful and easy to work with! Love my patches, they turned out amazing!!!”',
    author: 'Manna',
    url: 'https://www.trustpilot.com/review/www.patch4ever.com?page=9',
  },
  {
    quote: '“Patch4Ever is a great company to work with. They\'re quick to get back with their quotes and artwork.”',
    author: 'mom',
    url: 'https://www.trustpilot.com/reviews/64cc5354839e1a9a71d60884',
  },
  {
    quote: '“We’re so happy with these! The colors were perfect and each patch is very good quality. Very pleased with the outcome and will recommend to friends.”',
    author: 'Valued Customer',
    url: 'https://www.trustpilot.com/reviews/5b9008198c83fd0bd00831cd',
  },
]

export const TRUSTED_CLIENTS = [
  { name: 'Amazon', src: ASSETS.clientAmazon, tilt: '-2deg' },
  { name: 'American Cancer Society', src: ASSETS.clientAcs, tilt: '1.8deg' },
  { name: 'AT&T', src: ASSETS.clientAtt, tilt: '-1.5deg' },
  { name: 'Buffalo Wild Wings', src: ASSETS.clientBww, tilt: '2.2deg' },
  { name: "Dunkin' Donuts", src: ASSETS.clientDunkin, tilt: '-2deg' },
  { name: 'Google', src: ASSETS.clientGoogle, tilt: '1.5deg' },
  { name: 'IndyCar Series', src: ASSETS.clientIndyCar, tilt: '-1.8deg' },
  { name: 'Microsoft', src: ASSETS.clientMicrosoft, tilt: '2deg' },
  { name: 'NASA', src: ASSETS.clientNasa, tilt: '-2.2deg' },
  { name: 'SANS', src: ASSETS.clientSans, tilt: '1.6deg' },
  { name: 'Skillz', src: ASSETS.clientSkillz, tilt: '-1.6deg' },
  { name: 'The Walking Dead', src: ASSETS.clientWalkingDead, tilt: '2deg' },
  { name: 'United Way', src: ASSETS.clientUnitedWay, tilt: '-1.5deg' },
]

export const BLOG_POSTS = [
  {
    slug: 'custom-embroidered-qr-code-patches',
    href: '/blog/custom-embroidered-qr-code-patches',
    date: 'Nov 4, 2026',
    author: 'Rick Cundiff',
    title: 'Custom Embroidered QR Code Patches',
    excerpt:
      'Custom embroidered QR code patches offer your potential customers a wealth of extra information. Here\'s how easy it is to create them.',
    image: ASSETS.blogQr,
    featured: true,
  },
  {
    slug: 'less-but-better-minimalist-patch-design',
    href: '/blog/less-but-better-minimalist-patch-design',
    date: 'Oct 23, 2026',
    title: 'Less, But Better: Minimalist Patch Design',
    excerpt: 'Clean shapes, strong contrast, and restrained thread palettes make minimalist patches stand out at any size.',
    image: ASSETS.blogMinimal,
    featured: false,
  },
  {
    slug: 'iron-on-patch-or-direct-embroidery-how-to-choose',
    href: '/blog/iron-on-patch-or-direct-embroidery-how-to-choose',
    date: 'Sep 29, 2026',
    title: 'Iron-On Patch or Direct Embroidery? How to Choose',
    excerpt: 'Compare cost, garment flexibility, crispness of detail, and replacement speed for your team apparel.',
    image: ASSETS.blogDirect,
    featured: false,
  },
]

export const FOOTER_LINKS = {
  additional: [
    { label: 'Blog', href: '/blog/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Options', href: '/options' },
    { label: 'Free Quote', href: '/quote' },
    { label: 'How To Iron On A Patch', href: '/how-to-iron-on-patches' },
    { label: 'Customer Stories', href: '/customer-stories' },
    { label: 'Customer Reviews', href: '/reviews' },
  ],
  about: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ],
  help: [
    { label: 'FAQs', href: '/faq' },
    { label: 'Guide', href: '/custom-patches-guide' },
    { label: 'Patch University', href: '/patch-university' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Pay Online', href: '/payment-form' },
    { label: 'Customer Portal', href: 'https://orders.tjmpromos.com', external: true },
    { label: 'Admin Panel', href: '/admin' },
    { label: 'Sitemap', href: '/sitemap' },
  ],
}
