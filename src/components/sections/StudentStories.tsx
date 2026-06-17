import { useState } from "react";

type Story = {
  name: string;
  emoji: string;
  course: string;
  uni: string;
  scholarship: string;
  duration: string;
  outcome: string;
  category: string;
};

type Country = {
  code: string;
  name: string;
  flag: string;
  gradient: string;
  emoji: string;
  stories: Story[];
};

const COUNTRIES: Country[] = [
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    emoji: "🏰",
    gradient: "from-yellow-400 via-red-500 to-black",
    stories: [
      { name: "Rohan Mehta", emoji: "🧑‍💻", category: "Engineering", course: "MS Mechanical Engineering", uni: "TU Munich", scholarship: "€10,000 DAAD", duration: "2 yrs", outcome: "Got 18-month Job Seeker Visa, hired at BMW" },
      { name: "Priya Sharma", emoji: "👩‍🔬", category: "Research", course: "MS Biotechnology", uni: "Heidelberg University", scholarship: "Full Tuition Waiver", duration: "2 yrs", outcome: "PhD offer + research grant €1,500/mo" },
      { name: "Arjun Patel", emoji: "🧑‍🎨", category: "Design", course: "MA Industrial Design", uni: "HFG Offenbach", scholarship: "€5,000 Merit", duration: "1.5 yrs", outcome: "Working at Audi Design Studio" },
      { name: "Sneha Iyer", emoji: "👩‍💼", category: "Business", course: "MBA International Mgmt", uni: "Mannheim Business School", scholarship: "€8,000", duration: "1 yr", outcome: "PR after 21 months, consultant at McKinsey" },
      { name: "Vikram Singh", emoji: "🧑‍🔧", category: "Vocational", course: "Ausbildung Mechatronics", uni: "Siemens Training", scholarship: "Paid €1,200/mo", duration: "3 yrs", outcome: "Permanent role + work visa" },
    ],
  },
  {
    code: "US",
    name: "USA",
    flag: "🇺🇸",
    emoji: "🗽",
    gradient: "from-blue-600 via-white to-red-500",
    stories: [
      { name: "Aditya Rao", emoji: "🧑‍💻", category: "Tech", course: "MS Computer Science", uni: "Carnegie Mellon", scholarship: "$25,000 TA", duration: "2 yrs", outcome: "Joined Google, H1B sponsored" },
      { name: "Nisha Verma", emoji: "👩‍🔬", category: "Research", course: "PhD Data Science", uni: "MIT", scholarship: "Full Funding + Stipend", duration: "5 yrs", outcome: "Research scientist at OpenAI" },
      { name: "Karan Joshi", emoji: "👨‍💼", category: "Business", course: "MBA", uni: "Wharton", scholarship: "$50,000 Fellowship", duration: "2 yrs", outcome: "Investment Banker at Goldman Sachs" },
      { name: "Meera Nair", emoji: "👩‍⚕️", category: "Medical", course: "MS Public Health", uni: "Johns Hopkins", scholarship: "$15,000", duration: "1.5 yrs", outcome: "WHO Fellowship, OPT extended" },
      { name: "Tanay Kapoor", emoji: "🧑‍🎓", category: "Undergrad", course: "BS Economics", uni: "NYU Stern", scholarship: "$20,000/yr", duration: "4 yrs", outcome: "Analyst at JP Morgan" },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    emoji: "🍁",
    gradient: "from-red-500 via-white to-red-600",
    stories: [
      { name: "Harleen Kaur", emoji: "👩‍💻", category: "Tech", course: "PG Diploma Cloud Computing", uni: "Conestoga College", scholarship: "CAD 3,000", duration: "1 yr", outcome: "PGWP + PR via Express Entry" },
      { name: "Rahul Bhatia", emoji: "👨‍🍳", category: "Hospitality", course: "Diploma Culinary Arts", uni: "George Brown", scholarship: "CAD 2,500", duration: "2 yrs", outcome: "Sous Chef in Toronto + PR" },
      { name: "Pooja Reddy", emoji: "👩‍⚕️", category: "Healthcare", course: "MSc Nursing", uni: "University of Toronto", scholarship: "CAD 10,000", duration: "2 yrs", outcome: "RN at Sunnybrook Hospital" },
      { name: "Sahil Khanna", emoji: "🧑‍🔬", category: "Research", course: "MS AI", uni: "University of Waterloo", scholarship: "CAD 15,000 TA", duration: "2 yrs", outcome: "ML Engineer at Shopify" },
      { name: "Ananya Das", emoji: "👩‍🎨", category: "Creative", course: "BA Animation", uni: "Sheridan College", scholarship: "CAD 4,000", duration: "4 yrs", outcome: "Animator at Pixar Canada" },
    ],
  },
  {
    code: "UK",
    name: "UK",
    flag: "🇬🇧",
    emoji: "🎡",
    gradient: "from-blue-700 via-white to-red-600",
    stories: [
      { name: "Ishaan Malhotra", emoji: "👨‍💼", category: "Finance", course: "MSc Finance", uni: "LSE", scholarship: "£8,000", duration: "1 yr", outcome: "Graduate Route Visa, Analyst at HSBC" },
      { name: "Riya Bansal", emoji: "👩‍⚖️", category: "Law", course: "LLM International Law", uni: "Oxford", scholarship: "Chevening Full", duration: "1 yr", outcome: "Associate at Clifford Chance" },
      { name: "Dev Saxena", emoji: "🧑‍💻", category: "Tech", course: "MSc AI", uni: "Imperial College London", scholarship: "£10,000", duration: "1 yr", outcome: "Skilled Worker Visa at DeepMind" },
      { name: "Tanvi Shetty", emoji: "👩‍🎨", category: "Arts", course: "MA Fashion", uni: "Central Saint Martins", scholarship: "£5,000", duration: "2 yrs", outcome: "Designer at Burberry" },
      { name: "Aryan Gupta", emoji: "👨‍🔬", category: "Research", course: "PhD Physics", uni: "Cambridge", scholarship: "Fully Funded + Stipend", duration: "4 yrs", outcome: "Postdoc at CERN" },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    emoji: "🦘",
    gradient: "from-blue-600 via-yellow-400 to-red-600",
    stories: [
      { name: "Neha Pillai", emoji: "👩‍⚕️", category: "Healthcare", course: "Master of Nursing", uni: "University of Melbourne", scholarship: "AUD 10,000", duration: "2 yrs", outcome: "PR via Skilled Migration" },
      { name: "Raghav Menon", emoji: "🧑‍💻", category: "Tech", course: "MS IT", uni: "UNSW Sydney", scholarship: "AUD 15,000", duration: "2 yrs", outcome: "485 Visa, Dev at Atlassian" },
      { name: "Simran Kaur", emoji: "👩‍🍳", category: "Hospitality", course: "Diploma Hospitality Mgmt", uni: "TAFE NSW", scholarship: "AUD 3,000", duration: "1.5 yrs", outcome: "Manager at Hilton Sydney" },
      { name: "Kabir Anand", emoji: "👨‍🌾", category: "Agriculture", course: "MSc Agribusiness", uni: "University of Queensland", scholarship: "AUD 12,000", duration: "2 yrs", outcome: "Regional Sponsored Visa" },
      { name: "Aisha Khan", emoji: "👩‍💼", category: "Business", course: "MBA", uni: "Melbourne Business School", scholarship: "AUD 20,000", duration: "1.5 yrs", outcome: "Consultant at Deloitte" },
    ],
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    emoji: "🗼",
    gradient: "from-blue-700 via-white to-red-600",
    stories: [
      { name: "Aanya Sinha", emoji: "👩‍💼", category: "Business", course: "MIM", uni: "HEC Paris", scholarship: "€12,000 Eiffel", duration: "2 yrs", outcome: "APS Visa, Strategy role at LVMH" },
      { name: "Yash Pandey", emoji: "🧑‍🎨", category: "Design", course: "MA Luxury Brand Mgmt", uni: "ESSEC", scholarship: "€8,000", duration: "1.5 yrs", outcome: "Brand Manager at Chanel" },
      { name: "Diya Kapoor", emoji: "👩‍🍳", category: "Culinary", course: "Grand Diplôme", uni: "Le Cordon Bleu", scholarship: "€5,000", duration: "9 mo", outcome: "Pastry Chef at Ritz Paris" },
      { name: "Manav Jain", emoji: "🧑‍💻", category: "Tech", course: "MS Data Science", uni: "École Polytechnique", scholarship: "Full Tuition", duration: "2 yrs", outcome: "Data Scientist at Dassault" },
      { name: "Sara Mathew", emoji: "👩‍🔬", category: "Research", course: "PhD Aerospace", uni: "ISAE-SUPAERO", scholarship: "Fully Funded", duration: "3 yrs", outcome: "Engineer at Airbus" },
    ],
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    emoji: "🍀",
    gradient: "from-green-600 via-white to-orange-500",
    stories: [
      { name: "Aakash Tiwari", emoji: "🧑‍💻", category: "Tech", course: "MSc Computing", uni: "Trinity College Dublin", scholarship: "€6,000", duration: "1 yr", outcome: "2-yr Stay Back, Hired at Meta Dublin" },
      { name: "Komal Joshi", emoji: "👩‍💼", category: "Business", course: "MSc Marketing", uni: "UCD Smurfit", scholarship: "€5,000", duration: "1 yr", outcome: "Marketing Lead at Google Ireland" },
      { name: "Rohit Sharma", emoji: "👨‍🔬", category: "Pharma", course: "MSc Pharmaceutical Sciences", uni: "UCC", scholarship: "€7,500", duration: "1 yr", outcome: "Scientist at Pfizer" },
      { name: "Jasleen Bedi", emoji: "👩‍💻", category: "Data", course: "MSc Data Analytics", uni: "DCU", scholarship: "€4,000", duration: "1 yr", outcome: "Analyst at LinkedIn Dublin" },
      { name: "Varun Khurana", emoji: "🧑‍🔧", category: "Engineering", course: "MEng Electronics", uni: "NUI Galway", scholarship: "€8,000", duration: "1 yr", outcome: "Critical Skills Visa at Intel" },
    ],
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    emoji: "🥝",
    gradient: "from-blue-700 via-blue-500 to-red-600",
    stories: [
      { name: "Mehul Desai", emoji: "🧑‍🌾", category: "Agriculture", course: "PG Diploma Dairy", uni: "Lincoln University", scholarship: "NZD 5,000", duration: "1 yr", outcome: "Work Visa + Farm Manager role" },
      { name: "Pari Agarwal", emoji: "👩‍⚕️", category: "Healthcare", course: "PG Nursing", uni: "University of Auckland", scholarship: "NZD 8,000", duration: "1.5 yrs", outcome: "Registered Nurse + PR" },
      { name: "Siddharth Roy", emoji: "🧑‍💻", category: "Tech", course: "MIT", uni: "Victoria University Wellington", scholarship: "NZD 10,000", duration: "2 yrs", outcome: "Dev at Xero" },
      { name: "Tara Bhalla", emoji: "👩‍🎨", category: "Film", course: "MA Film Production", uni: "AUT", scholarship: "NZD 6,000", duration: "2 yrs", outcome: "VFX Artist at Weta FX" },
      { name: "Nikhil Bose", emoji: "👨‍💼", category: "Business", course: "MBA", uni: "University of Otago", scholarship: "NZD 12,000", duration: "1.5 yrs", outcome: "Consultant + Skilled Migrant PR" },
    ],
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    emoji: "🌷",
    gradient: "from-red-600 via-white to-blue-700",
    stories: [
      { name: "Aarav Chopra", emoji: "🧑‍💻", category: "Tech", course: "MS AI", uni: "TU Delft", scholarship: "Holland Scholarship €5,000", duration: "2 yrs", outcome: "Orientation Year Visa, ML Eng at ASML" },
      { name: "Isha Bhatt", emoji: "👩‍💼", category: "Business", course: "MSc International Business", uni: "Erasmus Rotterdam", scholarship: "€7,000", duration: "1 yr", outcome: "Highly Skilled Migrant at Booking.com" },
      { name: "Rishab Mishra", emoji: "🧑‍🔬", category: "Science", course: "MSc Renewable Energy", uni: "TU Eindhoven", scholarship: "€10,000", duration: "2 yrs", outcome: "Engineer at Shell Renewables" },
      { name: "Maya Pillai", emoji: "👩‍🎨", category: "Design", course: "MA Design", uni: "Design Academy Eindhoven", scholarship: "€4,000", duration: "2 yrs", outcome: "Designer at Philips" },
      { name: "Aman Sethi", emoji: "👨‍⚖️", category: "Law", course: "LLM International Law", uni: "Leiden University", scholarship: "€6,000", duration: "1 yr", outcome: "Legal Counsel at ICC The Hague" },
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    emoji: "🦁",
    gradient: "from-red-600 via-white to-red-700",
    stories: [
      { name: "Krish Aggarwal", emoji: "🧑‍💻", category: "Tech", course: "MSc Computing", uni: "NUS", scholarship: "SGD 15,000", duration: "1.5 yrs", outcome: "Employment Pass at Stripe APAC" },
      { name: "Anvi Goyal", emoji: "👩‍💼", category: "Finance", course: "MBA", uni: "INSEAD Singapore", scholarship: "SGD 20,000", duration: "1 yr", outcome: "VP at DBS Bank" },
      { name: "Rudra Pathak", emoji: "🧑‍🔬", category: "Research", course: "PhD Biomedical", uni: "NTU", scholarship: "Fully Funded + Stipend", duration: "4 yrs", outcome: "Researcher at A*STAR" },
      { name: "Lavanya Iyer", emoji: "👩‍🎨", category: "Media", course: "MA Communication", uni: "SMU", scholarship: "SGD 10,000", duration: "1.5 yrs", outcome: "Creative Lead at Grab" },
      { name: "Devansh Rana", emoji: "🧑‍🍳", category: "Hospitality", course: "Diploma Hotel Mgmt", uni: "SHATEC", scholarship: "SGD 5,000", duration: "2 yrs", outcome: "F&B Manager at Marina Bay Sands" },
    ],
  },
];

export function StudentStories() {
  const [activeCode, setActiveCode] = useState(COUNTRIES[0].code);
  const active = COUNTRIES.find((c) => c.code === activeCode)!;

  return (
    <section id="student-stories" className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* floating cartoon bubbles */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: "4s" }}>✈️</div>
        <div className="absolute top-32 right-20 text-5xl opacity-20 animate-bounce" style={{ animationDuration: "5s", animationDelay: "0.5s" }}>🎓</div>
        <div className="absolute bottom-20 left-1/4 text-6xl opacity-20 animate-bounce" style={{ animationDuration: "6s", animationDelay: "1s" }}>🌍</div>
        <div className="absolute bottom-40 right-1/3 text-5xl opacity-20 animate-bounce" style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}>🛂</div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            🎒 Real Student Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Adventures Across <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">10 Countries</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our happy explorers — scholarships bagged, degrees earned, work visas secured. Pick a country to read their fun journey!
          </p>
        </div>

        {/* Country tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {COUNTRIES.map((c) => {
            const isActive = c.code === activeCode;
            return (
              <button
                key={c.code}
                onClick={() => setActiveCode(c.code)}
                className={`group relative px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground scale-110 shadow-xl shadow-primary/30"
                    : "border-border bg-card hover:border-primary/50 hover:scale-105"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300">
                    {c.flag}
                  </span>
                  <span className="font-semibold text-sm">{c.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active country headline */}
        <div className="text-center mb-8">
          <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${active.gradient} text-white font-bold text-lg shadow-lg`}>
            <span className="text-3xl mr-2">{active.emoji}</span>
            Stories from {active.name} {active.flag}
          </div>
        </div>

        {/* Story cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.stories.map((s, i) => (
            <div
              key={s.name}
              className="group relative bg-card border-2 border-border rounded-3xl p-6 hover:border-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* 3D cartoon avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    {s.emoji}
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-2xl drop-shadow-lg">
                    {active.flag}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight">{s.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
                    {s.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-base">📚</span>
                  <span><span className="font-semibold">{s.course}</span> · {s.duration}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-base">🏛️</span>
                  <span className="text-muted-foreground">{s.uni}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-base">💰</span>
                  <span className="font-semibold text-primary">{s.scholarship}</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <span className="text-base">🚀</span>
                  <span className="font-medium">{s.outcome}</span>
                </div>
              </div>

              {/* shine effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Want your story here next? ✨</p>
          <a
            href="#booking"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Start Your Journey 🎒
          </a>
        </div>
      </div>
    </section>
  );
}
