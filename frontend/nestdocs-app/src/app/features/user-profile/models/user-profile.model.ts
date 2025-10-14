/**
 * User badge model
 */
export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * User profile data
 */
export interface UserProfile {
  username: string;
  email: string;
  badges: Badge[];
  isTrialActive: boolean;
  trialDaysRemaining: number;
}
