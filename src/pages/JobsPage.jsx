import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Briefcase,
  Search,
  ExternalLink,
  X,
  Zap,
  BookmarkCheck,
  TrendingUp,
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Wifi,
  GraduationCap,
  Code2,
  Landmark,
  Flame,
  Star,
  File,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────
const JOB_BOARDS = [
  { id:"jobberman",      name:"Jobberman",             logo:"J",  color:"#0F2854", tagline:"Nigeria's #1 Job Board",           description:"The largest Nigerian job board with thousands of verified listings across every sector  finance, tech, health, marketing and more.", url:"https://www.jobberman.com/jobs",                                                      category:"Nigeria", type:"General",    badge:"Most Popular",     badgeColor:"#1C4D8D", listings:"50,000+", focus:"All sectors"    },
  { id:"myjobmag",       name:"MyJobMag",               logo:"M",  color:"#1C4D8D", tagline:"Jobs & Career Advice",              description:"Active listings from top Nigerian companies with salary data, career tips and graduate programmes all in one place.",              url:"https://www.myjobmag.com/find-jobs/nigeria",                                          category:"Nigeria", type:"Graduate",   badge:"Graduate Friendly",badgeColor:"#4988C4", listings:"10,000+", focus:"Entry level"    },
  { id:"ngcareers",      name:"NgCareers",              logo:"N",  color:"#091B3A", tagline:"Career Growth in Nigeria",          description:"Nigerian-focused career site with job listings, CV tools and career guidance articles for professionals at all levels.",            url:"https://ngcareers.com/jobs",                                                          category:"Nigeria", type:"General",    badge:null,               badgeColor:null,      listings:"8,000+",  focus:"All levels"     },
  { id:"careersng",      name:"Careers in Nigeria",     logo:"C",  color:"#dc2626", tagline:"Connecting Talent to Opportunity",  description:"Job listings across banking, oil & gas, FMCG, engineering and public sector  with a dedicated graduate trainee section.",        url:"https://www.careersinnigeriaonline.com/",                                             category:"Nigeria", type:"Graduate",   badge:null,               badgeColor:null,      listings:"4,000+",  focus:"Banking / Oil & Gas"},
  { id:"hotnigeriannjobs",name:"Hot Nigerian Jobs",     logo:"H",  color:"#ea580c", tagline:"Daily Fresh Listings",              description:"Aggregates the latest Nigerian job vacancies daily  useful for browsing fresh openings across public and private sectors.",      url:"https://www.hotnigerianjobs.com/",                                                    category:"Nigeria", type:"General",    badge:"Updated Daily",    badgeColor:"#ea580c", listings:"Daily",   focus:"Public & Private"},
  { id:"tekedia",        name:"Tekedia Jobs",           logo:"T",  color:"#f59e0b", tagline:"African Business & Tech Jobs",      description:"Tekedia lists Nigerian and pan-African tech and business roles alongside entrepreneurship resources and market analysis.",        url:"https://www.tekedia.com/jobs/",                                                       category:"Nigeria", type:"Tech",       badge:null,               badgeColor:null,      listings:"2,000+",  focus:"Tech & Business"},
  { id:"linkedin",       name:"LinkedIn Jobs",          logo:"Li", color:"#0077B5", tagline:"Professional Network Jobs",         description:"Apply directly to Nigerian and remote roles with your LinkedIn profile. Filter by remote, hybrid or on-site and set job alerts.", url:"https://www.linkedin.com/jobs/search/?location=Nigeria",                             category:"Remote",  type:"Networking", badge:"Remote Friendly",  badgeColor:"#22c55e", listings:"1M+",     focus:"Global / Nigeria"},
  { id:"indeed",         name:"Indeed Nigeria",         logo:"In", color:"#003A9B", tagline:"Millions of Jobs",                  description:"Search millions of Nigerian and global roles, upload your CV once and apply with one click. Great for salary benchmarking.",       url:"https://ng.indeed.com/jobs",                                                          category:"Global",  type:"General",    badge:null,               badgeColor:null,      listings:"500k+",   focus:"All sectors"    },
  { id:"glassdoor",      name:"Glassdoor",              logo:"G",  color:"#0CAA41", tagline:"Jobs + Company Reviews",            description:"Find roles alongside real employee reviews, interview tips and salary insights so you know what you're walking into.",             url:"https://www.glassdoor.com/Job/nigeria-jobs-SRCH_IL.0,7_IN177.htm",                   category:"Global",  type:"Reviews",    badge:"Company Insights", badgeColor:"#0CAA41", listings:"200k+",   focus:"Salary insights"},
  { id:"remote",         name:"Remote.co",              logo:"R",  color:"#7c3aed", tagline:"100% Remote Jobs",                  description:"Curated remote-only positions across tech, design, marketing and customer support  open to Nigerians with strong internet.",   url:"https://remote.co/remote-jobs/",                                                      category:"Remote",  type:"100% Remote",badge:"Work From Home",   badgeColor:"#7c3aed", listings:"5,000+",  focus:"Tech / Design"  },
  { id:"weworkremotely", name:"We Work Remotely",       logo:"W",  color:"#4f46e5", tagline:"Largest Remote Work Community",     description:"The world's largest remote-work community. Categories include programming, design, DevOps, sales, marketing and more.",           url:"https://weworkremotely.com/",                                                         category:"Remote",  type:"100% Remote",badge:null,               badgeColor:null,      listings:"15,000+", focus:"Tech & Sales"   },
  { id:"andela",         name:"Andela Talent Network",  logo:"A",  color:"#e83e8c", tagline:"Tech Talent for Global Firms",      description:"Andela connects African tech talent with global companies. Apply to their talent network for contract and full-time remote roles.", url:"https://andela.com/talent-network/",                                                  category:"Remote",  type:"Tech",       badge:"Africa-focused",   badgeColor:"#e83e8c", listings:"3,000+",  focus:"Tech only"      },
];

