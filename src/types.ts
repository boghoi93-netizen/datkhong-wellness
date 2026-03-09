export interface TongueFeatures {
  color: string;
  coating: string;
  moisture: string;
  cracks: string;
  coatingThickness: string;
  teethMarks: string;
  swelling: string;
}

export interface HealthIndices {
  vitality: number; // Khí huyết (0-100)
  digestion: number; // Tỳ vị (0-100)
  dampness: number; // Độ thấp (0-100)
}

export interface Meal {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MealPlan {
  monday: Meal;
  tuesday: Meal;
  wednesday: Meal;
  thursday: Meal;
  friday: Meal;
  saturday: Meal;
  sunday: Meal;
}

export interface Exercise {
  name: string;
  duration: string;
  benefit: string;
}

export interface Reminder {
  time: string;
  task: string;
}

export interface UserInfo {
  name: string;
  birthYear: string;
  gender: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  userInfo?: UserInfo;
  healthScore: number;
  tongueFeatures: TongueFeatures;
  constitutionType: string;
  explanation: string;
  indices: HealthIndices;
  mealPlan: MealPlan;
  exerciseSuggestions: Exercise[];
  reminders: Reminder[];
}

export interface QuestionnaireAnswers {
  fatigue: string;
  digestion: string;
  temperature: string;
  sleep: string;
  bowel: string;
}
