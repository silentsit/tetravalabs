import { CHECKOUT_US_STATES } from "@/lib/checkout-us-states"

export type CheckoutSubdivision = { code: string; name: string }

const CA_PROVINCES: CheckoutSubdivision[] = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" }
]

const AU_STATES: CheckoutSubdivision[] = [
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NSW", name: "New South Wales" },
  { code: "NT", name: "Northern Territory" },
  { code: "QLD", name: "Queensland" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "VIC", name: "Victoria" },
  { code: "WA", name: "Western Australia" }
]

const GB_COUNTRIES: CheckoutSubdivision[] = [
  { code: "ENG", name: "England" },
  { code: "NIR", name: "Northern Ireland" },
  { code: "SCT", name: "Scotland" },
  { code: "WLS", name: "Wales" }
]

const NZ_REGIONS: CheckoutSubdivision[] = [
  { code: "AUK", name: "Auckland" },
  { code: "BOP", name: "Bay of Plenty" },
  { code: "CAN", name: "Canterbury" },
  { code: "GIS", name: "Gisborne" },
  { code: "HKB", name: "Hawke's Bay" },
  { code: "MWT", name: "Manawatu-Whanganui" },
  { code: "MBH", name: "Marlborough" },
  { code: "NSN", name: "Nelson" },
  { code: "NTL", name: "Northland" },
  { code: "OTA", name: "Otago" },
  { code: "STL", name: "Southland" },
  { code: "TKI", name: "Taranaki" },
  { code: "TAS", name: "Tasman" },
  { code: "WKO", name: "Waikato" },
  { code: "WGN", name: "Wellington" },
  { code: "WTC", name: "West Coast" }
]

const TH_PROVINCES: CheckoutSubdivision[] = [
  { code: "Bangkok", name: "Bangkok" },
  { code: "Amnat Charoen", name: "Amnat Charoen" },
  { code: "Ang Thong", name: "Ang Thong" },
  { code: "Bueng Kan", name: "Bueng Kan" },
  { code: "Buriram", name: "Buriram" },
  { code: "Chachoengsao", name: "Chachoengsao" },
  { code: "Chai Nat", name: "Chai Nat" },
  { code: "Chaiyaphum", name: "Chaiyaphum" },
  { code: "Chanthaburi", name: "Chanthaburi" },
  { code: "Chiang Mai", name: "Chiang Mai" },
  { code: "Chiang Rai", name: "Chiang Rai" },
  { code: "Chonburi", name: "Chonburi" },
  { code: "Chumphon", name: "Chumphon" },
  { code: "Kalasin", name: "Kalasin" },
  { code: "Kamphaeng Phet", name: "Kamphaeng Phet" },
  { code: "Kanchanaburi", name: "Kanchanaburi" },
  { code: "Khon Kaen", name: "Khon Kaen" },
  { code: "Krabi", name: "Krabi" },
  { code: "Lampang", name: "Lampang" },
  { code: "Lamphun", name: "Lamphun" },
  { code: "Loei", name: "Loei" },
  { code: "Lopburi", name: "Lopburi" },
  { code: "Mae Hong Son", name: "Mae Hong Son" },
  { code: "Maha Sarakham", name: "Maha Sarakham" },
  { code: "Mukdahan", name: "Mukdahan" },
  { code: "Nakhon Nayok", name: "Nakhon Nayok" },
  { code: "Nakhon Pathom", name: "Nakhon Pathom" },
  { code: "Nakhon Phanom", name: "Nakhon Phanom" },
  { code: "Nakhon Ratchasima", name: "Nakhon Ratchasima" },
  { code: "Nakhon Sawan", name: "Nakhon Sawan" },
  { code: "Nakhon Si Thammarat", name: "Nakhon Si Thammarat" },
  { code: "Nan", name: "Nan" },
  { code: "Narathiwat", name: "Narathiwat" },
  { code: "Nong Bua Lamphu", name: "Nong Bua Lamphu" },
  { code: "Nong Khai", name: "Nong Khai" },
  { code: "Nonthaburi", name: "Nonthaburi" },
  { code: "Pathum Thani", name: "Pathum Thani" },
  { code: "Pattani", name: "Pattani" },
  { code: "Phang Nga", name: "Phang Nga" },
  { code: "Phatthalung", name: "Phatthalung" },
  { code: "Phayao", name: "Phayao" },
  { code: "Phetchabun", name: "Phetchabun" },
  { code: "Phetchaburi", name: "Phetchaburi" },
  { code: "Phichit", name: "Phichit" },
  { code: "Phitsanulok", name: "Phitsanulok" },
  { code: "Phra Nakhon Si Ayutthaya", name: "Phra Nakhon Si Ayutthaya" },
  { code: "Phrae", name: "Phrae" },
  { code: "Phuket", name: "Phuket" },
  { code: "Prachinburi", name: "Prachinburi" },
  { code: "Prachuap Khiri Khan", name: "Prachuap Khiri Khan" },
  { code: "Ranong", name: "Ranong" },
  { code: "Ratchaburi", name: "Ratchaburi" },
  { code: "Rayong", name: "Rayong" },
  { code: "Roi Et", name: "Roi Et" },
  { code: "Sa Kaeo", name: "Sa Kaeo" },
  { code: "Sakon Nakhon", name: "Sakon Nakhon" },
  { code: "Samut Prakan", name: "Samut Prakan" },
  { code: "Samut Sakhon", name: "Samut Sakhon" },
  { code: "Samut Songkhram", name: "Samut Songkhram" },
  { code: "Saraburi", name: "Saraburi" },
  { code: "Satun", name: "Satun" },
  { code: "Si Sa Ket", name: "Si Sa Ket" },
  { code: "Sing Buri", name: "Sing Buri" },
  { code: "Songkhla", name: "Songkhla" },
  { code: "Sukhothai", name: "Sukhothai" },
  { code: "Suphan Buri", name: "Suphan Buri" },
  { code: "Surat Thani", name: "Surat Thani" },
  { code: "Surin", name: "Surin" },
  { code: "Tak", name: "Tak" },
  { code: "Trang", name: "Trang" },
  { code: "Trat", name: "Trat" },
  { code: "Ubon Ratchathani", name: "Ubon Ratchathani" },
  { code: "Udon Thani", name: "Udon Thani" },
  { code: "Uthai Thani", name: "Uthai Thani" },
  { code: "Uttaradit", name: "Uttaradit" },
  { code: "Yala", name: "Yala" },
  { code: "Yasothon", name: "Yasothon" }
]

