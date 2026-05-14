import React, { useEffect, useMemo, useRef, useState } from "react";
import Spinner from "../common/Spinner";
import api from "../../services/api";

const ROLE_PROFILES = {
  frontend: {
    label: "Frontend Developer",
    focus: "UI architecture, React patterns, performance, accessibility, and product thinking.",
    starterQuestions: [
      "Tell me about a React feature you built and the trade-offs you made.",
      "How do you keep a frontend codebase maintainable as it grows?",
      "Describe a time you improved UI performance or user experience.",
    ],
    keywords: ["react", "component", "state", "props", "performance", "accessibility", "hooks", "redux", "testing", "typescript"],
  },
  backend: {
    label: "Backend Developer",
    focus: "APIs, system design, reliability, data modeling, security, and scalability.",
    starterQuestions: [
      "Describe a backend service you designed and how you handled scale.",
      "How do you design APIs that stay secure and easy to maintain?",
      "Tell me about a production issue you debugged and resolved.",
    ],
    keywords: ["api", "database", "authentication", "scalability", "latency", "cache", "sql", "nosql", "microservice", "security"],
  },
  data: {
    label: "Data Analyst / Data Scientist",
    focus: "Experiment design, insights, metrics, trade-offs, data quality, and business impact.",
    starterQuestions: [
      "Walk me through a project where data changed a business decision.",
      "How do you make sure your analysis is reliable and not misleading?",
      "Describe a time you explained a complex insight to a non-technical stakeholder.",
    ],
    keywords: ["analysis", "metric", "experiment", "python", "sql", "dashboard", "trend", "statistical", "model", "insight"],
  },
  product: {
    label: "Product / Business Analyst",
    focus: "Prioritization, communication, stakeholder management, metrics, and customer empathy.",
    starterQuestions: [
      "Tell me about a product decision you influenced with evidence.",
      "How do you balance user needs, technical constraints, and business goals?",
      "Describe a time you handled conflicting stakeholder expectations.",
    ],
    keywords: ["stakeholder", "roadmap", "metrics", "prioritize", "customer", "user", "impact", "communication", "roi", "launch"],
  },
  devops: {
    label: "DevOps / Cloud Engineer",
    focus: "Automation, infrastructure, deployment reliability, observability, and incident response.",
    starterQuestions: [
      "Tell me about a deployment or infrastructure improvement you owned.",
      "How do you approach reliability when a service is growing fast?",
      "Describe a production incident and how you handled it.",
    ],
    keywords: ["ci/cd", "docker", "kubernetes", "aws", "monitoring", "incident", "automation", "infrastructure", "deployment", "observability"],
  },
  general: {
    label: "General Career Interview",
    focus: "Communication, ownership, motivation, growth mindset, and role fit.",
    starterQuestions: [
      "Tell me about yourself and what kind of role you want next.",
      "What achievement are you most proud of, and why?",
      "Describe a challenge you faced and how you handled it.",
    ],
    keywords: ["project", "team", "challenge", "result", "communication", "leadership", "problem", "growth", "achievement", "impact"],
  },
};

const DEFAULT_ROLE = "general";

const QUICK_CHECKLIST = [
  "Use a concrete example",
  "Mention impact or outcome",
  "Show your thinking process",
  "Keep the answer structured",
];

const normalizeText = (value) => value.toLowerCase().replace(/[^a-z0-9\s/+-]/g, " ");

const countMatches = (text, words) => {
  const normalized = normalizeText(text);
  return words.reduce((count, word) => {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    return count + (normalized.match(pattern)?.length || 0);
  }, 0);
};

const detectStructureSignals = (answer) => {
  const text = answer.toLowerCase();
  const hasNumbers = /\d/.test(answer);
  const hasFirstSecondThird = /first|second|third|finally|then|after that/.test(text);
  const hasStar = /situation|task|action|result/.test(text);
  const hasOutcome = /impact|result|improved|reduced|increased|delivered|launched|saved/.test(text);
  const hasCollaboration = /team|stakeholder|manager|designer|engineer|cross-functional/.test(text);
  return {
    hasNumbers,
    hasFirstSecondThird,
    hasStar,
    hasOutcome,
    hasCollaboration,
  };
};

