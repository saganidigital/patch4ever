

insert into public.catalog_config (id, config)
values (
  'default',
  '{
    "patchTypes": [
      { "id": "embroidered", "name": "Embroidered", "enabled": true, "minQty": 10, "turnaround": "14–22 days", "rushAvailable": true, "rushFeePerPatch": 0.45 },
      { "id": "woven", "name": "Woven", "enabled": true, "minQty": 10, "turnaround": "4–6 weeks", "rushAvailable": false, "rushFeePerPatch": 0 },
      { "id": "pvc", "name": "PVC", "enabled": true, "minQty": 50, "turnaround": "3–5 weeks", "rushAvailable": false, "rushFeePerPatch": 0 },
      { "id": "printed", "name": "Printed", "enabled": true, "minQty": 10, "turnaround": "3–5 weeks", "rushAvailable": false, "rushFeePerPatch": 0 },
      { "id": "name", "name": "Name", "enabled": true, "minQty": 10, "turnaround": "2–3 weeks", "rushAvailable": false, "rushFeePerPatch": 0 },
      { "id": "leather", "name": "Leather", "enabled": true, "minQty": 25, "turnaround": "2–3 weeks", "rushAvailable": false, "rushFeePerPatch": 0 }
    ],
    "borders": [
      { "id": "merrowed", "name": "Merrowed Border", "note": "Classic stitched overlock edge (Recommended)", "pricePerPatch": 0, "enabled": true },
      { "id": "hot-cut", "name": "Hot Cut / Laser Cut", "note": "Crisp heat-sealed edge for custom die-cut shapes", "pricePerPatch": 0, "enabled": true }
    ],
    "backings": [
      { "id": "no-backing", "name": "No Backing (Sew-On)", "note": "Standard cloth backing", "pricePerPatch": 0, "enabled": true },
      { "id": "pvc", "name": "PVC Backing", "note": "Stiffens patch cleanly (Free)", "pricePerPatch": 0, "enabled": true },
      { "id": "iron-on", "name": "Iron-On (Heat Seal)", "note": "Easy heat-press application", "pricePerPatch": 0.15, "enabled": true },
      { "id": "peel-stick", "name": "Peel & Stick", "note": "Temporary adhesive backing", "pricePerPatch": 0.15, "enabled": true },
      { "id": "velcro", "name": "Velcro (Hook & Loop)", "note": "Both hook & loop sides included", "pricePerPatch": 0.45, "enabled": true },
      { "id": "magnet", "name": "Magnet Backing", "note": "Removable magnetic hold", "pricePerPatch": 0.50, "enabled": true },
      { "id": "button-loop", "name": "Button Loop", "note": "Top loop for uniform buttons", "pricePerPatch": 0.20, "enabled": true },
      { "id": "safety-pin", "name": "Safety Pin", "note": "Attached pin back", "pricePerPatch": 0.25, "enabled": true },
      { "id": "clutch-pin", "name": "Clutch Pin", "note": "Butterfly clutch lapel pin", "pricePerPatch": 0.35, "enabled": true },
      { "id": "key-ring", "name": "Key Ring", "note": "Keychain loop hardware", "pricePerPatch": 0.40, "enabled": true }
    ],
    "upgrades": [
      { "id": "glow-thread", "name": "Glow-in-the-dark Thread", "pricePerPatch": 0.25, "enabled": true },
      { "id": "metallic-thread", "name": "Metallic Gold / Silver Thread", "pricePerPatch": 0.20, "enabled": true },
      { "id": "neon-thread", "name": "Neon Thread", "pricePerPatch": 0.15, "enabled": true },
      { "id": "poly-bag", "name": "Individual Poly Bag", "pricePerPatch": 0.10, "enabled": true },
      { "id": "backing-card", "name": "Custom Backing Card", "pricePerPatch": 0.35, "enabled": true }
    ]
  }'::jsonb
)
on conflict (id) do nothing;

