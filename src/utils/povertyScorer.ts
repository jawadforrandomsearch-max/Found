/**
 * Calculates a Poverty Verification / Financial Need Score (0 to 100)
 * strictly mapping from the student's submission credentials, updated
 * according to custom Sadiqon Matrix Rules:
 * - Income less than 30,000 PKR (Heavily prioritized)
 * - Academic standard greater than 80% (Heavily weighted)
 */
export function calculateNeedScore(params: {
  monthlyIncome: number;
  isOrphan: boolean;
  isDisabled: boolean;
  familyMembers: number;
  earningMembers: number;
  academicMarks: number;
}): number {
  let score = 0;

  // 1. Monthly Income Index (Max 40 points)
  // Threshold updated to prioritize household revenue less than 30,000 PKR
  const income = params.monthlyIncome;
  if (income <= 15000) {
    score += 40;
  } else if (income < 30000) {
    score += 33; // Elevated points for meeting less than 30,000 PKR rule
  } else if (income <= 45000) {
    score += 18;
  } else if (income <= 60000) {
    score += 8;
  } else {
    score += 2; // minimal priority
  }

  // 2. Orphan status (Max 25 points)
  if (params.isOrphan) {
    score += 25;
  }

  // 3. Special Ability / Disability status (Max 15 points)
  if (params.isDisabled) {
    score += 15;
  }

  // 4. Family Demographics Index (Max 12 points)
  const members = Number(params.familyMembers) || 1;
  const earners = Number(params.earningMembers) || 1;
  const dependentRatio = (members - earners) / members;
  
  if (earners === 1 && members >= 7) {
    score += 12;
  } else if (earners === 1 && members >= 5) {
    score += 9;
  } else if (dependentRatio > 0.8) {
    score += 8;
  } else if (dependentRatio > 0.6) {
    score += 6;
  } else if (dependentRatio > 0.4) {
    score += 4;
  } else {
    score += 2;
  }

  // 5. Academic Performance (Max 8 points)
  // Threshold updated to reward standard percentage elements greater than 80%
  const marks = params.academicMarks;
  if (marks > 80) {
    score += 8; // Max merit allocation for passing user's rule (> 80%)
  } else if (marks >= 70) {
    score += 5;
  } else if (marks >= 50) {
    score += 2;
  }

  // 6. Custom Sadiqon Evaluation Rule Matching Bonus (Capped index support)
  if (income < 30000 && marks > 80) {
    score += 10; // Extra alignment bonus for satisfying both rules concurrently
  }

  // Limit between 0 and 100
  return Math.min(100, Math.max(0, score));
}

/**
 * Checks if the student meets the custom evaluation matrix threshold
 * established by the foundation director:
 * - monthlyIncome < 30,000 PKR
 * - academicMarks > 80%
 */
export function meetsEvaluationMatrixRule(income: number, marks: number): boolean {
  return income < 30000 && marks > 80;
}

/**
 * Categorizes the Need Score into readable severities
 */
export function getNeedSeverity(score: number): {
  label: string;
  urduLabel: string;
  color: string;
  bgColor: string;
  textColor: string;
} {
  if (score >= 80) {
    return {
      label: "Critical Help Required",
      urduLabel: "فوری اور اشد ضرورت",
      color: "from-rose-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/25",
      textColor: "text-red-700 dark:text-red-400"
    };
  } else if (score >= 50) {
    return {
      label: "High Financial Need",
      urduLabel: "زیادہ ضرورت مند",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/25",
      textColor: "text-orange-700 dark:text-orange-400"
    };
  } else if (score >= 30) {
    return {
      label: "Moderate Priority",
      urduLabel: "متوسط ضرورت مند",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/15",
      textColor: "text-amber-700 dark:text-amber-400"
    };
  } else {
    return {
      label: "Low Support Priority",
      urduLabel: "کم ضرورت مند",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/10",
      textColor: "text-emerald-700 dark:text-emerald-400"
    };
  }
}
