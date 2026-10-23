import { EXTRA_GUIDES } from "./country-guides-extra";
export type CountryGuide = {
  slug: string;
  code: string;
  name: string;
  intro: string;
  tuition: string;
  living: string;
  intakes: string;
  workRights: string;
  universities: string[];
  visaName: string;
  visaSteps: string[];
  scholarships: { name: string; note: string }[];
  faqs: { q: string; a: string }[];
};

export const COUNTRY_GUIDES: CountryGuide[] = [
  {
    slug: "germany",
    code: "de",
    name: "Germany",
    intro:
      "Germany is a top choice for Indian students because most public universities charge little or no tuition, and engineering, computer science and management programs are taught in English.",
    tuition: "€0 – €3,000 per year at most public universities (private: €10k – €20k)",
    living: "Around €11,000+ per year (shown through a blocked account)",
    intakes: "Winter (October) and Summer (April)",
    workRights: "Part-time work allowed during studies; post-study job-seeker permit available",
    universities: ["Technical University of Munich (TUM)", "LMU Munich", "Heidelberg University", "RWTH Aachen", "TU Berlin", "University of Stuttgart"],
    visaName: "German National Student Visa",
    visaSteps: [
      "Get your university admission letter",
      "Open a blocked account and arrange health insurance",
      "Book a visa appointment and prepare documents (APS certificate, transcripts, language scores)",
      "Attend the visa interview",
      "Travel and register your address in Germany",
    ],
    scholarships: [
      { name: "DAAD Scholarships", note: "Germany's largest scholarship program for international students" },
      { name: "Deutschlandstipendium", note: "Merit scholarship offered through universities" },
      { name: "University-specific grants", note: "Many universities offer fee waivers and merit awards" },
    ],
    faqs: [
      { q: "Is studying in Germany free for Indian students?", a: "Most public universities charge no tuition, only a small semester fee. You still need to show funds for living costs." },
      { q: "Do I need to know German?", a: "Many master's programs are fully in English. Basic German helps with part-time jobs and daily life." },
    ],
  },
  {
    slug: "canada",
    code: "ca",
    name: "Canada",
    intro:
      "Canada offers globally recognised degrees, a welcoming multicultural environment and clear pathways to work after graduation.",
    tuition: "CA$15,000 – CA$40,000 per year",
    living: "Around CA$20,000+ per year",
    intakes: "September, January and May",
    workRights: "Part-time work allowed during studies; Post-Graduation Work Permit (PGWP) for eligible programs",
    universities: ["University of Toronto", "McGill University", "University of British Columbia", "University of Waterloo", "McMaster University", "University of Alberta"],
    visaName: "Canadian Study Permit",
    visaSteps: [
      "Receive a Letter of Acceptance from a Designated Learning Institution",
      "Get the Provincial Attestation Letter (where required)",
      "Show proof of funds (GIC + first-year tuition)",
      "Apply online with biometrics and medicals",
      "Receive the permit approval and travel",
    ],
    scholarships: [
      { name: "University entrance scholarships", note: "Automatic and merit-based awards at most universities" },
      { name: "Lester B. Pearson Scholarship", note: "University of Toronto's full scholarship for international students" },
      { name: "Provincial & college awards", note: "Many colleges offer international student bursaries" },
    ],
    faqs: [
      { q: "Can I work in Canada after studying?", a: "Eligible graduates can apply for a Post-Graduation Work Permit to gain Canadian work experience." },
      { q: "Is IELTS required for Canada?", a: "Most institutions need IELTS, PTE or another accepted English test. We help you prepare." },
    ],
  },
  {
    slug: "uk",
    code: "gb",
    name: "the UK",
    intro:
      "The UK offers shorter degrees — most master's programs take just one year — at some of the world's oldest and highest-ranked universities.",
    tuition: "£12,000 – £38,000 per year",
    living: "Around £12,000 – £16,000 per year (higher in London)",
    intakes: "September and January",
    workRights: "Part-time work during term; Graduate Route visa after your degree",
    universities: ["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "University of Edinburgh", "University of Manchester"],
    visaName: "UK Student Visa",
    visaSteps: [
      "Receive an unconditional offer and your CAS number",
      "Show funds for tuition and living costs",
      "Apply online, pay the visa fee and health surcharge",
      "Give biometrics at the visa centre",
      "Receive your visa and travel",
    ],
    scholarships: [
      { name: "Chevening Scholarships", note: "UK government's fully funded master's scholarship" },
      { name: "Commonwealth Scholarships", note: "For students from Commonwealth countries including India" },
      { name: "University merit awards", note: "Most UK universities offer partial tuition discounts" },
    ],
    faqs: [
      { q: "How long is a master's degree in the UK?", a: "Most taught master's programs take 12 months, saving you time and living costs." },
      { q: "Can I stay in the UK after graduation?", a: "The Graduate Route lets eligible students stay and work after completing their degree." },
    ],
  },
  {
    slug: "usa",
    code: "us",
    name: "the USA",
    intro:
      "The USA has the world's largest choice of universities, flexible programs and strong research and STEM career opportunities.",
    tuition: "$25,000 – $70,000 per year",
    living: "Around $12,000 – $20,000 per year",
    intakes: "Fall (August) and Spring (January)",
    workRights: "On-campus work during studies; OPT after graduation (extended for STEM)",
    universities: ["MIT", "Harvard University", "Stanford University", "Carnegie Mellon University", "University of California, Berkeley", "Arizona State University"],
    visaName: "US F-1 Student Visa",
    visaSteps: [
      "Get admission and your I-20 from the university",
      "Pay the SEVIS fee",
      "Fill the DS-160 form and book your appointment",
      "Prepare for and attend the visa interview",
      "Receive your visa and travel",
    ],
    scholarships: [
      { name: "Fulbright-Nehru Fellowships", note: "Prestigious funding for Indian students for master's study" },
      { name: "University assistantships", note: "Teaching and research assistantships with fee waivers" },
      { name: "Merit scholarships", note: "Many universities offer awards based on your profile" },
    ],
    faqs: [
      { q: "Is GRE or SAT required for the USA?", a: "It depends on the university and program. Many are test-optional; strong scores can still help with scholarships." },
      { q: "How do I prepare for the F-1 interview?", a: "We run mock visa interviews so you can answer confidently about your course, funding and plans." },
    ],
  },
  {
    slug: "australia",
    code: "au",
    name: "Australia",
    intro:
      "Australia combines high-quality universities, a great lifestyle and strong post-study work options for Indian students.",
    tuition: "AU$20,000 – AU$45,000 per year",
    living: "Around AU$29,000+ per year",
    intakes: "February and July",
    workRights: "Part-time work during studies; Temporary Graduate visa after your degree",
    universities: ["University of Melbourne", "Australian National University", "University of Sydney", "UNSW Sydney", "Monash University", "University of Queensland"],
    visaName: "Australian Student Visa (Subclass 500)",
    visaSteps: [
      "Receive your offer and Confirmation of Enrolment (CoE)",
      "Arrange Overseas Student Health Cover (OSHC)",
      "Show funds and meet the Genuine Student requirement",
      "Apply online with biometrics and medicals",
      "Receive your visa grant and travel",
    ],
    scholarships: [
      { name: "Australia Awards", note: "Australian government scholarships" },
      { name: "University international scholarships", note: "Merit awards from 10% to 50% of tuition at many universities" },
      { name: "Research Training Program", note: "For research degree students" },
    ],
    faqs: [
      { q: "Can I work while studying in Australia?", a: "Yes, student visa holders can work limited hours during term and full-time in breaks." },
      { q: "Which intake is better for Australia?", a: "February is the main intake with the most courses; July is a good second option." },
    ],
  },
  ...EXTRA_GUIDES,
];

export const getCountryGuide = (slug: string) => COUNTRY_GUIDES.find((c) => c.slug === slug);
