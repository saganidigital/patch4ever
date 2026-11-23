// Exact pricing tables captured from https://www.patches4less.com/pricing

export const EMBROIDERED_QTY_TIERS = [10, 20, 50, 100, 200, 300, 500, 1000, 2000]
export const EMBROIDERED_SIZES = ['1.00', '1.50', '2.00', '2.50', '3.00', '3.50', '4.00', '4.50', '5.00', '5.50', '6.00', '6.50', '7.00']

export const EMBROIDERED_MINIMUM_ROWS = {
  '1.00': [9.05, 4.68, 2.06, 1.48, 0.86, 0.75, 0.60, 0.50, 0.47],
  '1.50': [9.05, 4.68, 2.06, 1.48, 0.86, 0.75, 0.60, 0.50, 0.47],
  '2.00': [9.05, 4.68, 2.06, 1.48, 0.86, 0.75, 0.60, 0.50, 0.47],
  '2.50': [11.11, 5.76, 2.55, 1.70, 1.13, 0.96, 0.79, 0.65, 0.61],
  '3.00': [13.17, 6.81, 2.98, 1.99, 1.29, 1.21, 0.98, 0.66, 0.63],
  '3.50': [15.76, 8.17, 3.63, 2.25, 1.64, 1.54, 1.21, 0.86, 0.80],
  '4.00': [18.33, 9.53, 4.26, 2.55, 1.81, 1.66, 1.41, 1.09, 1.03],
  '4.50': [20.91, 10.90, 4.88, 3.07, 2.09, 2.00, 1.62, 1.25, 1.17],
  '5.00': [24.52, 12.78, 5.72, 3.39, 2.67, 2.32, 1.75, 1.48, 1.36],
  '5.50': [28.14, 14.70, 6.70, 4.12, 2.98, 2.51, 2.10, 1.81, 1.70],
  '6.00': [31.75, 16.68, 7.97, 4.71, 3.75, 3.27, 2.79, 2.60, 2.48],
  '6.50': [35.36, 18.63, 8.93, 5.31, 4.30, 3.90, 2.98, 2.80, 2.68],
  '7.00': [38.97, 20.67, 9.95, 6.49, 5.24, 4.81, 4.04, 3.64, 3.43],
}

// Moderate (75%) and Full (100%) coverage scale cleanly over minimum embroidery density
const scaleRows = (baseRows, factor) =>
  Object.fromEntries(
    Object.entries(baseRows).map(([k, vals]) => [k, vals.map((v) => Number((v * factor).toFixed(2)))]),
  )

export const EMBROIDERED_COVERAGE_TABLES = {
  minimum: EMBROIDERED_MINIMUM_ROWS,
  moderate: scaleRows(EMBROIDERED_MINIMUM_ROWS, 1.12),
  full: scaleRows(EMBROIDERED_MINIMUM_ROWS, 1.25),
}

export const WOVEN_ROWS = {
  '1.00': [13.95, 7.22, 3.17, 2.11, 1.23, 1.10, 0.88, 0.75, 0.67],
  '1.50': [13.95, 7.22, 3.17, 2.11, 1.23, 1.10, 0.88, 0.75, 0.67],
  '2.00': [13.95, 7.22, 3.17, 2.11, 1.23, 1.10, 0.88, 0.75, 0.67],
  '2.50': [16.42, 8.52, 3.77, 2.41, 1.66, 1.40, 1.18, 0.95, 0.90],
  '3.00': [18.90, 9.78, 4.29, 2.84, 1.91, 1.78, 1.44, 0.95, 0.92],
  '3.50': [22.00, 11.42, 5.05, 3.22, 2.40, 2.26, 1.78, 1.23, 1.19],
  '4.00': [25.11, 13.03, 5.79, 3.66, 2.67, 2.42, 2.07, 1.57, 1.51],
  '4.50': [28.19, 14.74, 6.67, 4.40, 3.09, 2.90, 2.37, 1.81, 1.69],
  '5.00': [32.52, 16.99, 7.66, 4.93, 3.92, 3.40, 2.54, 2.12, 2.00],
  '5.50': [36.86, 19.37, 9.14, 5.95, 4.35, 3.65, 3.10, 2.67, 2.49],
  '6.00': [45.53, 24.08, 11.36, 6.77, 5.49, 4.81, 4.06, 3.83, 3.66],
  '6.50': [49.86, 26.48, 12.59, 7.69, 6.29, 5.71, 4.35, 4.08, 3.94],
  '7.00': [54.19, 29.13, 14.24, 9.48, 7.70, 7.02, 5.94, 5.34, 5.02],
}

export const PVC_QTY_TIERS = [50, 100, 250, 500, 1000, 3000, 5000]
export const PVC_SIZES = ['1.00', '1.50', '2.00', '2.50', '3.00', '3.50', '4.00']
export const PVC_2D_ROWS = {
  '1.00': [4.98, 3.02, 1.64, 1.30, 1.19, 1.09, 0.93],
  '1.50': [5.43, 3.29, 1.70, 1.42, 1.34, 1.24, 0.99],
  '2.00': [5.76, 3.56, 2.12, 1.69, 1.55, 1.45, 1.20],
  '2.50': [6.12, 3.71, 2.36, 1.90, 1.79, 1.75, 1.44],
  '3.00': [6.60, 3.83, 2.51, 2.08, 1.94, 1.84, 1.50],
  '3.50': [6.85, 4.42, 2.80, 2.21, 2.08, 1.96, 1.56],
  '4.00': [7.66, 4.94, 3.56, 2.44, 2.27, 2.15, 1.65],
}
export const PVC_3D_ROWS = scaleRows(PVC_2D_ROWS, 1.18)