const CATEGORIES = [
  { label:"All Nigeria",  tag:"Nigeria",   icon:MapPin,        color:"#1C4D8D", bg:"#EEF4FF" },
  { label:"Remote Jobs",  tag:"Remote",    icon:Wifi,          color:"#7c3aed", bg:"#F5F3FF" },
  { label:"Graduate",     tag:"Graduate",  icon:GraduationCap, color:"#0CAA41", bg:"#F0FDF4" },
  { label:"Tech Roles",   tag:"Tech",      icon:Code2,         color:"#0077B5", bg:"#EFF8FF" },
  { label:"Banking",      tag:"Banking",   icon:Landmark,      color:"#0F2854", bg:"#F0F4FF" },
  { label:"Top Picks",    tag:"Top",       icon:Star,          color:"#f59e0b", bg:"#FFFBEB" },
  { label:"Hot Today",    tag:"Hot",       icon:Flame,         color:"#ea580c", bg:"#FFF7ED" },
  { label:"Global",       tag:"Global",    icon:Globe,         color:"#4f46e5", bg:"#F0F0FF" },
];

const TIPS = [
  { icon:Zap,          color:"#4988C4", bg:"#f0f6ff", title:"Tailor your CV",        body:"Customise keywords to match each job description  ATS systems filter for exact terms." },
  { icon:TrendingUp,   color:"#16a34a", bg:"#f0fdf4", title:"Benchmark your salary", body:"Visit Market Trends to understand salary ranges before walking into any negotiation." },
  { icon:BookmarkCheck,color:"#0F2854", bg:"#f0f4ff", title:"Bookmark careers",      body:"Save matched careers in Recommendations so you can compare them anytime." },
  { icon:Globe,        color:"#7c3aed", bg:"#faf5ff", title:"Go remote-first",       body:"Remote boards (LinkedIn, WWR, Andela) often pay in USD  widening your earning potential." },
];

