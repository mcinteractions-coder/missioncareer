/**
 * Study-cost figures for the Country Comparison and Budget Calculator.
 * Every figure links to the page it came from. `name: null` marks a Mission Career
 * estimate where no official figure exists. Checked on COSTS_CHECKED_ON.
 */
export const COSTS_CHECKED_ON = "16 November 2026";

export type Currency =
  | "INR" | "EUR" | "USD" | "GBP" | "CAD" | "AUD" | "NZD" | "SEK" | "NOK" | "DKK" | "CHF"
  | "PLN" | "CZK" | "HUF" | "SGD" | "MYR" | "JPY" | "KRW" | "CNY" | "AED" | "RUB";

/** Rupees for 1 unit of each currency. ECB euro reference rates of 13 Nov 2026 (EUR = ₹104.1575), crossed through the euro. */
export const INR_PER: Record<Currency, number> = {
  INR: 1,
  EUR: 104.1575,
  USD: 94.243123,
  GBP: 124.651444,
  CAD: 66.098172,
  AUD: 63.947385,
  NZD: 52.1361,
  SEK: 9.377223,
  NOK: 9.854534,
  DKK: 13.932995,
  CHF: 112.408267,
  PLN: 23.61152,
  CZK: 4.264555,
  HUF: 0.284895,
  SGD: 73.164864,
  MYR: 23.056447,
  JPY: 0.589026,
  KRW: 0.070481,
  CNY: 14.125349,
  /** UAE dirham is pegged at AED 3.6725 per US dollar (Central Bank of the UAE). */
  AED: 25.661844,
  /** Bank of Russia rate of 14 Nov 2026 (₹100 = RUB 87.21); the ECB does not publish the rouble. */
  RUB: 1.146657,
};