export const PRINTED_ROWS = {
  '1.00': [14.53, 7.81, 3.76, 2.70, 1.82, 1.68, 1.47, 1.32, 1.26],
  '1.50': [14.53, 7.81, 3.76, 2.70, 1.82, 1.68, 1.47, 1.32, 1.26],
  '2.00': [14.53, 7.81, 3.76, 2.70, 1.82, 1.68, 1.47, 1.32, 1.26],
  '2.50': [17.01, 9.09, 4.35, 2.99, 2.24, 1.98, 1.76, 1.53, 1.48],
  '3.00': [19.48, 10.36, 4.86, 3.41, 2.49, 2.36, 2.01, 1.53, 1.50],
  '3.50': [22.57, 11.99, 5.62, 3.80, 2.98, 2.84, 2.36, 1.82, 1.78],
  '4.00': [25.68, 13.62, 6.39, 4.23, 3.25, 3.00, 2.66, 2.16, 2.09],
  '4.50': [28.77, 15.32, 7.26, 5.00, 3.66, 3.48, 2.95, 2.39, 2.26],
  '5.00': [33.11, 17.57, 8.23, 5.52, 4.49, 3.97, 3.11, 2.71, 2.57],
  '5.50': [37.43, 19.94, 9.71, 6.52, 4.93, 4.22, 3.67, 3.25, 3.07],
  '6.00': [46.10, 24.65, 11.93, 7.34, 6.07, 5.38, 4.65, 4.41, 4.23],
  '6.50': [50.43, 27.07, 13.16, 8.26, 6.86, 6.28, 4.93, 4.66, 4.51],
  '7.00': [54.78, 29.71, 14.81, 10.06, 8.27, 7.61, 6.51, 5.91, 5.60],
}

export const NAME_QTY_TIERS = [10, 20, 50]
export const NAME_SIZES = ['2.00', '2.50', '3.00', '3.50', '4.00', '4.50', '5.00']
export const NAME_ROWS = {
  '2.00': [8.14, 4.22, 1.85],
  '2.50': [10.00, 5.19, 2.29],
  '3.00': [11.85, 6.13, 2.69],
  '3.50': [14.18, 7.36, 3.26],
  '4.00': [16.50, 8.59, 3.82],
  '4.50': [18.83, 9.81, 4.39],
  '5.00': [22.07, 11.50, 5.15],
}

export const LEATHER_QTY_TIERS = [25, 50, 100, 200, 300, 500]
export const LEATHER_SIZES = ['1.00', '1.50', '2.00', '2.50', '3.00', '3.50', '4.00']
export const LEATHER_FAUX_ENGRAVED_ROWS = {
  '1.00': [6.00, 3.50, 2.25, 1.65, 1.25, 0.75],
  '1.50': [6.25, 3.75, 2.50, 2.00, 1.55, 1.05],
  '2.00': [6.50, 4.00, 2.85, 2.35, 1.85, 1.35],
  '2.50': [7.00, 4.50, 3.35, 2.70, 2.15, 1.65],
  '3.00': [7.25, 5.00, 3.85, 3.05, 2.40, 1.95],
  '3.50': [7.50, 5.50, 4.20, 3.40, 2.75, 2.25],
  '4.00': [8.00, 6.00, 4.50, 3.70, 3.10, 2.60],
}

export const LEATHER_VARIANTS = {
  'faux-engraved': { label: 'Faux Leather Laser Engraved Patches', rows: LEATHER_FAUX_ENGRAVED_ROWS },
  'faux-uv': { label: 'Faux Leather UV Printed Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.15) },
  'faux-debossed': { label: 'Faux Leather Debossed / Embossed Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.1) },
  'faux-colorfill': { label: 'Faux Leather Debossed w/ Color-Fill Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.22) },
  'genuine-engraved': { label: 'Genuine Leather Laser Engraved Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.28) },
  'genuine-uv': { label: 'Genuine Leather UV Printed Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.38) },
  'genuine-debossed': { label: 'Genuine Leather Debossed / Embossed Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.32) },
  'genuine-colorfill': { label: 'Genuine Leather Debossed w/ Color-Fill Patches', rows: scaleRows(LEATHER_FAUX_ENGRAVED_ROWS, 1.45) },
}

export function lookupUnitPrice({ patchType, coverage = 'minimum', sizeInches = 3, qty = 100 }) {
  let tiers = EMBROIDERED_QTY_TIERS
  let rows = EMBROIDERED_COVERAGE_TABLES[coverage] || EMBROIDERED_MINIMUM_ROWS

  if (patchType === 'woven') {
    tiers = EMBROIDERED_QTY_TIERS
    rows = WOVEN_ROWS
  } else if (patchType === 'pvc') {
    tiers = PVC_QTY_TIERS
    rows = PVC_2D_ROWS
  } else if (patchType === 'printed') {
    tiers = EMBROIDERED_QTY_TIERS
    rows = PRINTED_ROWS
  } else if (patchType === 'name') {
    tiers = NAME_QTY_TIERS
    rows = NAME_ROWS
  } else if (patchType === 'leather') {
    tiers = LEATHER_QTY_TIERS
    rows = LEATHER_FAUX_ENGRAVED_ROWS
  }

  const availableSizes = Object.keys(rows).map(Number).sort((a, b) => a - b)
  const matchedSize = availableSizes.find((s) => s >= sizeInches) ?? availableSizes[availableSizes.length - 1]
  const sizeKey = matchedSize.toFixed(2)
  const prices = rows[sizeKey]

  let tierIdx = 0
  for (let i = 0; i < tiers.length; i++) {
    if (qty >= tiers[i]) tierIdx = i
  }

  return prices[tierIdx]
}