function buildSearchUrl(board, targetCareer) {
  if (!targetCareer) return board.url;
  const q = encodeURIComponent(targetCareer);
  const map = {
    jobberman: `https://www.jobberman.com/jobs?q=${q}`,
    myjobmag:  `https://www.myjobmag.com/find-jobs/nigeria?q=${q}`,
    linkedin:  `https://www.linkedin.com/jobs/search/?keywords=${q}&location=Nigeria`,
    indeed:    `https://ng.indeed.com/jobs?q=${q}`,
  };
  return map[board.id] || board.url;
}

// ─── Curated Job Listings ─────────────────────────────────────────────────────
const JOB_LISTINGS = [
  // Technology
  { id:1,  title:"Frontend Engineer",           company:"Flutterwave",        location:"Lagos, Nigeria",  type:"Full-time", salary:"₦400k–700k/mo",  tags:["Technology","Design"],                  skills:["React","TypeScript","CSS"],           searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Frontend+Engineer"}` },
  { id:2,  title:"Backend Engineer",            company:"Paystack",           location:"Lagos, Nigeria",  type:"Full-time", salary:"₦450k–800k/mo",  tags:["Technology"],                           skills:["Node.js","PostgreSQL","Docker"],       searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Backend+Engineer"}` },
  { id:3,  title:"Full-Stack Developer",        company:"Andela",             location:"Remote (Africa)", type:"Remote",    salary:"$3k–5k/mo",      tags:["Technology","Innovation"],              skills:["React","Node.js","MongoDB"],          searchUrl:(q)=>`https://andela.com/talent-network/` },
  { id:4,  title:"DevOps / Cloud Engineer",     company:"Interswitch",        location:"Lagos, Nigeria",  type:"Full-time", salary:"₦500k–900k/mo",  tags:["Technology","Automation"],              skills:["AWS","Kubernetes","CI/CD"],           searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"DevOps"}` },
  { id:5,  title:"Mobile Developer (React Native)", company:"Kuda Bank",      location:"Lagos / Remote",  type:"Hybrid",    salary:"₦400k–750k/mo",  tags:["Technology","Innovation"],              skills:["React Native","TypeScript","API"],    searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Mobile+Developer"}` },
  // Data / AI / Research
  { id:6,  title:"Data Scientist",              company:"MTN Nigeria",        location:"Lagos, Nigeria",  type:"Full-time", salary:"₦500k–900k/mo",  tags:["Data","AI","Research","Mathematics"],   skills:["Python","Machine Learning","SQL"],    searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Data+Scientist"}` },
  { id:7,  title:"Machine Learning Engineer",   company:"Zindi Africa",       location:"Remote",          type:"Remote",    salary:"$2.5k–4.5k/mo",  tags:["AI","Data","Automation"],               skills:["TensorFlow","PyTorch","Python"],      searchUrl:(q)=>`https://weworkremotely.com/remote-jobs/search?term=${q||"Machine+Learning"}` },
  { id:8,  title:"Data Analyst",                company:"Access Bank",        location:"Lagos, Nigeria",  type:"Full-time", salary:"₦350k–600k/mo",  tags:["Data","Finance","Research"],            skills:["Excel","Power BI","SQL"],             searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Data+Analyst"}` },
  { id:9,  title:"AI Research Engineer",        company:"Google (Remote)",    location:"Remote",          type:"Remote",    salary:"$5k–9k/mo",      tags:["AI","Research","Technology"],           skills:["Python","PyTorch","Research"],        searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"AI+Research"}` },
  { id:10, title:"BI & Analytics Engineer",     company:"Dangote Group",      location:"Lagos, Nigeria",  type:"Full-time", salary:"₦400k–700k/mo",  tags:["Data","Business","Research"],           skills:["Power BI","Tableau","Python"],        searchUrl:(q)=>`https://www.myjobmag.com/find-jobs/nigeria?q=${q||"Business+Intelligence"}` },
  // Design
  { id:11, title:"UI/UX Designer",              company:"Kuda Bank",          location:"Lagos / Remote",  type:"Hybrid",    salary:"₦350k–650k/mo",  tags:["Design","Technology","Creativity"],     skills:["Figma","Prototyping","User Research"], searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"UX+Designer"}` },
  { id:12, title:"Product Designer",            company:"Piggytech",          location:"Lagos, Nigeria",  type:"Full-time", salary:"₦300k–550k/mo",  tags:["Design","Creativity","Innovation"],     skills:["Figma","Design Systems","UX"],        searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Product+Designer"}` },
  { id:13, title:"UX Researcher",               company:"Toptal",             location:"Remote",          type:"Remote",    salary:"$3k–6k/mo",      tags:["Design","Research","Creativity"],       skills:["Figma","User Testing","Interviews"],  searchUrl:(q)=>`https://remote.co/remote-jobs/` },
  // Finance
  { id:14, title:"Financial Analyst",           company:"Stanbic IBTC",       location:"Lagos, Nigeria",  type:"Full-time", salary:"₦350k–700k/mo",  tags:["Finance","Mathematics","Research"],     skills:["Excel","Financial Modelling","CFA"],  searchUrl:(q)=>`https://www.careersinnigeriaonline.com/` },
  { id:15, title:"Investment Banking Analyst",  company:"United Capital",     location:"Lagos, Nigeria",  type:"Full-time", salary:"₦400k–800k/mo",  tags:["Finance","Business","Leadership"],      skills:["Valuation","Excel","PowerPoint"],     searchUrl:(q)=>`https://www.myjobmag.com/find-jobs/nigeria?q=${q||"Investment+Banking"}` },
  { id:16, title:"Quantitative Analyst",        company:"ARM Investments",    location:"Lagos, Nigeria",  type:"Full-time", salary:"₦500k–1M/mo",    tags:["Finance","Mathematics","Data"],         skills:["Python","R","Statistics"],           searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Quantitative+Analyst"}` },
  // Business / Management
  { id:17, title:"Product Manager",             company:"Flutterwave",        location:"Lagos / Remote",  type:"Hybrid",    salary:"₦600k–1.1M/mo",  tags:["Business","Leadership","Technology"],  skills:["Roadmapping","Agile","Analytics"],    searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Product+Manager"}` },
  { id:18, title:"Business Development Manager",company:"Bolt Nigeria",       location:"Lagos, Nigeria",  type:"Full-time", salary:"₦400k–750k/mo",  tags:["Business","Leadership"],               skills:["Negotiation","CRM","Strategy"],       searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Business+Development"}` },
  { id:19, title:"Strategy Consultant",         company:"McKinsey Nigeria",   location:"Lagos, Nigeria",  type:"Full-time", salary:"₦700k–1.4M/mo",  tags:["Business","Leadership","Research"],     skills:["Strategy","Excel","Powerpoint"],      searchUrl:(q)=>`https://www.careersinnigeriaonline.com/` },
  // Security
  { id:20, title:"Cybersecurity Analyst",       company:"Guaranty Trust Bank",location:"Lagos, Nigeria",  type:"Full-time", salary:"₦450k–850k/mo",  tags:["Security","Technology"],               skills:["SIEM","Pen Testing","CISSP"],         searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Cybersecurity"}` },
  { id:21, title:"Security Engineer (Remote)",  company:"HackerOne",          location:"Remote",          type:"Remote",    salary:"$4k–7k/mo",      tags:["Security","Technology"],               skills:["Bug Bounty","DevSecOps","Python"],    searchUrl:(q)=>`https://weworkremotely.com/remote-jobs/search?term=${q||"Security+Engineer"}` },
  // Leadership / Engineering Management
  { id:22, title:"Engineering Manager",         company:"Interswitch",        location:"Lagos, Nigeria",  type:"Full-time", salary:"₦800k–1.5M/mo",  tags:["Leadership","Technology"],             skills:["Team Lead","Agile","System Design"],  searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Engineering+Manager"}` },
  { id:23, title:"CTO (Startup)",               company:"YC-backed Startup",  location:"Remote / Lagos",  type:"Full-time", salary:"$5k–10k/mo",     tags:["Leadership","Technology","Innovation"], skills:["Architecture","Leadership","Cloud"],  searchUrl:(q)=>`https://andela.com/talent-network/` },
  // Innovation / Research
  { id:24, title:"Innovation Analyst",          company:"Shell Nigeria",       location:"Lagos, Nigeria",  type:"Full-time", salary:"₦450k–800k/mo",  tags:["Innovation","Research","Technology"],  skills:["Research","Ideation","Project Mgt"],  searchUrl:(q)=>`https://www.careersinnigeriaonline.com/` },
  { id:25, title:"Research Scientist",          company:"African Institute of Mathematical Sciences", location:"Remote / Abuja", type:"Contract", salary:"₦350k–600k/mo", tags:["Research","Mathematics","AI"],        skills:["Statistics","Python","Academic Writing"], searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Research+Scientist"}` },
  // Automation / MLOps
  { id:26, title:"RPA / Automation Developer",  company:"Accenture Nigeria",  location:"Lagos / Remote",  type:"Hybrid",    salary:"₦500k–950k/mo",  tags:["Automation","Technology"],             skills:["UiPath","Python","Process Mining"],   searchUrl:(q)=>`https://www.linkedin.com/jobs/search/?keywords=${q||"Automation+Developer"}` },
  { id:27, title:"MLOps Engineer",              company:"Remote.co",          location:"Remote",          type:"Remote",    salary:"$3.5k–6k/mo",    tags:["Automation","AI","Technology"],         skills:["Docker","Kubernetes","Python"],       searchUrl:(q)=>`https://remote.co/remote-jobs/` },
  // Creativity / Marketing
  { id:28, title:"Digital Marketing Manager",   company:"Jumia Nigeria",      location:"Lagos, Nigeria",  type:"Full-time", salary:"₦300k–550k/mo",  tags:["Creativity","Business","Innovation"],  skills:["SEO","Analytics","Social Media"],     searchUrl:(q)=>`https://www.myjobmag.com/find-jobs/nigeria?q=${q||"Digital+Marketing"}` },
  { id:29, title:"Content Strategist",          company:"We Work Remotely",   location:"Remote",          type:"Remote",    salary:"$2k–3.5k/mo",    tags:["Creativity","Leadership"],             skills:["Writing","SEO","Strategy"],           searchUrl:(q)=>`https://weworkremotely.com/remote-jobs/search?term=${q||"Content+Strategist"}` },
  // Mathematics
  { id:30, title:"Actuarial Analyst",           company:"AIICO Insurance",    location:"Lagos, Nigeria",  type:"Full-time", salary:"₦350k–700k/mo",  tags:["Mathematics","Finance","Research"],    skills:["R","Statistics","Actuarial Science"], searchUrl:(q)=>`https://www.jobberman.com/jobs?q=${q||"Actuarial+Analyst"}` },
];

function scoreListings(listings, targetCareer, interests, skills) {
  const tc   = (targetCareer || "").toLowerCase();
  const iSet = new Set((interests || []).map((i) => i.toLowerCase()));
  const sSet = new Set((skills   || []).map((s) => (s.name || s || "").toLowerCase()));

  return listings
    .map((listing) => {
      let score = 0;
      const titleLower = listing.title.toLowerCase();

      // Target-career title match
      if (tc) {
        if (titleLower.includes(tc)) {
          score += 10;
        } else {
          tc.split(/\s+/).forEach((w) => { if (w.length > 2 && titleLower.includes(w)) score += 3; });
        }
      }
      // Interest tag matches
      listing.tags.forEach((tag) => { if (iSet.has(tag.toLowerCase())) score += 4; });
      // Skill matches
      listing.skills.forEach((sk) => { if (sSet.has(sk.toLowerCase())) score += 2; });

      return { ...listing, score };
    })
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default function JobsPage() {
  const { profile }        = useSelector((s) => s.profile);
  const { recommendation } = useSelector((s) => s.recommendations);

  const [search,    setSearch]    = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const targetCareer = profile?.targetCareer || "";
  const interests    = profile?.interests   || [];
  const profileSkills = profile?.skills     || [];
  const topMatch     = recommendation?.careers?.[0];
  const hasProfile   = !!(targetCareer || interests.length > 0);

  const forYouListings = useMemo(
    () => scoreListings(JOB_LISTINGS, targetCareer, interests, profileSkills).slice(0, 10),
    [targetCareer, interests, profileSkills],
  );

  const filtered = useMemo(() => {
    return JOB_BOARDS.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.focus.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q);
      const matchesTag =
        activeTag === "All" ||
        b.category.toLowerCase().includes(activeTag.toLowerCase()) ||
        b.type.toLowerCase().includes(activeTag.toLowerCase()) ||
        (activeTag === "Top"    && b.badge !== null) ||
        (activeTag === "Hot"    && (b.badge === "Updated Daily" || b.badge === "Most Popular")) ||
        (activeTag === "Global" && (b.category === "Global" || b.category === "Remote"));
      return matchesSearch && matchesTag;
    });
  }, [search, activeTag]);

  const nigeriaBoards = filtered.filter((b) => b.category === "Nigeria");
  const globalBoards  = filtered.filter((b) => b.category !== "Nigeria");

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-slide-up">

      {/* ── HEADER ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "#0F2854", boxShadow: "0 16px 48px rgba(9,27,58,0.3)" }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4988C4 0%, transparent 70%)" }} />
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.12)" }} />
        <div className="relative z-10 px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(189,232,245,0.12)", border: "1px solid rgba(189,232,245,0.18)" }}>
              <Briefcase className="w-5 h-5" style={{ color: "#BDE8F5" }} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">Job Listings</h1>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "rgba(189,232,245,0.65)" }}>
                {targetCareer
                  ? `Showing boards for "${targetCareer}" click any to apply directly`
                  : "Trusted job boards to find and apply for roles in Nigeria and beyond"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="px-4 py-2.5 rounded-xl text-center"
              style={{ background: "rgba(189,232,245,0.1)", border: "1px solid rgba(189,232,245,0.18)" }}>
              <p className="text-xl font-black text-white leading-none">{JOB_BOARDS.length}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(189,232,245,0.6)" }}>boards</p>
            </div>
            <div className="px-4 py-2.5 rounded-xl text-center"
              style={{ background: "rgba(189,232,245,0.1)", border: "1px solid rgba(189,232,245,0.18)" }}>
              <p className="text-xl font-black text-white leading-none">1M+</p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(189,232,245,0.6)" }}>listings</p>
            </div>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: "rgba(189,232,245,0.06)" }} />
      </div>

      {/* ── PERSONALISED BANNER ── */}
      {targetCareer && (
        <div className="rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{ background: "#f0f6ff", border: "1.5px solid #c7ddf7" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#e0edff" }}>
            <File className="w-4 h-4" style={{ color: "#1C4D8D" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold" style={{ color: "#0F2854" }}>
              Your target career:{" "}
              <span style={{ color: "#1C4D8D" }}>{targetCareer}</span>
              {topMatch && (
                <span className="text-gray-400 font-normal">
                  {" "} top AI match: {topMatch.title} ({topMatch.matchScore}%)
                </span>
              )}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              "Search Jobs" buttons are pre-filled with <strong>{targetCareer}</strong> where supported.
            </p>
          </div>
          <a href={`https://www.jobberman.com/jobs?q=${encodeURIComponent(targetCareer)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center w-fit gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: "#1C4D8D" }}>
            Quick Search <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* ── FOR YOU ── */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid #f0f5fb" }}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>
              For You
            </span>
            {forYouListings.length > 0 && (
              <span className="text-[11px] font-semibold text-gray-400">· {forYouListings.length} matched</span>
            )}
          </div>
          {hasProfile && (
            <span className="text-[11px] text-gray-400">
              Based on your interests{targetCareer ? ` & "${targetCareer}"` : ""}
            </span>
          )}
        </div>

        {!hasProfile ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "#f0f4ff" }}>
              <Zap className="w-5 h-5" style={{ color: "#1C4D8D" }} />
            </div>
            <p className="text-sm font-bold mb-1" style={{ color: "#0F2854" }}>
              No personalised listings yet
            </p>
            <p className="text-xs text-gray-400 mb-3 max-w-xs">
              Add a target career and select interests in your Profile to see jobs matched just for you.
            </p>
            <a href="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#0F2854" }}>
              Update Profile <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : forYouListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <p className="text-sm font-bold mb-1" style={{ color: "#0F2854" }}>No exact matches yet</p>
            <p className="text-xs text-gray-400">
              Try adding more interests or skills to your profile for better job matches.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
            {forYouListings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} targetCareer={targetCareer} />
            ))}
          </div>
        )}
      </div>

      {/* ── BROWSE BY CATEGORY (Sundays-style grid) ── */}
      <div className="bg-white rounded-2xl p-5"
        style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <p className="text-[13px] font-bold mb-3" style={{ color: "#0F2854" }}>Browse by Category</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          <button
            onClick={() => setActiveTag("All")}
            className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-[11px] font-bold transition-all hover:scale-[1.03]"
            style={activeTag === "All"
              ? { background: "#0F2854", color: "#fff" }
              : { background: "#f3f7fc", color: "#6b7280", border: "1px solid #e5edf6" }}>
            <Briefcase className="w-4 h-4" />
            All
          </button>
          {CATEGORIES.map(({ label, tag, icon: Icon, color, bg }) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? "All" : tag)}
              className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-[11px] font-bold transition-all hover:scale-[1.03]"
              style={activeTag === tag
                ? { background: color, color: "#fff" }
                : { background: bg, color, border: `1px solid ${bg}` }}>
              <Icon className="w-4 h-4" />
              <span className="text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] rounded-xl px-3.5 h-10 bg-white"
          style={{ border: "1.5px solid #e5edf6" }}>
          <Search className="w-4 h-4 flex-shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search boards..."
            className="flex-1 bg-transparent outline-none text-[13px] font-medium placeholder-gray-400"
            style={{ color: "#0F2854" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="hover:opacity-70">
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 px-3.5 h-10 rounded-xl text-[13px] font-semibold bg-white transition-colors hover:bg-gray-50"
          style={{ border: "1.5px solid #e5edf6", color: "#374151" }}>
          <SlidersHorizontal className="w-4 h-4" /> Filter
        </button>
        <button className="flex items-center gap-2 px-3.5 h-10 rounded-xl text-[13px] font-semibold bg-white transition-colors hover:bg-gray-50"
          style={{ border: "1.5px solid #e5edf6", color: "#374151" }}>
          <ArrowUpDown className="w-4 h-4" /> Sort
        </button>
        <span className="ml-auto text-[12px] text-gray-400 font-medium hidden sm:block">
          {filtered.length} board{filtered.length !== 1 ? "s" : ""}
        </span>
        {activeTag !== "All" && (
          <button onClick={() => setActiveTag("All")}
            className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
            style={{ background: "#0F2854" }}>
            {activeTag} <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ── BOARD LIST ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "#f0f5ff" }}>
            <Briefcase className="w-6 h-6" style={{ color: "#4988C4" }} />
          </div>
          <p className="text-sm font-bold" style={{ color: "#0F2854" }}>No boards match</p>
          <p className="text-xs text-gray-400 mt-1">Try a different category or clear the search</p>
          <button onClick={() => { setSearch(""); setActiveTag("All"); }}
            className="mt-3 text-xs font-semibold hover:underline" style={{ color: "#1C4D8D" }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {nigeriaBoards.length > 0 && (
            <BoardSection title="Nigeria Job Boards" boards={nigeriaBoards} targetCareer={targetCareer} />
          )}
          {globalBoards.length > 0 && (
            <BoardSection title="Global & Remote Boards" boards={globalBoards} targetCareer={targetCareer} />
          )}
        </div>
      )}

      {/* ── TIPS ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(15,40,84,0.08)" }}>
            <Zap className="w-3.5 h-3.5" style={{ color: "#0F2854" }} />
          </div>
          <h2 className="text-[15px] font-black" style={{ color: "#0F2854" }}>Application Tips</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TIPS.map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} className="rounded-2xl p-4 bg-white"
              style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-[13px] font-bold mb-1" style={{ color: "#0F2854" }}>{title}</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Listing Row ─────────────────────────────────────────────────────────────
function ListingRow({ listing, targetCareer }) {
  const q   = targetCareer ? encodeURIComponent(targetCareer) : "";
  const url = listing.searchUrl(q);
  const isRemote = listing.type === "Remote";

  return (
    <div className="group flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-blue-50/25 transition-colors">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[13px] text-white"
        style={{ background: "#1C4D8D" }}>
        {listing.company[0]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13.5px] font-bold leading-tight" style={{ color: "#0F2854" }}>
            {listing.title}
          </p>
          {isRemote && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg text-violet-700 bg-violet-50 flex-shrink-0">
              Remote
            </span>
          )}
        </div>
        <p className="text-[12px] text-gray-500 mt-0.5">
          {listing.company} · {listing.location}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {listing.skills.map((sk) => (
            <span key={sk} className="text-[11px] font-medium px-2 py-0.5 rounded-md"
              style={{ background: "#f0f4ff", color: "#1C4D8D" }}>
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Salary + Apply */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-[12px] font-black hidden sm:block" style={{ color: "#0F2854" }}>
          {listing.salary}
        </span>
        <span className="text-[11px] text-gray-400 hidden sm:block capitalize">{listing.type}</span>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#0F2854" }}>
          Apply <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ─── Board Section ────────────────────────────────────────────────────────────
function BoardSection({ title, boards, targetCareer }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid #f0f5fb" }}>
        <span className="text-[11px] font-black uppercase tracking-widest"
          style={{ color: "#9ca3af" }}>{title}</span>
        <span className="text-[11px] font-semibold text-gray-400">{boards.length} boards</span>
      </div>
      <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
        {boards.map((board) => (
          <BoardRow key={board.id} board={board} targetCareer={targetCareer} />
        ))}
      </div>
    </div>
  );
}

// ─── Board Row ────────────────────────────────────────────────────────────────
function BoardRow({ board, targetCareer }) {
  const searchUrl = buildSearchUrl(board, targetCareer);
  return (
    <div className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-blue-50/30 transition-colors">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-[13px] flex-shrink-0"
        style={{ background: board.color }}>
        {board.logo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[13.5px] font-bold leading-tight" style={{ color: "#0F2854" }}>{board.name}</p>
          {board.badge && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg text-white flex-shrink-0"
              style={{ background: board.badgeColor }}>
              {board.badge}
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-gray-400 mt-0.5 truncate">{board.tagline}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-lg"
          style={{ background: "#f0f5ff", color: "#1C4D8D" }}>
          {board.focus}
        </span>
        <span className="text-[11px] text-gray-400 w-16 text-right">{board.listings}</span>
      </div>
      <span className={`hidden md:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
        board.category === "Nigeria" ? "text-blue-700 bg-blue-50"
        : board.category === "Remote" ? "text-violet-700 bg-violet-50"
        : "text-gray-600 bg-gray-100"
      }`}>
        {board.category}
      </span>
      <a href={searchUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold text-white flex-shrink-0 transition-all hover:opacity-90 hover:scale-[1.03]"
        style={{ background: board.color }}>
        <span className="hidden sm:inline">{targetCareer ? "Search Jobs" : "Browse"}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
      {targetCareer && searchUrl !== board.url && (
        <a href={board.url} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 flex-shrink-0"
          style={{ border: "1px solid #e5edf6", color: "#9ca3af" }}
          title="All listings">
          <Globe className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