const estimateAnswerQuality = (answer, profile) => {
  const normalized = answer.trim();
  const words = normalized.split(/\s+/).filter(Boolean).length;
  const lengthScore = Math.min(25, Math.max(3, Math.round((words / 18) * 10)));
  const keywordHits = countMatches(normalized, profile.keywords);
  const structure = detectStructureSignals(normalized);
  const structureScore = [structure.hasStar, structure.hasOutcome, structure.hasNumbers, structure.hasCollaboration].filter(Boolean).length * 8;
  const clarityScore = Math.min(20, Math.max(4, normalized.length > 220 ? 18 : normalized.length > 120 ? 14 : 8));
  const confidenceSignals = /i think|i believe|i led|i owned|i built|i improved|i delivered/i.test(normalized) ? 12 : 6;
  const technicalDepth = Math.min(25, keywordHits * 4 + (structure.hasNumbers ? 5 : 0));
  const score = Math.min(100, Math.round(lengthScore + structureScore + clarityScore + confidenceSignals + technicalDepth));

  const strengths = [];
  if (words >= 80) strengths.push("You gave a sufficiently detailed answer.");
  if (structure.hasStar || structure.hasOutcome) strengths.push("Your response includes a useful real-world structure.");
  if (keywordHits > 0) strengths.push(`You used role-relevant language for ${profile.label.toLowerCase()}.`);
  if (structure.hasNumbers) strengths.push("You referenced measurable detail, which makes the answer stronger.");
  if (structure.hasCollaboration) strengths.push("You showed teamwork or stakeholder awareness.");

  const improvements = [];
  if (words < 50) improvements.push("Add more context, especially the challenge, your actions, and the result.");
  if (!structure.hasOutcome) improvements.push("State the outcome clearly so the interviewer can see the impact.");
  if (keywordHits === 0) improvements.push(`Use more specific terms related to ${profile.label.toLowerCase()}.`);
  if (!structure.hasStar) improvements.push("Use a STAR-style flow: situation, task, action, result.");
  if (!structure.hasNumbers) improvements.push("Add metrics, scale, or measurable impact if possible.");
  if (words < 25) improvements.push("The answer is too short for a real interview. Expand it with one concrete example.");

  const communication =
    score >= 80
      ? "Excellent"
      : score >= 65
        ? "Strong"
        : score >= 45
          ? "Developing"
          : "Needs work";

  const technical =
    keywordHits >= 4
      ? "Strong"
      : keywordHits >= 2
        ? "Moderate"
        : "Light";

  return {
    score,
    communication,
    technical,
    strengths,
    improvements,
    structure,
  };
};

const buildSuggestedAnswer = (question, profile, analysis, answer) => {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const opener = profile.label === "General Career Interview"
    ? "I’d answer this by clearly framing the situation, my actions, and the result."
    : `For a ${profile.label.toLowerCase()} role, I would answer by showing the challenge, the solution, and the measurable impact.`;

  const detailLine = words < 60
    ? "I would add one concrete example, mention the tools or decisions I used, and close with the outcome."
    : "I would keep the structure but tighten the wording so the result is easy to follow and the key metrics stand out.";

  const roleLine = profile.keywords.slice(0, 3).join(", ");
  const feedbackLine = analysis.score >= 70
    ? "The answer is already strong; refine it with sharper metrics and a clearer takeaway."
    : "The answer needs more specificity and a stronger link to the job requirements.";

  return `${opener} ${detailLine} I’d anchor it around relevant themes like ${roleLine}. ${feedbackLine}`;
};

const generateFollowUpQuestion = (question, answer, profile, analysis, turnIndex) => {
  const lowered = normalizeText(answer);
  const followUps = [];

  if (analysis.score < 45) {
    followUps.push("Can you give a more specific example and walk me through what you personally did?");
  }
  if (!analysis.structure.hasOutcome) {
    followUps.push("What was the measurable result or impact of that situation?");
  }
  if (analysis.structure.hasNumbers === false) {
    followUps.push("Can you add numbers, scope, or scale so I can understand the size of the work?");
  }
  if (analysis.technical === "Light" && profile.keywords.length > 0) {
    followUps.push(`Which tools, methods, or decisions would you highlight for a ${profile.label.toLowerCase()} interviewer?`);
  }
  if (/team|stakeholder|manager|customer/.test(lowered)) {
    followUps.push("How did you handle disagreement or alignment with the people involved?");
  }
  if (/challenge|problem|bug|issue|incident/.test(lowered)) {
    followUps.push("What did you learn from that situation, and what would you do differently now?");
  }
  if (/lead|led|owned|implemented|built|created|designed/.test(lowered)) {
    followUps.push("What trade-offs did you consider while making that decision?");
  }

  const fallback = [
    `If you had one more minute, what would you add to make this answer stronger for a ${profile.label.toLowerCase()} interview?`,
    `What part of your answer best demonstrates readiness for a ${profile.label.toLowerCase()} role?`,
  ];

  const nextQuestion = followUps[turnIndex % Math.max(1, followUps.length)] || fallback[turnIndex % fallback.length];
  return nextQuestion;
};