const MY_STATES: CheckoutSubdivision[] = [
  { code: "JHR", name: "Johor" },
  { code: "KDH", name: "Kedah" },
  { code: "KTN", name: "Kelantan" },
  { code: "MLK", name: "Malacca" },
  { code: "NSN", name: "Negeri Sembilan" },
  { code: "PHG", name: "Pahang" },
  { code: "PNG", name: "Penang" },
  { code: "PRK", name: "Perak" },
  { code: "PLS", name: "Perlis" },
  { code: "SBH", name: "Sabah" },
  { code: "SWK", name: "Sarawak" },
  { code: "SGR", name: "Selangor" },
  { code: "TRG", name: "Terengganu" },
  { code: "KUL", name: "Kuala Lumpur" },
  { code: "LBN", name: "Labuan" },
  { code: "PJY", name: "Putrajaya" }
]

const ID_PROVINCES: CheckoutSubdivision[] = [
  { code: "AC", name: "Aceh" },
  { code: "BA", name: "Bali" },
  { code: "BB", name: "Bangka Belitung" },
  { code: "BT", name: "Banten" },
  { code: "BE", name: "Bengkulu" },
  { code: "GO", name: "Gorontalo" },
  { code: "JK", name: "Jakarta" },
  { code: "JA", name: "Jambi" },
  { code: "JB", name: "West Java" },
  { code: "JT", name: "Central Java" },
  { code: "JI", name: "East Java" },
  { code: "KB", name: "West Kalimantan" },
  { code: "KS", name: "South Kalimantan" },
  { code: "KT", name: "Central Kalimantan" },
  { code: "KI", name: "East Kalimantan" },
  { code: "KU", name: "North Kalimantan" },
  { code: "KR", name: "Riau Islands" },
  { code: "LA", name: "Lampung" },
  { code: "MA", name: "Maluku" },
  { code: "MU", name: "North Maluku" },
  { code: "NB", name: "West Nusa Tenggara" },
  { code: "NT", name: "East Nusa Tenggara" },
  { code: "PA", name: "Papua" },
  { code: "PB", name: "West Papua" },
  { code: "RI", name: "Riau" },
  { code: "SR", name: "West Sulawesi" },
  { code: "SN", name: "South Sulawesi" },
  { code: "ST", name: "Central Sulawesi" },
  { code: "SG", name: "Southeast Sulawesi" },
  { code: "SA", name: "North Sulawesi" },
  { code: "SB", name: "West Sumatra" },
  { code: "SS", name: "South Sumatra" },
  { code: "SU", name: "North Sumatra" },
  { code: "YO", name: "Yogyakarta" }
]