export const RATE_SOURCES = [
  { name: "European Central Bank euro reference rates (13 Nov 2026)", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" },
  { name: "Central Bank of the UAE — dirham peg to the US dollar", url: "https://www.centralbank.ae/en/our-operations/monetary-policy/" },
  { name: "Bank of Russia official exchange rates (14 Nov 2026)", url: "https://www.cbr.ru/eng/currency_base/daily/" },
];

export type CostSource = { name: string | null; url: string | null; note?: string };
export type Money = { amount: number; currency: Currency };

export type CostData = {
  currency: Currency;
  symbol: string;
  defaultYears: number;
  /** Yearly tuition range in the country's currency. */
  tuition: { min: number; max: number; source: CostSource };
  /** Yearly living cost. */
  living: Money & { source: CostSource };
  /** One-time visa / permit government fees. */
  visa: Money & { source: CostSource };
  /** Health insurance per year. */
  insurance: Money & { source: CostSource };
  /** Lowest advertised one-way economy fare from India, in rupees. */
  flight: { inr: number; source: CostSource };
};

const est = (note?: string): CostSource => ({ name: null, url: null, note });
const s = (name: string, url: string, note?: string): CostSource => ({ name, url, note });
const m = (amount: number, currency: Currency) => ({ amount, currency });

export const COST_DATA: Record<string, CostData> = {
  germany: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 0, max: 3000, source: s("DAAD", "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/", "Most public universities charge no tuition; Baden-Württemberg charges €1,500 per semester.") },
    living: { ...m(11904, "EUR"), source: s("German Missions in India (blocked account)", "https://india.diplo.de/in-en/service/2756350-2756350") },
    visa: { ...m(75, "EUR"), source: s("German Missions in India", "https://india.diplo.de/in-en/service/2755482-2755482", "National visa fee. The APS certificate (₹18,000) is extra.") },
    insurance: { ...m(1755, "EUR"), source: s("Techniker Krankenkasse", "https://www.tk.de/en/contribution-foreign-students-german-health-insurance-2038022", "Statutory student insurance, €146.29 a month.") },
    flight: { inr: 42297, source: s("HappyFares (Delhi–Berlin)", "https://www.happyfares.in/flights/delhi-berlin-cheap-airtickets") },
  },
  canada: {
    currency: "CAD", symbol: "CA$", defaultYears: 2,
    tuition: { min: 15000, max: 40000, source: est("No official range. EduCanada lists CA$24,028 a year as the average for international graduate students.") },
    living: { ...m(23448, "CAD"), source: s("IRCC (proof of funds from 1 Sep 2026)", "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html") },
    visa: { ...m(235, "CAD"), source: s("IRCC fee list", "https://ircc.canada.ca/english/information/fees/fees.asp", "Study permit CA$150 + biometrics CA$85.") },
    insurance: { ...m(948, "CAD"), source: s("McMaster University (UHIP)", "https://studentsuccess.mcmaster.ca/international-students/health-insurance/", "Example: Ontario's UHIP plan. Other provinces differ.") },
    flight: { inr: 49095, source: s("Air India (Delhi–Toronto)", "https://www.airindia.com/en/book-flights/flights-from-delhi") },
  },
  uk: {
    currency: "GBP", symbol: "£", defaultYears: 1,
    tuition: { min: 9000, max: 30000, source: s("British Council Study UK", "https://study-uk.britishcouncil.org/moving-uk/cost-studying") },
    living: { ...m(10539, "GBP"), source: s("UK Home Office", "https://www.gov.uk/student-visa/money", "£1,171 a month for 9 months outside London (£1,529 a month in London).") },
    visa: { ...m(558, "GBP"), source: s("UK Home Office", "https://www.gov.uk/student-visa") },
    insurance: { ...m(776, "GBP"), source: s("UK Home Office (Immigration Health Surcharge)", "https://www.gov.uk/healthcare-immigration-application/how-much-pay", "Immigration Health Surcharge, £776 a year.") },
    flight: { inr: 39089, source: s("Air India (Mumbai–London)", "https://www.airindia.com/en/book-flights/mumbai-to-london-flights") },
  },
  usa: {
    currency: "USD", symbol: "$", defaultYears: 2,
    tuition: { min: 25000, max: 70000, source: est("No official range — EducationUSA says costs vary by university.") },
    living: { ...m(16000, "USD"), source: est("No national figure — each university lists its own cost on the I-20.") },
    visa: { ...m(535, "USD"), source: s("US Department of State & ICE", "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html", "F-1 visa fee $185 + SEVIS fee $350.") },
    insurance: { ...m(3006, "USD"), source: s("Central Washington University", "https://www.cwu.edu/about/offices/business-services/student-health-insurance", "Example: a university student health plan.") },
    flight: { inr: 49477, source: s("Air India (Delhi–New York)", "https://www.airindia.com/en/book-flights/flights-to-new-york") },
  },
  australia: {
    currency: "AUD", symbol: "AU$", defaultYears: 2,
    tuition: { min: 20000, max: 45000, source: est("No official range — Study Australia says fees vary by city and programme.") },
    living: { ...m(29710, "AUD"), source: s("Home Affairs requirement (via University of Queensland)", "https://uqcollege.uq.edu.au/future-students/campus-life/cost-of-living-guide") },
    visa: { ...m(2500, "AUD"), source: s("Study Australia (Australian Government)", "https://www.studyaustralia.gov.au/en/Agent-Hub/agent-news-index/student-visa-application-charge-increase", "Student visa (subclass 500) charge from 1 July 2026.") },
    insurance: { ...m(838, "AUD"), source: s("Australian National University (OSHC)", "https://www.anu.edu.au/students/program-administration/fees-payments/overseas-student-health-cover-duration-costs", "Example: single OSHC cover for 12 months.") },
    flight: { inr: 26960, source: s("Air India (Delhi–Sydney)", "https://www.airindia.com/en-in/book-flights/delhi-to-sydney-flights") },
  },
  ireland: {
    currency: "EUR", symbol: "€", defaultYears: 1,
    tuition: { min: 11000, max: 40000, source: s("Education in Ireland", "https://www.educationinireland.com/en/plan-your-study-abroad/postgraduate-tuition-fees") },
    living: { ...m(10000, "EUR"), source: s("Irish Immigration Service", "https://www.irishimmigration.ie/reminder-on-student-finance-requirements-from-30-june-2025/") },
    visa: { ...m(360, "EUR"), source: s("Irish Immigration Service", "https://www.irishimmigration.ie/preclearance-and-entry-visas-fees/", "Study visa €60 + immigration registration €300.") },
    insurance: { ...m(48000, "INR"), source: est("Private insurance is compulsory but there is no official price.") },
    flight: { inr: 43898, source: s("HappyFares (Delhi–Dublin)", "https://www.happyfares.in/flights/delhi-dublin-cheap-airtickets") },
  },
  "new-zealand": {
    currency: "NZD", symbol: "NZ$", defaultYears: 2,
    tuition: { min: 20000, max: 45000, source: s("Study with New Zealand", "https://www.studywithnewzealand.govt.nz/en/plan-your-studies/cost-of-living") },
    living: { ...m(20000, "NZD"), source: s("University of Auckland (visa funds)", "https://www.auckland.ac.nz/en/students/student-support/personal-support/international-student-support/visa-information/How-to-apply-for-a-student-visa/Student-visa-applications-for-new-students.html") },
    visa: { ...m(850, "NZD"), source: s("Immigration New Zealand", "https://www.immigration.govt.nz/visas/fee-paying-student-visa/") },
    insurance: { ...m(899, "NZD"), source: s("University of Auckland (StudentSafe)", "https://www.auckland.ac.nz/en/students/student-support/personal-support/international-student-support/health-and-travel-insurance/studentsafe-university-policy.html", "Example: a university insurance policy.") },
    flight: { inr: 41890, source: s("MakeMyTrip (Delhi–Auckland)", "https://www.makemytrip.com/international-flights/delhi-auckland-air_india-tickets.html") },
  },
  italy: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 900, max: 4000, source: s("European Commission, Study in Europe", "https://education.ec.europa.eu/study-in-europe/country-profiles/italy") },
    living: { ...m(10180, "EUR"), source: s("Embassy of Italy (visa funds)", "https://ambhelsinki.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/study-visa-visa-for-students-enrolling-in-full-italian-university-programs-bachelors-masters-phds/") },
    visa: { ...m(50, "EUR"), source: s("Embassy of Italy", "https://ambislamabad.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/quanto-costa-un-visto-e-come-pagare/", "National study visa fee. Residence permit charges in Italy are extra.") },
    insurance: { ...m(15000, "INR"), source: est("Insurance is compulsory but there is no official price.") },
    flight: { inr: 36743, source: s("Air India (Delhi–Rome)", "https://www.airindia.com/en-in/book-flights/delhi-to-rome-flights") },
  },
  france: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 3950, max: 3950, source: s("Campus France", "https://www.campusfrance.org/en/tuition-fees-France", "Standard public university master's fee for non-EU students.") },
    living: { ...m(10530, "EUR"), source: s("Service-Public.fr (visa funds)", "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231") },
    visa: { ...m(50, "EUR"), source: s("France-Visas", "https://france-visas.gouv.fr/documents/d/france-visas/frais-de-visa-anglais", "Reduced long-stay visa fee for Campus France applicants.") },
    insurance: { ...m(0, "EUR"), source: s("Campus France", "https://www.campusfrance.org/en/healthcare-student-social-security", "Joining French social security is free for students.") },
    flight: { inr: 37463, source: s("Air India (Delhi–Paris)", "https://www.airindia.com/en/book-flights/delhi-to-paris-flights") },
  },
  spain: {
    currency: "EUR", symbol: "€", defaultYears: 1,
    tuition: { min: 1000, max: 3500, source: s("European Commission, Study in Europe", "https://education.ec.europa.eu/study-in-europe/country-profiles/spain", "Public master's range; some regions charge non-EU students more.") },
    living: { ...m(12000, "EUR"), source: s("European Commission, Study in Europe", "https://education.ec.europa.eu/study-in-europe/country-profiles/spain", "Madrid and Barcelona, about €1,000 a month.") },
    visa: { ...m(8000, "INR"), source: est("Current fee for Indian students not published online.") },
    insurance: { ...m(50000, "INR"), source: est("Insurance is compulsory but there is no official price.") },
    flight: { inr: 27465, source: s("MakeMyTrip (Delhi–Madrid)", "https://www.makemytrip.com/international-flights/delhi-madrid-cheap-airtickets.html") },
  },
  netherlands: {
    currency: "EUR", symbol: "€", defaultYears: 1,
    tuition: { min: 12000, max: 30000, source: s("Study in NL (Nuffic)", "https://www.studyinnl.org/finances/tuition-fees") },
    living: { ...m(13569, "EUR"), source: s("IND (2026 required amount)", "https://ind.nl/en/news/fees-and-required-amounts-for-2026-known") },
    visa: { ...m(254, "EUR"), source: s("IND", "https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education") },
    insurance: { ...m(60000, "INR"), source: est("Private insurance needed; there is no official price.") },
    flight: { inr: 53712, source: s("Air India (Delhi–Amsterdam)", "https://www.airindia.com/en/book-flights/delhi-to-amsterdam-flights") },
  },
  sweden: {
    currency: "SEK", symbol: "SEK ", defaultYears: 2,
    tuition: { min: 80000, max: 320000, source: s("Study in Sweden (Swedish Institute)", "https://studyinsweden.se/plan-your-studies/fees-costs/") },
    living: { ...m(127872, "SEK"), source: s("Swedish Migration Agency", "https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html") },
    visa: { ...m(1500, "SEK"), source: s("Swedish Migration Agency", "https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html") },
    insurance: { ...m(20000, "INR"), source: est("Depends on your university's cover; no official price.") },
    flight: { inr: 31388, source: s("EaseMyTrip (Delhi–Stockholm)", "https://www.easemytrip.com/flights/flight-schedule-delhi-del-to-stockholm-arn/") },
  },
  norway: {
    currency: "NOK", symbol: "NOK ", defaultYears: 2,
    tuition: { min: 130000, max: 390000, source: s("European Commission, Study in Europe", "https://education.ec.europa.eu/study-in-europe/country-profiles/norway") },
    living: { ...m(170368, "NOK"), source: s("UDI (Norwegian Directorate of Immigration)", "https://www.udi.no/en/want-to-apply/studies/studietillatelse") },
    visa: { ...m(5400, "NOK"), source: s("UDI", "https://udi.no/en/word-definitions/fees") },
    insurance: { ...m(30000, "INR"), source: est("Cover needed until you join Norway's national insurance; no official price.") },
    flight: { inr: 29880, source: s("momondo (Delhi–Oslo)", "https://www.momondo.in/flights/new-delhi/oslo-airport-gardermoen-osl") },
  },
  denmark: {
    currency: "DKK", symbol: "DKK ", defaultYears: 2,
    tuition: { min: 45000, max: 120000, source: s("Study in Denmark", "https://studyindenmark.dk/study-options/tuition-fees-and-scholarships") },
    living: { ...m(89112, "DKK"), source: s("SIRI / New to Denmark (2026 level)", "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-education") },
    visa: { ...m(4935, "DKK"), source: s("SIRI & Danish Ministry of Foreign Affairs", "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-education", "SIRI fee DKK 3,060 + embassy fee DKK 1,875.") },
    insurance: { ...m(0, "DKK"), source: s("Study in Denmark", "https://studyindenmark.dk/live-in-denmark/health-safety/healthcare-1", "Public healthcare is free once you are a registered resident.") },
    flight: { inr: 33087, source: s("Expedia India (Delhi–Copenhagen)", "https://www.expedia.co.in/lp/flights/del/cph/delhi-to-copenhagen") },
  },
  finland: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 9000, max: 20000, source: s("Study in Finland", "https://www.studyinfinland.fi/funding-your-studies/fees-and-cost-living") },
    living: { ...m(9600, "EUR"), source: s("Finnish Immigration Service (Migri)", "https://migri.fi/en/income-requirement-for-students") },
    visa: { ...m(600, "EUR"), source: s("Finnish Immigration Service (Migri)", "https://migri.fi/en/residence-permit-application-for-studies", "Online application; paper application costs €750.") },
    insurance: { ...m(40000, "INR"), source: est("Private insurance is compulsory but there is no official price.") },
    flight: { inr: 35823, source: s("momondo (Delhi–Helsinki, Finnair)", "https://www.momondo.in/airlines/finnair") },
  },
  switzerland: {
    currency: "CHF", symbol: "CHF ", defaultYears: 2,
    tuition: { min: 870, max: 8000, source: s("swissuniversities", "https://www.swissuniversities.ch/en/themen/lehre-studium/information-on-studies/tuition-fees/tuition-fees-at-universities") },
    living: { ...m(21000, "CHF"), source: s("ETH Zurich (Zurich proof of funds)", "https://ethz.ch/en/studies/international/after-arrival/residence-permit/renewing.html") },
    visa: { ...m(184, "CHF"), source: s("Embassy of Switzerland in India & ETH Zurich", "https://www.schweiz-indien.eda.admin.ch/dam/en/eda-cms/Va9LJQCTTB2K/D-Checklist_Student_fee_90.00-En.pdf", "Student visa is free; Zurich registration (≈CHF 40) + residence permit (≈CHF 144).") },
    insurance: { ...m(1080, "CHF"), source: s("Study in Switzerland+ (swissuniversities)", "https://www.studyinswitzerland.plus/cost-of-living/") },
    flight: { inr: 23764, source: s("MakeMyTrip (Delhi–Zurich)", "https://www.makemytrip.com/international-flights/delhi-zurich-vistara_airlines-tickets.html") },
  },
  austria: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 1453, max: 1453, source: s("OeAD — Study in Austria", "https://studyinaustria.at/en/tuition", "Standard fee for non-EU students, €726.72 per semester.") },
    living: { ...m(8671, "EUR"), source: s("Academy of Fine Arts Vienna (visa funds)", "https://www.akbild.ac.at/en/studies/general-study-information/visas-and-residency/non-eu-citizens", "Minimum for students under 24; €15,701 a year from age 24.") },
    visa: { ...m(218, "EUR"), source: s("Austrian Foreign Ministry", "https://www.bmeia.gv.at/fileadmin/user_upload/Vertretungen/Astana/Dokumente/Merkblatt_AT-Studierende_-_DE_-_30.12.2025.pdf", "Student residence permit application fee.") },
    insurance: { ...m(946, "EUR"), source: s("Austrian federal government (oesterreich.gv.at)", "https://www.oesterreich.gv.at/de/themen/bildung_und_ausbildung/hochschulen/universitaet/4/1/Seite.160809", "Student self-insurance, €78.84 a month.") },
    flight: { inr: 29522, source: s("Air Arabia (Delhi–Vienna)", "https://flights.airarabia.com/en-in/flights-from-delhi-to-vienna") },
  },
  belgium: {
    currency: "EUR", symbol: "€", defaultYears: 1,
    tuition: { min: 5300, max: 12000, source: s("Study in Flanders", "https://www.studyinflanders.be/practical-information/tuition-fees", "Flanders public universities.") },
    living: { ...m(12744, "EUR"), source: s("Belgian Immigration Office", "https://dofi.ibz.be/en/themes/ressortissants-dun-pays-tiers/etudes/favoris/sufficient-means-subsistence") },
    visa: { ...m(501, "EUR"), source: s("Belgian Immigration Office & Foreign Affairs", "https://dofi.ibz.be/en/themes/faq/contribution-fee", "Student visa €250 + immigration contribution €251.") },
    insurance: { ...m(316, "EUR"), source: s("CAAMI-HZIV (public health insurance)", "https://www.caami-hziv.fgov.be/fr/membres/lassurance-soins-de-sante-pour-etudiants-etrangers") },
    flight: { inr: 28850, source: s("momondo (Delhi–Brussels)", "https://www.momondo.in/flights/new-delhi/brussels-airport-bru") },
  },
  poland: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 3600, max: 14180, source: s("Warsaw University of Technology", "https://www.students.pw.edu.pl/Studies-Offer/M.Sc.-offer", "Example: one public university's master's fees.") },
    living: { ...m(7000, "EUR"), source: est("The official minimum (PLN 1,010 a month) leaves out rent, so we use our estimate.") },
    visa: { ...m(21120, "INR"), source: s("Embassy of Poland in India", "https://www.gov.pl/web/india/consular-fees") },
    insurance: { ...m(180, "EUR"), source: s("NAWA — Study in Poland", "https://study.gov.pl/health-insurance", "About €15 a month.") },
    flight: { inr: 33180, source: s("momondo (Delhi–Warsaw, LOT)", "https://www.momondo.in/airlines/lot-polish-airlines") },
  },
  "czech-republic": {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 0, max: 6000, source: s("Study in Czechia", "https://www.studyin.cz/study/reasons-to-come-and-study/", "Studying in Czech is free; English-taught courses charge fees.") },
    living: { ...m(115810, "CZK"), source: s("Czech Ministry of the Interior", "https://ipc.gov.cz/en/forms-and-documents/documents/proof-of-funds-for-the-residence-finances/") },
    visa: { ...m(2500, "CZK"), source: s("Czech Ministry of Foreign Affairs", "https://mzv.gov.cz/jnp/en/information_for_aliens/visa_fee_schedule/index.html") },
    insurance: { ...m(60000, "INR"), source: est("Full insurance is compulsory but there is no official price.") },
    flight: { inr: 39520, source: s("Air Arabia (Delhi–Prague)", "https://flights.airarabia.com/en-in/flights-from-delhi-to-prague") },
  },
  hungary: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 4200, max: 9400, source: s("Eötvös Loránd University", "https://ppk.elte.hu/en/student_administration/payments", "Example: one public university's master's fees.") },
    living: { ...m(6000, "EUR"), source: s("European Commission, Study in Europe", "https://education.ec.europa.eu/study-in-europe/country-profiles/hungary") },
    visa: { ...m(110, "EUR"), source: s("Hungarian Ministry of Foreign Affairs", "https://baku.mfa.gov.hu/storage/19900/RP-students-infosheet.pdf", "Residence permit for study, applied from abroad.") },
    insurance: { ...m(112440, "HUF"), source: s("Eötvös Loránd University", "https://www.elte.hu/en/health-insurance/private") },
    flight: { inr: 45166, source: s("Air India (Delhi–Budapest)", "https://www.airindia.com/en/book-flights/delhi-to-hungary-flights") },
  },
  portugal: {
    currency: "EUR", symbol: "€", defaultYears: 2,
    tuition: { min: 3000, max: 7000, source: s("University of Lisbon, Faculty of Sciences", "https://ciencias.ulisboa.pt/en/international-students/faq", "Example: one public university's master's fees.") },
    living: { ...m(11040, "EUR"), source: s("Portuguese Ministry of Foreign Affairs", "https://vistos.mne.gov.pt/en/national-visas/necessary-documentation/means-of-subsistence") },
    visa: { ...m(110, "EUR"), source: s("Consulate General of Portugal in Goa", "https://goa.consuladoportugal.mne.gov.pt/en/consular-matters/visa", "Study visa fee; residence permit charges in Portugal are extra.") },
    insurance: { ...m(25000, "INR"), source: est("Insurance is compulsory but there is no official price.") },
    flight: { inr: 33488, source: s("MakeMyTrip (Mumbai–Lisbon)", "https://www.makemytrip.com/international-flights/mumbai-lisbon-cheap-airtickets.html") },
  },
  singapore: {
    currency: "SGD", symbol: "S$", defaultYears: 1,
    tuition: { min: 44050, max: 58860, source: s("National University of Singapore", "https://fass.nus.edu.sg/sea/masters-by-coursework/programme-fees/", "Example: NUS coursework master's fees.") },
    living: { ...m(18000, "SGD"), source: s("National University of Singapore", "https://medicine.nus.edu.sg/graduatestudies/wp-content/uploads/sites/16/2024/12/05-MSc-IDE_Checklist.pdf") },
    visa: { ...m(135, "SGD"), source: s("Singapore ICA", "https://www.ica.gov.sg/information-and-e-services/long-term-visit-and-study/student-s-pass/student's-pass-application-renewal/institutes-of-higher-learning", "Processing S$45 + Student's Pass S$60 + visa S$30.") },
    insurance: { ...m(331, "SGD"), source: s("National University of Singapore", "https://nus.edu.sg/registrar/docs/default-source/administrative-policies-procedures/gd-msf.pdf", "NUS health service fee for two semesters.") },
    flight: { inr: 16324, source: s("Air India (Delhi–Singapore)", "https://www.airindia.com/en-in/book-flights/delhi-to-singapore-flights") },
  },
  malaysia: {
    currency: "MYR", symbol: "RM ", defaultYears: 2,
    tuition: { min: 10000, max: 40000, source: est("Universities publish whole-course fees, not yearly ones.") },
    living: { ...m(18000, "MYR"), source: s("Universiti Malaya", "https://spm.um.edu.my/student/international-student-life/") },
    visa: { ...m(2100, "MYR"), source: s("Education Malaysia Global Services (EMGS)", "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_for_student_dependant_pass_app_28.10.2025.pdf", "EMGS processing, student pass and visa fees.") },
    insurance: { ...m(468, "MYR"), source: s("Education Malaysia Global Services (EMGS)", "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_for_student_dependant_pass_app_28.10.2025.pdf") },
    flight: { inr: 19133, source: s("Air India (Delhi–Kuala Lumpur)", "https://www.airindia.com/en-in/book-flights/delhi-to-kuala-lumpur-flights") },
  },
  japan: {
    currency: "JPY", symbol: "¥", defaultYears: 2,
    tuition: { min: 535800, max: 535800, source: s("The University of Tokyo", "https://www.u-tokyo.ac.jp/en/prospective-students/tuition_fees.html", "Standard national university tuition.") },
    living: { ...m(1260000, "JPY"), source: s("Study in Japan (JASSO)", "https://www.studyinjapan.go.jp/ja/life/cost-of-living/") },
    visa: { ...m(500, "INR"), source: s("Embassy of Japan in India", "https://www.in.emb-japan.go.jp/itpr_en/visa.html") },
    insurance: { ...m(20000, "JPY"), source: s("Hokkaido University", "https://intl-student-handbook.oia.hokudai.ac.jp/en/procedure-en/city_office/health_insurance", "National Health Insurance for students (example: Sapporo).") },
    flight: { inr: 17958, source: s("MakeMyTrip (Delhi–Tokyo)", "https://www.makemytrip.com/international-flights/delhi-tokyo-cheap-airtickets.html") },
  },
  "south-korea": {
    currency: "KRW", symbol: "₩", defaultYears: 2,
    tuition: { min: 5924000, max: 8332000, source: s("Jeonbuk National University", "https://ioffice.jbnu.ac.kr/bbs/ioffice/5310/346204/download.do", "Example: one national university's graduate fees.") },
    living: { ...m(9000000, "KRW"), source: s("Study in Korea (NIIED)", "https://www.studyinkorea.go.kr/en/life/livingExpense.do") },
    visa: { ...m(5400, "INR"), source: s("Embassy of Korea in India", "https://overseas.mofa.go.kr/in-en/brd/m_20446/view.do?page=1&seq=748829") },
    insurance: { ...m(951840, "KRW"), source: s("Sogang University (National Health Insurance)", "https://oisa.sogang.ac.kr/bbs/oisa/575/227945/artclView.do", "Compulsory national health insurance, ₩79,320 a month.") },
    flight: { inr: 24714, source: s("Air India (Delhi–Seoul)", "https://www.airindia.com/en-us/book-flights/delhi-to-seoul-flights") },
  },
  china: {
    currency: "CNY", symbol: "CN¥", defaultYears: 2,
    tuition: { min: 26000, max: 45000, source: s("Xiamen University", "https://admissions.xmu.edu.cn/Admissions/Costs.htm", "Example: one public university's master's fees.") },
    living: { ...m(40000, "CNY"), source: est("No official yearly living figure.") },
    visa: { ...m(2900, "INR"), source: s("Embassy of China in India", "https://in.china-embassy.gov.cn/eng/lsfw/2consularservice/202610/t20261021_12044639.htm", "Residence permit and medical check in China are extra.") },
    insurance: { ...m(800, "CNY"), source: s("Xiamen University", "https://admissions.xmu.edu.cn/Admissions/Costs.htm") },
    flight: { inr: 16575, source: s("MakeMyTrip (Delhi–Beijing)", "https://www.makemytrip.com/international-flights/delhi-beijing-cheap-airtickets.html") },
  },
  uae: {
    currency: "AED", symbol: "AED ", defaultYears: 2,
    tuition: { min: 40000, max: 90000, source: est("Universities charge per credit, not per year.") },
    living: { ...m(42500, "AED"), source: est("No official yearly living figure.") },
    visa: { ...m(240, "AED"), source: s("GDRFA Dubai", "https://www.gdrfad.gov.ae/en/services/f52024e0-b812-11ed-5210-4cd98f768936", "Student residence permit; Emirates ID and medical test are extra.") },
    insurance: { ...m(50000, "INR"), source: est("No official price.") },
    flight: { inr: 13174, source: s("MakeMyTrip (Mumbai–Dubai)", "https://www.makemytrip.com/international-flights/mumbai-dubai-cheap-airtickets.html") },
  },
  turkey: {
    currency: "USD", symbol: "$", defaultYears: 2,
    tuition: { min: 750, max: 750, source: s("Middle East Technical University", "https://iso.metu.edu.tr/tr/system/files/2025-2026_tuition_fee_11082025.pdf", "Example: one public university ($375 per semester). Private universities cost much more.") },
    living: { ...m(4800, "USD"), source: s("Haliç University (Istanbul)", "https://international.halic.edu.tr/living-expenses-in-istanbul/") },
    visa: { ...m(5000, "INR"), source: est("The embassy's published fees date from 2022.") },
    insurance: { ...m(10000, "INR"), source: est("No official price.") },
    flight: { inr: 15343, source: s("MakeMyTrip (Delhi–Istanbul)", "https://www.makemytrip.com/international-flights/delhi-istanbul-cheap-airtickets.html") },
  },
  russia: {
    currency: "USD", symbol: "$", defaultYears: 2,
    tuition: { min: 3000, max: 8000, source: est("Fees vary by university; no official range.") },
    living: { ...m(420000, "RUB"), source: s("HSE University (Moscow)", "https://www.hse.ru/recommends/costs/") },
    visa: { ...m(5000, "INR"), source: est("Current fee for Indian students not published online.") },
    insurance: { ...m(6500, "RUB"), source: s("HSE University", "https://www.hse.ru/recommends/costs/") },
    flight: { inr: 21036, source: s("MakeMyTrip (Delhi–Moscow)", "https://www.makemytrip.com/international-flights/delhi-moscow-cheap-airtickets.html") },
  },
};