const buildInterviewerPrompt = (profile, question, turnIndex) => {
  const intro = turnIndex === 0 ? `We’ll simulate a ${profile.label} interview.` : "Let’s continue the interview.";
  return `${intro} I’m focusing on ${profile.focus} Answer as you would in a real interview: ${question}`;
};

const createQuestionBank = (roleKey, customQuestion) => {
  const profile = ROLE_PROFILES[roleKey] || ROLE_PROFILES[DEFAULT_ROLE];
  const base = [...profile.starterQuestions];
  if (customQuestion?.trim()) {
    base.unshift(customQuestion.trim());
  }
  return base;
};

const normalizeTurnResponse = (data) => ({
  score: Number.isFinite(Number(data?.score)) ? Math.max(0, Math.min(100, Math.round(Number(data.score)))) : 60,
  communication: typeof data?.communication === "string" ? data.communication : "Developing",
  technical: typeof data?.technical === "string" ? data.technical : "Moderate",
  strengths: Array.isArray(data?.strengths) ? data.strengths.filter((item) => typeof item === "string") : [],
  improvements: Array.isArray(data?.improvements) ? data.improvements.filter((item) => typeof item === "string") : [],
  suggestedAnswer:
    typeof data?.suggestedAnswer === "string"
      ? data.suggestedAnswer
      : "Use STAR structure and include specific impact.",
  followUpQuestion:
    typeof data?.followUpQuestion === "string"
      ? data.followUpQuestion
      : "Can you provide one concrete example with measurable impact?",
  warning: typeof data?.warning === "string" ? data.warning : null,
});

