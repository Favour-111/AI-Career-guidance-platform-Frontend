import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  saveProfile,
  updateSkills,
} from "../store/slices/profileSlice";
import { generateRecommendations } from "../store/slices/recommendationSlice";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Save,
  User,
  MapPin,
  Link2,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Zap,
  Star,
  Target,
  Phone,
  ChevronRight,
  Award,
} from "lucide-react";

const SKILL_CATEGORIES = ["technical", "soft", "language", "tool", "other"];
const FIELD_OPTIONS = [
  "",
  "Technology",
  "Medical & Health",
  "Finance & Economics",
  "Arts & Humanities",
  "Engineering",
  "Business & Management",
  "Law",
  "Education",
  "Science & Research",
  "Other",
];
const INTEREST_SUGGESTIONS = [
  "Technology",
  "Data",
  "AI",
  "Design",
  "Business",
  "Security",
  "Research",
  "Mathematics",
  "Leadership",
  "Finance",
  "Creativity",
  "Innovation",
  "Automation",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i);

const EMPTY_EDU = {
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  current: false,
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { profile, loading, saving } = useSelector((s) => s.profile);

  const [activeTab, setActiveTab] = useState("basic");
  const [form, setForm] = useState({
    bio: "",
    location: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
    targetCareer: "",
    careerGoals: "",
    fieldOfStudy: "",
    interests: [],
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 5,
    category: "technical",
  });
  const [education, setEducation] = useState([]);
  const [newEdu, setNewEdu] = useState(EMPTY_EDU);
  const [showEduForm, setShowEduForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio || "",
        location: profile.location || "",
        phone: profile.phone || "",
        website: profile.website || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        targetCareer: profile.targetCareer || "",
        careerGoals: profile.careerGoals || "",
        fieldOfStudy: profile.fieldOfStudy || "",
        interests: profile.interests || [],
      });
      setSkills(profile.skills || []);
      setEducation(profile.education || []);
    }
  }, [profile]);

  const handleSaveBasic = async () => {
    const sanitizedEducation = education.map((edu) => ({
      ...edu,
      startYear:
        edu.startYear !== "" && edu.startYear != null
          ? parseInt(edu.startYear, 10)
          : undefined,
      endYear:
        edu.endYear !== "" && edu.endYear != null
          ? parseInt(edu.endYear, 10)
          : undefined,
    }));
    const result = await dispatch(
      saveProfile({ ...form, education: sanitizedEducation }),
    );
    if (saveProfile.fulfilled.match(result)) {
      toast.success("Profile saved successfully!");
      // Always regenerate recommendations when profile is saved
      dispatch(generateRecommendations()).then((res) => {
        if (generateRecommendations.fulfilled.match(res)) {
          toast.success("Recommendations updated!", { id: "regen" });
        }
      });
    } else {
      toast.error("Failed to save profile");
    }
  };

  const handleSaveEducation = async () => {
    let eduList = [...education];

    // If the add-form is open and has data, commit it automatically before saving
    if (showEduForm && newEdu.institution.trim()) {
      if (!newEdu.degree.trim()) {
        toast.error("Degree is required");
        return;
      }
      const entry = {
        ...newEdu,
        startYear:
          newEdu.startYear !== "" ? parseInt(newEdu.startYear, 10) : undefined,
        endYear:
          newEdu.endYear !== "" ? parseInt(newEdu.endYear, 10) : undefined,
      };
      eduList = [...education, entry];
      setEducation(eduList);
      setNewEdu(EMPTY_EDU);
      setShowEduForm(false);
    }

    // Sanitize years to integers so Mongoose Number fields accept them
    const sanitizedEducation = eduList.map((edu) => ({
      ...edu,
      startYear:
        edu.startYear !== "" && edu.startYear != null
          ? parseInt(edu.startYear, 10)
          : undefined,
      endYear:
        edu.endYear !== "" && edu.endYear != null
          ? parseInt(edu.endYear, 10)
          : undefined,
    }));
    const result = await dispatch(
      saveProfile({ ...form, education: sanitizedEducation }),
    );
    if (saveProfile.fulfilled.match(result)) {
      toast.success("Education saved!");
    } else {
      toast.error("Failed to save education");
    }
  };

  const handleAddEducation = () => {
    if (!newEdu.institution.trim()) {
      toast.error("Institution is required");
      return;
    }
    if (!newEdu.degree.trim()) {
      toast.error("Degree is required");
      return;
    }
    // Convert year strings to integers so Mongoose Number fields don't throw a CastError
    const entry = {
      ...newEdu,
      startYear:
        newEdu.startYear !== "" ? parseInt(newEdu.startYear, 10) : undefined,
      endYear: newEdu.endYear !== "" ? parseInt(newEdu.endYear, 10) : undefined,
    };
    setEducation([...education, entry]);
    setNewEdu(EMPTY_EDU);
    setShowEduForm(false);
  };

  const handleRemoveEducation = (idx) =>
    setEducation(education.filter((_, i) => i !== idx));

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    if (
      skills.some((s) => s.name.toLowerCase() === newSkill.name.toLowerCase())
    ) {
      toast.error("Skill already added");
      return;
    }
    const nextSkills = [...skills, { ...newSkill, name: newSkill.name.trim() }];
    setSkills(nextSkills);
    setNewSkill({ name: "", level: 5, category: "technical" });
    dispatch(updateSkills(nextSkills))
      .unwrap()
      .then(() => {
        toast.success("Skill added!");
      })
      .catch((error) => {
        toast.error(error || "Failed to save skill");
      });
  };

  const handleRemoveSkill = (name) => {
    const nextSkills = skills.filter((s) => s.name !== name);
    setSkills(nextSkills);
    dispatch(updateSkills(nextSkills))
      .unwrap()
      .then(() => {
        toast.success("Skill removed!");
      })
      .catch((error) => {
        toast.error(error || "Failed to remove skill");
      });
  };
  const handleSkillLevel = (name, level) =>
    setSkills(
      skills.map((s) =>
        s.name === name ? { ...s, level: parseInt(level) } : s,
      ),
    );

  const handleSaveSkills = async () => {
    const result = await dispatch(updateSkills(skills));
    if (updateSkills.fulfilled.match(result)) {
      toast.success("Skills updated!");
      // Do NOT regenerate recommendations here  save profile (About tab) triggers it.
      // Triggering here as well burns through the rate limit quickly.
    } else {
      toast.error("Failed to update skills");
    }
  };

  const toggleInterest = (interest) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));

  // Completion fields mirroring the server model
  const completionFields = [
    { label: "Bio", done: !!form.bio },
    { label: "Location", done: !!form.location },
    { label: "Skills", done: skills.length > 0 },
    { label: "Interests", done: form.interests.length > 0 },
    { label: "Education", done: education.length > 0 },
    { label: "Target Career", done: !!form.targetCareer },
    { label: "Career Goals", done: !!form.careerGoals },
    { label: "Field of Study", done: !!form.fieldOfStudy },
  ];
  // Use the server-persisted value for the displayed percentage
  const completion = profile?.completionPercentage ?? 0;



  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "skills", label: "Skills", icon: GraduationCap },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "interests", label: "Interests & Goals", icon: Briefcase },
  ];

  if (loading)
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        {/* Title row skeleton */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <div className="h-6 w-32 rounded-lg bg-gray-200" />
            <div className="h-3 w-56 rounded-md bg-gray-100" />
          </div>
          <div className="h-9 w-32 rounded-xl bg-gray-200" />
        </div>

        {/* Two-column layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">
          {/* Left sidebar skeleton */}
          <div className="space-y-4">
            {/* Profile card */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa" }}>
              <div className="h-20 rounded-t-2xl" style={{ background: "#e2e8f0" }} />
              <div className="px-5 pb-5">
                <div className="-mt-8 mb-3">
                  <div className="w-16 h-16 rounded-2xl ring-4 ring-white" style={{ background: "#cbd5e1" }} />
                </div>
                <div className="h-4 w-28 rounded-md bg-gray-200 mb-1.5" />
                <div className="h-3 w-36 rounded-md bg-gray-100 mb-2" />
                <div className="h-3 w-20 rounded-md bg-gray-100" />
              </div>
            </div>
            {/* Completion card */}
            <div className="rounded-2xl p-4" style={{ background: "#f0f4ff", border: "1.5px solid #d6e4ff" }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full flex-shrink-0" style={{ background: "#d6e4ff" }} />
                <div className="space-y-2">
                  <div className="h-3.5 w-24 rounded-md bg-blue-200" />
                  <div className="h-3 w-20 rounded-md bg-blue-100" />
                </div>
              </div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 bg-blue-100" />
                    <div className="h-3 rounded-md bg-blue-100" style={{ width: `${55 + i * 8}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel skeleton */}
          <div className="rounded-2xl bg-white" style={{ border: "1px solid #eef3fa" }}>
            {/* Tab bar */}
            <div className="flex gap-1 p-3 border-b" style={{ borderColor: "#f7fafd" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 rounded-xl bg-gray-100" style={{ width: i === 0 ? 90 : 80 }} />
              ))}
            </div>
            {/* Form fields */}
            <div className="p-6 space-y-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 rounded-md bg-gray-100" />
                  <div className="h-10 w-full rounded-xl bg-gray-100" />
                </div>
              ))}
              <div className="space-y-1.5">
                <div className="h-3 w-16 rounded-md bg-gray-100" />
                <div className="h-24 w-full rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const doneCount = completionFields.filter((f) => f.done).length;

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">

      {/* ── PAGE TITLE ROW (Sundays-style) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-black" style={{ color: "#0F2854" }}>My Profile</h1>
          <p className="text-xs text-gray-400 mt-0.5">Keep your profile up to date for better AI career matches</p>
        </div>
        <Button onClick={activeTab === "skills" ? handleSaveSkills : activeTab === "education" ? handleSaveEducation : handleSaveBasic} loading={saving}>
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">

        {/* ── LEFT SIDEBAR ── */}
        <div className="space-y-4">

          {/* Profile card */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {/* Dark banner */}
            <div className="relative h-20" style={{ background: "#0F2854" }}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #4988C4 0%, transparent 70%)" }} />
            </div>
            {/* Avatar overlapping banner */}
            <div className="px-5 pb-5">
              <div className="flex items-end justify-between -mt-8 mb-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white ring-4 ring-white"
                    style={{ background: "#1C4D8D" }}>
                    {initials}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                    style={{ background: "#22c55e" }} />
                </div>
                {user?.role === "admin" && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1"
                    style={{ background: "rgba(15,40,84,0.08)", color: "#0F2854" }}>
                    Admin
                  </span>
                )}
              </div>
              <p className="font-black text-[15px] leading-tight" style={{ color: "#0F2854" }}>{user?.name}</p>
              <p className="text-[12px] text-gray-400 mt-0.5 truncate">{user?.email}</p>
              {form.location && (
                <p className="flex items-center gap-1 text-[11.5px] text-gray-400 mt-1.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> {form.location}
                </p>
              )}
              {form.targetCareer && (
                <p className="flex items-center gap-1 text-[11.5px] mt-1" style={{ color: "#1C4D8D" }}>
                  <Target className="w-3 h-3 flex-shrink-0" /> {form.targetCareer}
                </p>
              )}
            </div>
          </div>

          {/* Completion card (like Sundays "Upgrade your plan") */}
          <div className="rounded-2xl p-4" style={{ background: "#f0f4ff", border: "1.5px solid #d6e4ff" }}>
            {/* Ring + % */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(15,40,84,0.08)" strokeWidth="5" />
                  <circle cx="28" cy="28" r="23" fill="none" stroke="url(#sideRing)" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 23}`}
                    strokeDashoffset={`${2 * Math.PI * 23 * (1 - completion / 100)}`}
                    className="transition-all duration-1000" />
                  <defs>
                    <linearGradient id="sideRing" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1C4D8D" />
                      <stop offset="100%" stopColor="#4988C4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black leading-none" style={{ color: "#0F2854" }}>{completion}%</span>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-black" style={{ color: "#0F2854" }}>Profile complete</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{doneCount} of {completionFields.length} sections done</p>
              </div>
            </div>
            {/* Checklist */}
            <div className="space-y-1.5">
              {completionFields.map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? "rgba(34,197,94,0.15)" : "rgba(0,0,0,0.06)" }}>
                    <CheckCircle2 className="w-2.5 h-2.5"
                      style={{ color: done ? "#16a34a" : "#d1d5db" }} />
                  </span>
                  <span className="text-[12px] font-medium"
                    style={{ color: done ? "#374151" : "#9ca3af" }}>
                    {label}
                  </span>
                  {!done && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: "rgba(15,40,84,0.08)", color: "#6b7280" }}>
                      missing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>Overview</span>
            </div>
            {[
              { label: "Skills",    value: skills.length,         icon: Star },
              { label: "Education", value: education.length,      icon: GraduationCap },
              { label: "Interests", value: form.interests.length, icon: Briefcase },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                style={{ borderBottom: "1px solid #f7fafd" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0f4ff" }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: "#1C4D8D" }} />
                </div>
                <span className="flex-1 text-[13px] text-gray-600 font-medium">{label}</span>
                <span className="text-[13px] font-black" style={{ color: "#0F2854" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: TAB CONTENT ── */}
        <div className="space-y-4 min-w-0">

          {/* Sundays-style toolbar / tab bar */}
          <div className="bg-white rounded-2xl px-3 py-2.5 flex flex-wrap items-center gap-2"
            style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={activeTab === id
                  ? { background: "#0F2854", color: "#fff" }
                  : { color: "#6b7280", background: "transparent" }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
            <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[12px] text-gray-400">
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{tabs.find((t) => t.id === activeTab)?.label}</span>
            </div>
          </div>

          {/* ── BASIC INFO ── */}
          {activeTab === "basic" && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              {/* Section: About */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>About</span>
              </div>
              <div className="p-5 space-y-4" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <div>
                  <label className="input-label">Bio</label>
                  <textarea rows={3} placeholder="Tell us about yourself..." className="input-field resize-none"
                    value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} />
                  <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/500</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Target Career" icon={Target} placeholder="e.g. Data Scientist"
                    value={form.targetCareer} onChange={(e) => setForm({ ...form, targetCareer: e.target.value })} />
                  <div>
                    <label className="input-label">Field of Study</label>
                    <select className="input-field" value={form.fieldOfStudy}
                      onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}>
                      {FIELD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt === "" ? " Select your field " : opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Section: Contact */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>Contact</span>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <Input label="Location" icon={MapPin} placeholder="City, Country"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <Input label="Phone" icon={Phone} placeholder="+1 555 000 0000"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              {/* Section: Links */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>Links</span>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <Input label="Website" icon={Link2} placeholder="https://yoursite.com"
                  value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                <Input label="LinkedIn" icon={Linkedin} placeholder="linkedin.com/in/username"
                  value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                <Input label="GitHub" icon={Github} placeholder="github.com/username"
                  value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              </div>
            </div>
          )}

          {/* ── SKILLS ── */}
          {activeTab === "skills" && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              {/* Add skill toolbar */}
              <div className="flex flex-wrap items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest flex-1" style={{ color: "#9ca3af" }}>
                  Skills <span className="text-gray-300">·</span> {skills.length} added
                </span>
              </div>
              {/* Add form inline */}
              <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ borderBottom: "1px solid #f0f5fb", background: "#fafbff" }}>
                <div className="col-span-2">
                  <Input placeholder="Skill name (e.g. Python)" value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()} />
                </div>
                <select className="input-field" value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}>
                  {SKILL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input type="number" min="1" max="10" placeholder="Level" className="input-field flex-1"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 5 })} />
                  <button onClick={handleAddSkill}
                    className="px-3 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: "#0F2854" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Skill rows */}
              {skills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "#f0f4ff" }}>
                    <Award className="w-6 h-6" style={{ color: "#1C4D8D" }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">No skills yet</p>
                  <p className="text-xs text-gray-400">Add your first skill using the form above</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
                  {skills.map((skill) => (
                    <div key={skill.name} className="group flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50/20 transition-colors">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm text-white"
                        style={{ background: "#1C4D8D" }}>
                        {skill.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold" style={{ color: "#0F2854" }}>{skill.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide"
                            style={{ background: "#f0f4ff", color: "#1C4D8D" }}>
                            {skill.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <input type="range" min="1" max="10" value={skill.level}
                            onChange={(e) => handleSkillLevel(skill.name, e.target.value)}
                            className="flex-1 h-1.5 accent-primary" />
                          <span className="text-[11px] font-bold w-8 text-right flex-shrink-0" style={{ color: "#4988C4" }}>
                            {skill.level}/10
                          </span>
                        </div>
                        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "#eef3fa" }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${skill.level * 10}%`, background: "#4988C4" }} />
                        </div>
                      </div>
                      <button onClick={() => handleRemoveSkill(skill.name)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {skills.length > 0 && (
                <div className="px-5 py-3.5" style={{ borderTop: "1px solid #f0f5fb" }}>
                  <Button onClick={handleSaveSkills} loading={saving}>
                    <Save className="w-4 h-4" /> Save Skills ({skills.length})
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── EDUCATION ── */}
          {activeTab === "education" && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                  Education · {education.length} entr{education.length !== 1 ? "ies" : "y"}
                </span>
                <button onClick={() => setShowEduForm((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all"
                  style={showEduForm
                    ? { background: "rgba(239,68,68,0.08)", color: "#ef4444" }
                    : { background: "#0F2854", color: "#fff" }}>
                  {showEduForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {showEduForm ? "Cancel" : "Add Entry"}
                </button>
              </div>

              {showEduForm && (
                <div className="p-5 space-y-4" style={{ borderBottom: "1px solid #f0f5fb", background: "#fafbff" }}>
                  <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>New Entry</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Institution" placeholder="University / College name"
                      value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} />
                    <Input label="Degree" placeholder="e.g. Bachelor of Science"
                      value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} />
                    <Input label="Field of Study" placeholder="e.g. Computer Science"
                      value={newEdu.field} onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="input-label">Start Year</label>
                        <select className="input-field" value={newEdu.startYear}
                          onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}>
                          <option value="">Year</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="input-label">End Year</label>
                        <select className="input-field" value={newEdu.current ? "" : newEdu.endYear}
                          onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value, current: false })}
                          disabled={newEdu.current}>
                          <option value="">Year</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
                    <input type="checkbox" checked={newEdu.current}
                      onChange={(e) => setNewEdu({ ...newEdu, current: e.target.checked, endYear: "" })}
                      className="accent-primary w-4 h-4" />
                    Currently enrolled
                  </label>
                  <Button onClick={handleAddEducation}><Plus className="w-4 h-4" /> Add Entry</Button>
                </div>
              )}

              {education.length === 0 && !showEduForm ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "#f0f4ff" }}>
                    <GraduationCap className="w-6 h-6" style={{ color: "#1C4D8D" }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">No education entries</p>
                  <p className="text-xs text-gray-400">Click "Add Entry" to get started</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#f7fafd" }}>
                  {education.map((edu, idx) => (
                    <div key={idx} className="group flex items-start gap-4 px-5 py-4 hover:bg-blue-50/20 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#1C4D8D" }}>
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-bold leading-tight" style={{ color: "#0F2854" }}>{edu.institution}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{edu.degree}{edu.field ? ` · ${edu.field}` : ""}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                            style={{ background: "#f0f4ff", color: "#1C4D8D" }}>
                            {edu.startYear || "?"}  {edu.current ? "Present" : edu.endYear || "?"}
                          </span>
                          {edu.current && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                              style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleRemoveEducation(idx)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-5 py-3.5" style={{ borderTop: "1px solid #f0f5fb" }}>
                <Button onClick={handleSaveEducation} loading={saving}>
                  <Save className="w-4 h-4" /> Save Education
                </Button>
              </div>
            </div>
          )}

          {/* ── INTERESTS & GOALS ── */}
          {activeTab === "interests" && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #eef3fa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              {/* Interests */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                  Career Interests · {form.interests.length} selected
                </span>
              </div>
              <div className="p-5" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <p className="text-xs text-gray-400 mb-3">Select all that apply  used to improve your AI recommendations</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_SUGGESTIONS.map((interest) => {
                    const selected = form.interests.includes(interest);
                    return (
                      <button key={interest} onClick={() => toggleInterest(interest)}
                        className="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
                        style={selected
                          ? { background: "#0F2854", color: "white" }
                          : { background: "#f3f7fc", color: "#374151", border: "1px solid #e5edf6" }}>
                        {selected && <span className="mr-1">✓</span>}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Career Goals */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #f0f5fb" }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9ca3af" }}>Career Goals</span>
              </div>
              <div className="p-5">
                <textarea rows={4}
                  placeholder="Describe your career goals and where you see yourself in 5 years..."
                  className="input-field resize-none"
                  value={form.careerGoals}
                  onChange={(e) => setForm({ ...form, careerGoals: e.target.value })}
                  maxLength={1000} />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.careerGoals.length}/1000</p>
                {skills.length > 0 && (
                  <div className="flex items-start gap-2.5 mt-3 p-3.5 rounded-xl"
                    style={{ background: "#f0f4ff", border: "1px solid #dde8ff" }}>
                    <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#1C4D8D" }} />
                    <p className="text-[12px] text-gray-600">
                      Saving will automatically regenerate your AI career recommendations based on your updated interests.
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <Button onClick={handleSaveBasic} loading={saving}>
                    <Save className="w-4 h-4" /> Save Interests & Goals
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>{/* end right col */}
      </div>{/* end grid */}
    </div>
  );
}
