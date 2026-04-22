import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function SkillRadarChart({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Add skills to see your radar chart
      </div>
    );
  }

  const data = skills.slice(0, 8).map((s) => ({
    subject: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
    level: s.level,
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#4988C4" strokeOpacity={0.25} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#6B7280", fontSize: 11, fontFamily: "Inter" }}
        />
        <Radar
          name="Skill Level"
          dataKey="level"
          stroke="#0F2854"
          fill="#0F2854"
          fillOpacity={0.2}
          dot={{ r: 3, fill: "#1C4D8D" }}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            fontSize: 13,
          }}
          formatter={(val) => [`Level ${val}/10`, "Proficiency"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
