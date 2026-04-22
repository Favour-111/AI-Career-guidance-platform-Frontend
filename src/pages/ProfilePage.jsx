import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  saveProfile,
  updateSkills,
  setCompletionPercentage,
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
      // Auto-regenerate recommendations whenever profile changes
      if (skills.length > 0) {
        dispatch(generateRecommendations()).then((res) => {
          if (generateRecommendations.fulfilled.match(res)) {
            toast.success("AI recommendations updated!", { id: "regen" });
          }
        });
      }
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
  const localCompletion = Math.round(
    (completionFields.filter((f) => f.done).length / completionFields.length) *
      100,
  );

  // Keep sidebar and dashboard in sync with the live profile score
  useEffect(() => {
    dispatch(setCompletionPercentage(localCompletion));
  }, [dispatch, localCompletion]);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "skills", label: "Skills", icon: GraduationCap },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "interests", label: "Interests & Goals", icon: Briefcase },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* ── HERO HEADER ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #091B3A 0%, #0F2854 45%, #1C4D8D 100%)",
          boxShadow: "0 20px 60px rgba(9,27,58,0.4)",
        }}
      >
        {/* Ambient blobs */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #4988C4 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-12 left-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #BDE8F5 0%, transparent 70%)",
          }}
        />

        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(189,232,245,0.4), transparent)",
          }}
        />

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #4988C4 0%, #1C4D8D 100%)",
                  boxShadow:
                    "0 0 0 3px rgba(189,232,245,0.2), 0 8px 24px rgba(73,136,196,0.4)",
                }}
              >
                {initials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{ background: "#22c55e", borderColor: "#091B3A" }}
              />
            </div>

            {/* Name / email / badges */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {user?.name}
                </h1>
                {user?.role === "admin" && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{
                      background: "rgba(73,136,196,0.3)",
                      color: "#BDE8F5",
                    }}
                  >
                    Admin
                  </span>
                )}
              </div>
              <p
                className="text-sm mb-3"
                style={{ color: "rgba(189,232,245,0.55)" }}
              >
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-2">
                {form.location && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                    style={{
                      background: "rgba(189,232,245,0.1)",
                      color: "rgba(189,232,245,0.7)",
                    }}
                  >
                    <MapPin className="w-3 h-3" />
                    {form.location}
                  </span>
                )}
                {form.fieldOfStudy && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                    style={{
                      background: "rgba(73,136,196,0.2)",
                      color: "#BDE8F5",
                    }}
                  >
                    <BookOpen className="w-3 h-3" />
                    {form.fieldOfStudy}
                  </span>
                )}
                {form.targetCareer && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                    style={{
                      background: "rgba(189,232,245,0.08)",
                      color: "rgba(189,232,245,0.65)",
                    }}
                  >
                    <Target className="w-3 h-3" />
                    {form.targetCareer}
                  </span>
                )}
              </div>
            </div>

            {/* Completion ring */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-25"
                  style={{
                    background: "radial-gradient(circle, #4988C4, transparent)",
                  }}
                />
                <svg
                  className="relative w-24 h-24 -rotate-90"
                  viewBox="0 0 96 96"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="url(#profileRing)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - localCompletion / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient
                      id="profileRing"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#BDE8F5" />
                      <stop offset="100%" stopColor="#4988C4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white leading-none">
                    {localCompletion}%
                  </span>
                  <span
                    className="text-[10px] mt-0.5"
                    style={{ color: "rgba(189,232,245,0.5)" }}
                  >
                    complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Completion checklist */}
          <div
            className="mt-6 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-2"
            style={{ borderTop: "1px solid rgba(189,232,245,0.1)" }}
          >
            {completionFields.map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: done
                      ? "rgba(34,197,94,0.25)"
                      : "rgba(255,255,255,0.07)",
                  }}
                >
                  <CheckCircle2
                    className="w-3 h-3"
                    style={{
                      color: done ? "#4ade80" : "rgba(189,232,245,0.25)",
                    }}
                  />
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: done
                      ? "rgba(189,232,245,0.8)"
                      : "rgba(189,232,245,0.3)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(189,232,245,0.12), transparent)",
          }}
        />
      </div>

      {/* ── TABS ── */}
      <div
        className="flex gap-1 p-1.5 rounded-2xl shadow-sm border"
        style={{ background: "white", borderColor: "rgba(0,0,0,0.06)" }}
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap px-3"
            style={
              activeTab === id
                ? {
                    background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(15,40,84,0.3)",
                  }
                : { color: "#6b7280" }
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* ── BASIC INFO TAB ── */}
      {activeTab === "basic" && (
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6 bg-white shadow-sm border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center gap-3 pb-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
              }}
            >
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Basic Information
              </h3>
              <p className="text-xs text-gray-400">
                Your personal details and contact info
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="input-label">Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself..."
                className="input-field resize-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {form.bio.length}/500
              </p>
            </div>
            <Input
              label="Location"
              icon={MapPin}
              placeholder="City, Country"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Input
              label="Phone"
              icon={Phone}
              placeholder="+1 555 000 0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Website"
              icon={Link2}
              placeholder="https://yoursite.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <Input
              label="LinkedIn"
              icon={Linkedin}
              placeholder="linkedin.com/in/username"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
            <Input
              label="GitHub"
              icon={Github}
              placeholder="github.com/username"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
            <Input
              label="Target Career"
              icon={Target}
              placeholder="e.g. Data Scientist"
              value={form.targetCareer}
              onChange={(e) =>
                setForm({ ...form, targetCareer: e.target.value })
              }
            />
            <div>
              <label className="input-label">Field of Study</label>
              <select
                className="input-field"
                value={form.fieldOfStudy}
                onChange={(e) =>
                  setForm({ ...form, fieldOfStudy: e.target.value })
                }
              >
                {FIELD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "" ? "— Select your field —" : opt}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Helps our AI tailor recommendations to your discipline.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleSaveBasic} loading={saving}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* ── SKILLS TAB ── */}
      {activeTab === "skills" && (
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6 bg-white shadow-sm border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center gap-3 pb-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
              }}
            >
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Skills</h3>
              <p className="text-xs text-gray-400">
                {skills.length} skill{skills.length !== 1 ? "s" : ""} added
              </p>
            </div>
          </div>

          {/* Add skill form */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              background: "rgba(15,40,84,0.03)",
              border: "1px dashed rgba(15,40,84,0.15)",
            }}
          >
            <p className="text-sm font-semibold text-gray-700">Add New Skill</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <Input
                  placeholder="Skill name (e.g. Python)"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
              </div>
              <select
                className="input-field"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Level"
                  className="input-field flex-1"
                  value={newSkill.level}
                  onChange={(e) =>
                    setNewSkill({
                      ...newSkill,
                      level: parseInt(e.target.value) || 5,
                    })
                  }
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 rounded-xl text-white transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(15,40,84,0.06)" }}
              >
                <Award className="w-7 h-7" style={{ color: "#1C4D8D" }} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No skills yet
              </p>
              <p className="text-xs text-gray-400">
                Add your first skill using the form above
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-sm group"
                  style={{
                    background: "rgba(15,40,84,0.03)",
                    border: "1px solid rgba(15,40,84,0.07)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm text-white"
                    style={{
                      background: "linear-gradient(135deg, #1C4D8D, #4988C4)",
                    }}
                  >
                    {skill.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-gray-900">
                        {skill.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide"
                        style={{
                          background: "rgba(28,77,141,0.1)",
                          color: "#1C4D8D",
                        }}
                      >
                        {skill.category}
                      </span>
                      <span
                        className="ml-auto text-xs font-bold"
                        style={{ color: "#1C4D8D" }}
                      >
                        {skill.level}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={skill.level}
                        onChange={(e) =>
                          handleSkillLevel(skill.name, e.target.value)
                        }
                        className="flex-1 h-1.5 accent-primary"
                      />
                    </div>
                    <div
                      className="mt-1.5 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(15,40,84,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${skill.level * 10}%`,
                          background:
                            "linear-gradient(90deg, #1C4D8D, #4988C4)",
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={handleSaveSkills}
              loading={saving}
              disabled={skills.length === 0}
            >
              <Save className="w-4 h-4" />
              Save Skills ({skills.length})
            </Button>
          </div>
        </div>
      )}

      {/* ── EDUCATION TAB ── */}
      {activeTab === "education" && (
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6 bg-white shadow-sm border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center justify-between pb-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
                }}
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Education</h3>
                <p className="text-xs text-gray-400">
                  {education.length} entr{education.length !== 1 ? "ies" : "y"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEduForm((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: showEduForm
                  ? "rgba(239,68,68,0.08)"
                  : "linear-gradient(135deg, #0F2854, #1C4D8D)",
                color: showEduForm ? "#ef4444" : "white",
              }}
            >
              {showEduForm ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {showEduForm ? "Cancel" : "Add Entry"}
            </button>
          </div>

          {/* Add form */}
          {showEduForm && (
            <div
              className="rounded-xl p-5 space-y-4"
              style={{
                background: "rgba(15,40,84,0.03)",
                border: "1px dashed rgba(15,40,84,0.15)",
              }}
            >
              <p className="text-sm font-semibold text-gray-700">
                New Education Entry
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Institution"
                  placeholder="University / College name"
                  value={newEdu.institution}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, institution: e.target.value })
                  }
                />
                <Input
                  label="Degree"
                  placeholder="e.g. Bachelor of Science"
                  value={newEdu.degree}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, degree: e.target.value })
                  }
                />
                <Input
                  label="Field of Study"
                  placeholder="e.g. Computer Science"
                  value={newEdu.field}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, field: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Start Year</label>
                    <select
                      className="input-field"
                      value={newEdu.startYear}
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, startYear: e.target.value })
                      }
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">End Year</label>
                    <select
                      className="input-field"
                      value={newEdu.current ? "" : newEdu.endYear}
                      onChange={(e) =>
                        setNewEdu({
                          ...newEdu,
                          endYear: e.target.value,
                          current: false,
                        })
                      }
                      disabled={newEdu.current}
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={newEdu.current}
                  onChange={(e) =>
                    setNewEdu({
                      ...newEdu,
                      current: e.target.checked,
                      endYear: "",
                    })
                  }
                  className="accent-primary w-4 h-4"
                />
                Currently enrolled
              </label>
              <Button onClick={handleAddEducation}>
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
            </div>
          )}

          {/* Education list — timeline style */}
          {education.length === 0 && !showEduForm ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(15,40,84,0.06)" }}
              >
                <GraduationCap
                  className="w-7 h-7"
                  style={{ color: "#1C4D8D" }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No education entries
              </p>
              <p className="text-xs text-gray-400">
                Click "Add Entry" to get started
              </p>
            </div>
          ) : (
            <div className="relative space-y-3">
              {/* Timeline line */}
              {education.length > 1 && (
                <div
                  className="absolute left-[22px] top-10 bottom-4 w-px"
                  style={{ background: "rgba(28,77,141,0.12)" }}
                />
              )}
              {education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  {/* Timeline dot */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                    style={{
                      background: "linear-gradient(135deg, #1C4D8D, #4988C4)",
                      boxShadow: "0 4px 12px rgba(28,77,141,0.25)",
                    }}
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className="flex-1 p-4 rounded-xl transition-all group-hover:shadow-sm"
                    style={{
                      background: "rgba(15,40,84,0.03)",
                      border: "1px solid rgba(15,40,84,0.07)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {edu.degree}
                          {edu.field ? ` · ${edu.field}` : ""}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-md"
                            style={{
                              background: "rgba(28,77,141,0.1)",
                              color: "#1C4D8D",
                            }}
                          >
                            {edu.startYear || "?"} —{" "}
                            {edu.current ? "Present" : edu.endYear || "?"}
                          </span>
                          {edu.current && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-md"
                              style={{
                                background: "rgba(34,197,94,0.12)",
                                color: "#16a34a",
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveEducation(idx)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Button onClick={handleSaveEducation} loading={saving}>
              <Save className="w-4 h-4" />
              Save Education
            </Button>
          </div>
        </div>
      )}

      {/* ── INTERESTS & GOALS TAB ── */}
      {activeTab === "interests" && (
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6 bg-white shadow-sm border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center gap-3 pb-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0F2854, #1C4D8D)",
              }}
            >
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Interests & Goals
              </h3>
              <p className="text-xs text-gray-400">
                Personalise your AI recommendations
              </p>
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="input-label mb-0">Career Interests</label>
              <span className="text-xs text-gray-400">
                {form.interests.length} selected
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Select all that apply — used to improve your recommendations
            </p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_SUGGESTIONS.map((interest) => {
                const selected = form.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
                    style={
                      selected
                        ? {
                            background:
                              "linear-gradient(135deg, #0F2854, #1C4D8D)",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(15,40,84,0.25)",
                          }
                        : {
                            background: "rgba(15,40,84,0.05)",
                            color: "#374151",
                            border: "1px solid rgba(15,40,84,0.1)",
                          }
                    }
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Career goals */}
          <div>
            <label className="input-label">Career Goals</label>
            <textarea
              rows={4}
              placeholder="Describe your career goals and where you see yourself in 5 years..."
              className="input-field resize-none"
              value={form.careerGoals}
              onChange={(e) =>
                setForm({ ...form, careerGoals: e.target.value })
              }
              maxLength={1000}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {form.careerGoals.length}/1000
            </p>
          </div>

          {/* AI regen hint */}
          {skills.length > 0 && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(15,40,84,0.04)",
                border: "1px solid rgba(15,40,84,0.1)",
              }}
            >
              <Zap
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "#1C4D8D" }}
              />
              <p className="text-xs text-gray-600">
                Saving will automatically regenerate your AI career
                recommendations based on your updated interests.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={handleSaveBasic} loading={saving}>
              <Save className="w-4 h-4" />
              Save Interests & Goals
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
