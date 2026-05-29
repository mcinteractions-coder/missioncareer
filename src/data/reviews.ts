export type Review = {
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  gradient: string;
  destination?: string;
};

export const reviews: Review[] = [
  {
    name: "Aarav Sharma",
    initials: "AS",
    rating: 5,
    text: "Mission Career made my dream of studying in the UK come true! The counselors guided me through every single step — university selection, SOP, visa — flawless experience.",
    date: "2 weeks ago",
    gradient: "from-blue-500 to-indigo-600",
    destination: "University of Manchester, UK",
  },
  {
    name: "Priya Verma",
    initials: "PV",
    rating: 5,
    text: "Best study abroad consultancy in the city! Got my Canada student visa in just 3 weeks. The team is super responsive and genuinely cares about students.",
    date: "1 month ago",
    gradient: "from-pink-500 to-rose-600",
    destination: "University of Toronto, Canada",
  },
  {
    name: "Rohan Mehta",
    initials: "RM",
    rating: 5,
    text: "I had so many doubts about Australia, but the Mission Career team explained everything clearly. Got a scholarship I didn't even know I qualified for!",
    date: "3 weeks ago",
    gradient: "from-amber-500 to-orange-600",
    destination: "Monash University, Australia",
  },
  {
    name: "Sneha Iyer",
    initials: "SI",
    rating: 5,
    text: "Honest, transparent, and zero pressure. They suggested universities that actually matched my profile and budget — not the most expensive ones. Highly recommend!",
    date: "2 months ago",
    gradient: "from-emerald-500 to-teal-600",
    destination: "TU Munich, Germany",
  },
  {
    name: "Karan Patel",
    initials: "KP",
    rating: 5,
    text: "From IELTS coaching to landing in the USA — Mission Career handled it all. The mock visa interview really helped me crack the F1 interview on first attempt.",
    date: "1 month ago",
    gradient: "from-violet-500 to-purple-600",
    destination: "Arizona State University, USA",
  },
  {
    name: "Ananya Kapoor",
    initials: "AK",
    rating: 5,
    text: "Thank you Mission Career team! My education loan, accommodation, even airport pickup — everything was sorted. Felt like family throughout the journey.",
    date: "3 weeks ago",
    gradient: "from-cyan-500 to-blue-600",
    destination: "Trinity College Dublin, Ireland",
  },
  {
    name: "Vikram Singh",
    initials: "VS",
    rating: 5,
    text: "Compared 5 consultancies before choosing Mission Career. Their knowledge of New Zealand universities is unmatched. Got admission with 50% scholarship!",
    date: "1 week ago",
    gradient: "from-fuchsia-500 to-pink-600",
    destination: "University of Auckland, NZ",
  },
  {
    name: "Riya Joshi",
    initials: "RJ",
    rating: 5,
    text: "The counsellors are so knowledgeable and patient. They answered my 100+ questions without ever making me feel rushed. Now I'm happily studying in London!",
    date: "2 months ago",
    gradient: "from-red-500 to-orange-600",
    destination: "Kings College London, UK",
  },
  {
    name: "Aditya Rao",
    initials: "AR",
    rating: 5,
    text: "Genuinely the best decision I made. SOP review, mock interviews, financial documentation — they polished everything. 10/10 service for any student!",
    date: "5 days ago",
    gradient: "from-lime-500 to-green-600",
    destination: "UBC, Canada",
  },
  {
    name: "Meera Nair",
    initials: "MN",
    rating: 5,
    text: "Mission Career turned my confusion into clarity. They mapped out 3 country options based on my goals and helped me pick the perfect fit. Forever grateful!",
    date: "1 month ago",
    gradient: "from-sky-500 to-indigo-600",
    destination: "University of Sydney, Australia",
  },
];