insert into public.orders (
  id, source, created_at, status, patch_type, shape, width, height, size,
  coverage, border, backing, upgrades, qty, rush, unit_price, total_price,
  customer_name, email, phone, company, address, in_hands_date, artwork_name, notes, admin_notes
) values
  (
    'P4E-1048', 'Order Page', '2026-11-25T14:20:00Z', 'proof-pending', 'embroidered', 'Shield', '3.50', '3.50', 3.50,
    'full', 'Merrowed Border', 'Iron-On (Heat Seal)', '["Metallic Gold / Silver Thread"]'::jsonb, 200, true, 2.85, 570.00,
    'Capt. Marcus Vance', 'mvance@ocalafire.gov', '352-555-0194', 'Ocala Fire Rescue Station 4',
    '410 SE Broadway St, Ocala, FL 34471', '2026-12-04', 'station4-crest-vector.ai',
    'Match Pantone 186C red on outer merrowed border and gold metallic on Maltese cross.',
    'Assigned to artist #2 for priority rush proof.'
  ),
  (
    'P4E-1047', 'Order Page', '2026-11-24T18:05:00Z', 'in-production', 'pvc', 'Die-Cut Custom', '3.00', '2.50', 2.75,
    '3D', 'Hot Cut / Laser Cut', 'Velcro (Hook & Loop)', '["Glow-in-the-dark Thread"]'::jsonb, 250, false, 3.66, 915.00,
    'Devon Kowalski', 'devon@nighthawkairsoft.com', '407-555-0148', 'Night Hawks Squadron 5',
    '892 Tactical Way, Orlando, FL 32801', '2026-12-20', 'night-hawks-owl-3d.png',
    '3D molded owl eyes with glow fill, coyote brown hook-and-loop backing.',
    'Mold approved by customer on Nov 24.'
  ),
  (
    'P4E-1046', 'Order Page', '2026-11-24T11:42:00Z', 'proof-sent', 'leather', 'Hexagon', '2.50', '2.50', 2.50,
    'Faux Leather · Laser Engraved', 'Hot Cut / Laser Cut', 'Iron-On (Heat Seal)', '[]'::jsonb, 100, false, 3.50, 350.00,
    'Hannah Brooks', 'hannah@ironwoodroasters.co', '512-555-0182', 'Ironwood Coffee Roasters',
    '1204 S Congress Ave, Austin, TX 78704', '2026-12-15', 'ironwood-anvil-badge.pdf',
    'Dark saddle brown faux leather for Richardson 112 trucker hats.',
    'Proof v1 emailed — awaiting final sign-off.'
  ),
  (
    'P4E-1045', 'Order Page', '2026-11-23T16:15:00Z', 'approved', 'woven', 'Circle / Oval', '3.00', '3.00', 3.00,
    'Standard Fine Weave', 'Merrowed Border', 'No Backing (Sew-On)', '["Individual Poly Bag"]'::jsonb, 500, false, 1.54, 770.00,
    'Priya Patel', 'priya@cosmicscouts.org', '650-555-0129', 'Cosmic Scouts STEM Camp',
    '450 Discovery Blvd, San Jose, CA 95110', '2026-12-30', 'cosmic-scouts-2048.pdf',
    'Fine lettering around outer ring — woven chosen for crisp legibility.',
    'Approved & paid. Queued for loom batch #14.'
  ),
  (
    'P4E-1044', 'Order Page', '2026-11-22T09:30:00Z', 'shipped', 'printed', 'Rectangle', '4.00', '3.00', 3.50,
    'Full-Color Dye Sublimation', 'Merrowed Border', 'Iron-On (Heat Seal)', '["Custom Backing Card"]'::jsonb, 100, false, 4.30, 430.00,
    'Liam O’Connor', 'liam@mountainrescuesrt.org', '303-555-0166', 'Mountain Rescue SRT',
    '77 Alpine Ridge Rd, Boulder, CO 80302', '2026-12-01', 'mountain-srt-photo.png',
    'Photorealistic sunset gradient behind peak + crisp black merrowed border.',
    'Shipped via UPS Ground — Tracking #1Z999AA10123456784.'
  ),
  (
    'P4E-1043', 'Order Page', '2026-11-21T13:50:00Z', 'completed', 'name', 'Rectangle', '4.00', '1.50', 2.75,
    'Standard Name Twill', 'Merrowed Border', 'Velcro (Hook & Loop)', '[]'::jsonb, 50, false, 3.14, 157.00,
    'Carlos Mendez', 'carlos@apexautogroup.com', '813-555-0171', 'Apex Motorsport Garage',
    '2200 Pit Lane, Tampa, FL 33605', '2026-11-28', 'crew-names-roster.pdf',
    'Navy twill background, white block script, orange merrowed edge.',
    'Delivered and confirmed by customer (5-star review).'
  ),
  (
    'P4E-1042', 'Free Quote', '2026-11-20T17:10:00Z', 'proof-pending', 'embroidered', 'Circle / Oval', '3.00', '3.00', 3.00,
    'moderate', 'Merrowed Border', 'PVC Backing', '[]'::jsonb, 300, false, 1.36, 408.00,
    'Rachel Kim', 'rachel@bayarearunclub.com', '415-555-0133', 'Bay Area Trail Runners',
    '300 Embarcadero, San Francisco, CA 94105', '2026-12-18', 'trail-club-sketch.jpg',
    'Submitted rough napkin sketch — please clean up typography.',
    ''
  )
on conflict (id) do nothing;