const PH_REGIONS: CheckoutSubdivision[] = [
  { code: "NCR", name: "National Capital Region" },
  { code: "CAR", name: "Cordillera Administrative Region" },
  { code: "I", name: "Ilocos Region" },
  { code: "II", name: "Cagayan Valley" },
  { code: "III", name: "Central Luzon" },
  { code: "IV-A", name: "Calabarzon" },
  { code: "MIMAROPA", name: "Mimaropa" },
  { code: "V", name: "Bicol Region" },
  { code: "VI", name: "Western Visayas" },
  { code: "VII", name: "Central Visayas" },
  { code: "VIII", name: "Eastern Visayas" },
  { code: "IX", name: "Zamboanga Peninsula" },
  { code: "X", name: "Northern Mindanao" },
  { code: "XI", name: "Davao Region" },
  { code: "XII", name: "Soccsksargen" },
  { code: "XIII", name: "Caraga" },
  { code: "BARMM", name: "Bangsamoro" }
]

const SUBDIVISIONS_BY_COUNTRY: Record<string, CheckoutSubdivision[]> = {
  US: CHECKOUT_US_STATES,
  CA: CA_PROVINCES,
  AU: AU_STATES,
  GB: GB_COUNTRIES,
  NZ: NZ_REGIONS,
  TH: TH_PROVINCES,
  MY: MY_STATES,
  ID: ID_PROVINCES,
  PH: PH_REGIONS
}

export function getCheckoutSubdivisions(countryCode: string): CheckoutSubdivision[] {
  return SUBDIVISIONS_BY_COUNTRY[countryCode.trim().toUpperCase()] || []
}

export function getSubdivisionLabel(countryCode: string) {
  switch (countryCode.trim().toUpperCase()) {
    case "US":
      return "State"
    case "CA":
      return "Province"
    case "AU":
      return "State / territory"
    case "GB":
      return "Country"
    case "TH":
    case "ID":
      return "Province"
    default:
      return "State / province"
  }
}

export function getSubdivisionPlaceholder(countryCode: string) {
  switch (countryCode.trim().toUpperCase()) {
    case "US":
      return "Select a state"
    case "CA":
    case "TH":
    case "ID":
      return "Select a province"
    case "AU":
      return "Select a state / territory"
    case "GB":
      return "Select a country"
    default:
      return "Select a state / province"
  }
}

export function getPostalLabel(countryCode: string) {
  switch (countryCode.trim().toUpperCase()) {
    case "US":
      return "ZIP code"
    case "GB":
      return "Postcode"
    default:
      return "Postal code"
  }
}

export function isValidSubdivision(countryCode: string, value: string) {
  const subdivisions = getCheckoutSubdivisions(countryCode)
  if (!subdivisions.length) return true
  const normalized = value.trim().toLowerCase()
  return subdivisions.some(
    (entry) =>
      entry.code.toLowerCase() === normalized || entry.name.toLowerCase() === normalized
  )
}

export function normalizeSubdivision(countryCode: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const subdivisions = getCheckoutSubdivisions(countryCode)
  if (!subdivisions.length) return trimmed
  const upper = trimmed.toUpperCase()
  const byCode = subdivisions.find((entry) => entry.code.toUpperCase() === upper)
  if (byCode) return byCode.code
  const byName = subdivisions.find((entry) => entry.name.toLowerCase() === trimmed.toLowerCase())
  return byName?.code ?? trimmed
}

export function formatSubdivisionDisplay(countryCode: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const subdivisions = getCheckoutSubdivisions(countryCode)
  if (!subdivisions.length) return trimmed
  const normalized = trimmed.toLowerCase()
  const match = subdivisions.find(
    (entry) =>
      entry.code.toLowerCase() === normalized || entry.name.toLowerCase() === normalized
  )
  return match?.name ?? trimmed
}
