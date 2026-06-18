export type OperatorLevel =
  | "Beginner Operator"
  | "Junior Seller"
  | "Professional Seller"
  | "Senior Seller"
  | "Elite Doctor Ali Consultant"
  | "Top Leader";

export interface LevelInfo {
  level: OperatorLevel;
  requiredXp: number;
  unlockedFeatures: string[];
  tips: string[];
}

export interface DoctorAliProduct {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  supportClaims: string[]; // Claims that are safe, e.g. "May support restful cycles"
  ethicsNote: string; // Explaining what to avoid claiming
  targetAilmentGoals: string; // What physical / mental goals it addresses (e.g., posture alignment, cellular energy)
  spinTemplate: {
    situation: string[];
    problem: string[];
    implication: string[];
    needPayoff: string[];
  };
  commonObjections: {
    objection: string;
    handleTemplate: string;
    explanation: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
}

export type CustomerPersona = "Skeptical" | "Price-Sensitive" | "Busy" | "Curious" | "Returning";

export interface RoleplayScenario {
  id: string;
  title: string;
  customerName: string;
  persona: CustomerPersona;
  background: string;
  targetProduct: string; // Product recommendable
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface GradedEvaluation {
  score: number; // 1-10
  communicationQuality: string;
  customerUnderstanding: string;
  salesConfidence: string;
  spinApplication: string;
  closingEffectiveness: string;
  strengths: string[];
  weaknesses: string[];
  detailedFeedback: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