const InterviewPrepSection = () => {
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [customQuestion, setCustomQuestion] = useState("");
  const [stage, setStage] = useState("setup");
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [pendingAnswer, setPendingAnswer] = useState("");
  const [turnIndex, setTurnIndex] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [autoReadAloud, setAutoReadAloud] = useState(true);
  const [reviewNarrationEnabled, setReviewNarrationEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechInputError, setSpeechInputError] = useState(null);
  const transcriptEndRef = useRef(null);
  const lastSpokenMessageIdRef = useRef(null);
  const lastSpokenReviewIdRef = useRef(null);
  const recognitionRef = useRef(null);
  const dictationBaseRef = useRef("");
  const dictatedFinalRef = useRef("");
  const dictatedInterimRef = useRef("");
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const speechRecognitionSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const profile = useMemo(() => ROLE_PROFILES[role] || ROLE_PROFILES[DEFAULT_ROLE], [role]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  useEffect(() => {
    if (!speechRecognitionSupported) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    const composeDictatedAnswer = () => {
      const base = dictationBaseRef.current.trim();
      const dictated = `${dictatedFinalRef.current} ${dictatedInterimRef.current}`.trim();
      if (base && dictated) return `${base} ${dictated}`;
      return base || dictated;
    };

    recognition.onresult = (event) => {
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) {
          dictatedFinalRef.current = `${dictatedFinalRef.current} ${transcript}`.trim();
        } else {
          interimChunk += transcript;
        }
      }

      dictatedInterimRef.current = interimChunk.trim();
      setPendingAnswer(composeDictatedAnswer());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setSpeechInputError("Microphone permission is blocked. Allow mic access in your browser settings.");
      } else {
        setSpeechInputError("Voice input failed. Please try again or type your answer.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      dictatedInterimRef.current = "";
      dictationBaseRef.current = "";
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [speechRecognitionSupported]);

  const speakText = (text) => {
    if (!speechSupported || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
  };

  const startListening = () => {
    if (!speechRecognitionSupported || !recognitionRef.current || isListening) return;
    setSpeechInputError(null);
    dictationBaseRef.current = pendingAnswer.trim();
    dictatedFinalRef.current = "";
    dictatedInterimRef.current = "";
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (_err) {
      setSpeechInputError("Microphone is already active. Stop and try again.");
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
    dictatedInterimRef.current = "";
    dictationBaseRef.current = "";
  };

  const buildReviewNarration = (reviewAnalysis) => {
    if (!reviewAnalysis) return "";

    const worked = reviewAnalysis.strengths.length
      ? reviewAnalysis.strengths.join(" ")
      : "You stayed on topic and answered the question.";
    const improve = reviewAnalysis.improvements.length
      ? reviewAnalysis.improvements.join(" ")
      : "Keep adding impact details and role-specific examples.";
    return [
      `Feedback score ${reviewAnalysis.score} out of 100.`,
      `Communication is ${reviewAnalysis.communication}. Technical depth is ${reviewAnalysis.technical}.`,
      `What worked: ${worked}`,
      `How to improve: ${improve}`,
      `Better version: ${reviewAnalysis.suggestedAnswer}`,
    ].join(" ");
  };

  useEffect(() => {
    if (!autoReadAloud || !speechSupported || messages.length === 0) return;

    const lastSpokenId = lastSpokenMessageIdRef.current;
    const lastSpokenIndex = lastSpokenId
      ? messages.findIndex((message) => message.id === lastSpokenId)
      : -1;

    const pendingInterviewerMessages = messages
      .slice(lastSpokenIndex + 1)
      .filter((message) => message.speaker === "interviewer" && typeof message.content === "string" && message.content.trim());

    if (pendingInterviewerMessages.length === 0) return;

    const combinedSpeech = pendingInterviewerMessages
      .map((message) => message.content)
      .join(" ");

    lastSpokenMessageIdRef.current = pendingInterviewerMessages[pendingInterviewerMessages.length - 1].id;
    speakText(combinedSpeech);
  }, [messages, autoReadAloud, speechSupported]);

  useEffect(() => {
    if (!reviewNarrationEnabled || !speechSupported || stage !== "review" || !analysis) return;
    const reviewKey = `${analysis.score}-${analysis.communication}-${analysis.technical}-${analysis.suggestedAnswer}`;
    if (lastSpokenReviewIdRef.current === reviewKey) return;

    lastSpokenReviewIdRef.current = reviewKey;
    speakText(buildReviewNarration(analysis));
  }, [analysis, reviewNarrationEnabled, speechSupported, stage]);

  const startInterview = () => {
    const bank = createQuestionBank(role, customQuestion);
    const initialQuestion = bank[0];

    setQuestionBank(bank);
    setMessages([
      {
        id: "welcome",
        speaker: "interviewer",
        content: `I’ll act as a ${profile.label} interviewer. ${profile.focus} Let’s start with a realistic question.`,
      },
      {
        id: "question-0",
        speaker: "interviewer",
        content: buildInterviewerPrompt(profile, initialQuestion, 0),
      },
    ]);
    setCurrentQuestion(initialQuestion);
    setTurnIndex(0);
    setAnswerHistory([]);
    setAnalysis(null);
    setPendingAnswer("");
    setStage("interview");
    setError(null);
    setNotice(null);
    lastSpokenMessageIdRef.current = null;
    dictatedFinalRef.current = "";
    dictatedInterimRef.current = "";
    dictationBaseRef.current = "";
  };

  const submitAnswer = async () => {
    if (isListening) {
      stopListening();
    }
    const answer = pendingAnswer.trim();
    if (!answer) return;

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const nextAnswerHistory = [...answerHistory, { question: currentQuestion, answer }];
      const { data } = await api.post("/chatbot/interview-turn", {
        role: profile.label,
        focus: profile.focus,
        question: currentQuestion,
        answer,
        history: answerHistory,
      });
      const result = normalizeTurnResponse(data);
      const structuredQuestion = questionBank[turnIndex + 1] || result.followUpQuestion;
      const nextQuestion = turnIndex + 1 < questionBank.length ? questionBank[turnIndex + 1] : result.followUpQuestion;
      const summary = {
        score: result.score,
        communication: result.communication,
        technical: result.technical,
        strengths: result.strengths,
        improvements: result.improvements,
        suggestedAnswer: result.suggestedAnswer,
      };

      if (result.warning) {
        setNotice(result.warning);
      }

      setAnalysis(summary);
      setMessages((prev) => [
        ...prev,
        { id: `answer-${turnIndex}`, speaker: "candidate", content: answer },
        {
          id: `feedback-${turnIndex}`,
          speaker: "interviewer",
          content: [
            `Feedback score: ${result.score}/100. Communication: ${result.communication}. Technical depth: ${result.technical}.`,
            result.strengths.length ? `What worked: ${result.strengths.join(" ")}` : "What worked: your answer was on topic.",
            result.improvements.length ? `How to improve: ${result.improvements.join(" ")}` : "How to improve: add one sharper impact detail.",
            `Better version: ${result.suggestedAnswer}`,
          ].join("\n\n"),
        },
        {
          id: `question-${turnIndex + 1}`,
          speaker: "interviewer",
          content: `Follow-up question: ${nextQuestion || structuredQuestion}`,
        },
      ]);

      setAnswerHistory(nextAnswerHistory);
      setTurnIndex((prev) => prev + 1);
      setCurrentQuestion(nextQuestion || structuredQuestion);
      setPendingAnswer("");
      dictatedFinalRef.current = "";
      dictatedInterimRef.current = "";
      dictationBaseRef.current = "";

      if (!nextQuestion && turnIndex + 1 >= questionBank.length) {
        setStage("review");
      } else {
        setStage("interview");
      }
    } catch (err) {
      setError("Unable to analyze your answer right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const finishSession = () => {
    setStage("review");
  };

  const resetSession = () => {
    setStage("setup");
    setMessages([]);
    setCurrentQuestion("");
    setPendingAnswer("");
    setTurnIndex(0);
    setAnalysis(null);
    setLoading(false);
    setError(null);
    setNotice(null);
    setAnswerHistory([]);
    setQuestionBank([]);
    lastSpokenMessageIdRef.current = null;
    lastSpokenReviewIdRef.current = null;
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setSpeechInputError(null);
    dictatedFinalRef.current = "";
    dictatedInterimRef.current = "";
    dictationBaseRef.current = "";
  };

  const sessionSummary = useMemo(() => {
    if (!answerHistory.length) {
      return null;
    }

    const averageLength = Math.round(
      answerHistory.reduce((sum, item) => sum + item.answer.split(/\s+/).filter(Boolean).length, 0) /
        answerHistory.length,
    );

    const strongAnswers = answerHistory.filter((item) => estimateAnswerQuality(item.answer, profile).score >= 70).length;
    const weakAnswers = answerHistory.length - strongAnswers;

    return {
      averageLength,
      strongAnswers,
      weakAnswers,
    };
  }, [answerHistory, profile]);

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1.4fr]">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-dark-card p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Interview Simulation</p>
            <h3 className="mt-2 text-xl font-black text-gray-900 dark:text-white">Practice like a real candidate</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              The interviewer remembers your answers, follows up on weak points, and gives role-specific coaching.
            </p>
          </div>

          <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-dark-bg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Voice mode</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {speechSupported
                    ? "The interviewer can read questions and feedback aloud."
                    : "Your browser does not support voice playback."}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {speechRecognitionSupported
                    ? "You can also use your microphone to speak answers."
                    : "Voice input is not available in this browser. Use typing for answers."}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={autoReadAloud}
                  onChange={(e) => {
                    setAutoReadAloud(e.target.checked);
                    if (!e.target.checked && speechSupported) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  disabled={!speechSupported}
                />
                Auto read
              </label>
            </div>
            {speechSupported && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => {
                    setAutoReadAloud(true);
                    stopVoice();
                  }}
                >
                  Resume voice
                </button>
                <button
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-200 dark:hover:bg-red-950/30"
                  onClick={() => {
                    stopVoice();
                    setAutoReadAloud(false);
                    setReviewNarrationEnabled(false);
                  }}
                >
                  Skip voice
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Select role</span>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-dark-bg dark:text-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={stage === "interview" || loading}
              >
                {Object.entries(ROLE_PROFILES).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Custom opening question</span>
              <textarea
                className="min-h-[88px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-dark-bg dark:text-white"
                placeholder="Paste a role-specific question or describe the interview scenario you want to practice..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                disabled={stage === "interview" || loading}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={startInterview}
                disabled={loading}
              >
                {loading && stage === "setup" ? <Spinner size="sm" /> : "Start Interview"}
              </button>
              <button
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={resetSession}
                disabled={loading}
              >
                Reset Session
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-dark-bg">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Focus area</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{profile.focus}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-dark-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Live Transcript</p>
              <h3 className="mt-2 text-xl font-black text-gray-900 dark:text-white">Dynamic interviewer memory</h3>
            </div>
            {sessionSummary && (
              <div className="rounded-xl bg-primary/10 px-3 py-2 text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Avg length</p>
                <p className="text-sm font-black text-primary">{sessionSummary.averageLength} words</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex min-h-[420px] flex-col rounded-2xl bg-gray-50 p-4 dark:bg-dark-bg">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-dark-card">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Your interview transcript will appear here.</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Start a session to get role-specific questions, follow-ups, and feedback.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.speaker === "candidate" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-line transition-all duration-300 ${
                        message.speaker === "candidate"
                          ? "rounded-br-md bg-primary text-white"
                          : "rounded-bl-md bg-white text-gray-800 dark:bg-dark-card dark:text-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-gray-500 shadow-sm dark:bg-dark-card dark:text-gray-300">
                    <Spinner size="sm" />
                    <span className="ml-2 align-middle">Analyzing your answer...</span>
                  </div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}

            {notice && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                {notice}
              </div>
            )}

            {stage === "interview" && currentQuestion && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Current question</p>
                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{currentQuestion}</p>
                  </div>
                  {speechSupported && (
                    <button
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => speakText(currentQuestion)}
                    >
                      Read aloud
                    </button>
                  )}
                </div>

                <textarea
                  className="mt-3 min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary dark:border-gray-700 dark:bg-dark-bg dark:text-white"
                  placeholder="Answer naturally. Include context, actions, results, and any technical details that matter."
                  value={pendingAnswer}
                  onChange={(e) => setPendingAnswer(e.target.value)}
                  disabled={loading}
                />

                {speechInputError && (
                  <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-300">{speechInputError}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {speechRecognitionSupported && (
                    <button
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        isListening
                          ? "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/40 dark:text-red-200 dark:hover:bg-red-950/30"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      }`}
                      onClick={isListening ? stopListening : startListening}
                      disabled={loading}
                    >
                      {isListening ? "Stop Mic" : "Speak Answer"}
                    </button>
                  )}
                  <button
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={submitAnswer}
                    disabled={loading || !pendingAnswer.trim()}
                  >
                    Submit Answer
                  </button>
                  <button
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={finishSession}
                    disabled={loading}
                  >
                    End Practice
                  </button>
                </div>
              </div>
            )}

            {stage === "review" && analysis && (
              <div className="mt-4 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-card md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Feedback summary</p>
                  <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <p><span className="font-semibold text-gray-900 dark:text-white">Communication:</span> {analysis.communication}</p>
                    <p><span className="font-semibold text-gray-900 dark:text-white">Technical depth:</span> {analysis.technical}</p>
                    <p><span className="font-semibold text-gray-900 dark:text-white">Score:</span> {analysis.score}/100</p>
                  </div>
                  {speechSupported && (
                    <button
                      className="mt-4 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => speakText(buildReviewNarration(analysis))}
                    >
                      Read full feedback
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">What to improve</p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {analysis.improvements.length ? analysis.improvements.map((item) => <li key={item}>• {item}</li>) : <li>• Keep adding impact details and role-specific examples.</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Suggested answer pattern</p>
                    <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{analysis.suggestedAnswer}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">What worked</p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {analysis.strengths.length ? analysis.strengths.map((item) => <li key={item}>• {item}</li>) : <li>• Your answer stayed relevant and on topic.</li>}
                    </ul>
                  </div>
                  {speechSupported && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        onClick={() => speakText(`What worked. ${analysis.strengths.join(" ") || "You stayed on topic and answered the question."}`)}
                      >
                        Read what worked
                      </button>
                      <button
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        onClick={() => speakText(`How to improve. ${analysis.improvements.join(" ") || "Keep adding impact details and role-specific examples."}`)}
                      >
                        Read improvements
                      </button>
                      <button
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        onClick={() => speakText(`Better version. ${analysis.suggestedAnswer}`)}
                      >
                        Read better version
                      </button>
                      <button
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-200 dark:hover:bg-red-950/30"
                        onClick={() => stopVoice()}
                      >
                        Skip current voice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {QUICK_CHECKLIST.map((item) => (
          <div key={item} className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm dark:border-gray-800 dark:bg-dark-card">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item}</p>
          </div>
        ))}
      </div>

      {sessionSummary && (
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm dark:border-gray-800 dark:bg-dark-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Session memory</p>
              <h4 className="mt-2 text-lg font-black text-gray-900 dark:text-white">What the AI learned this session</h4>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="rounded-full bg-green-100 px-3 py-1.5 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-200">
                Strong answers: {sessionSummary.strongAnswers}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                Needs work: {sessionSummary.weakAnswers}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            The interviewer now uses your previous answers, adjusts follow-up questions, and remembers whether you are being concise or detailed.
            Each turn is evaluated against the selected role so the simulation stays realistic and personalized.
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewPrepSection;
