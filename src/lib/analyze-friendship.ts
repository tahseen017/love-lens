import {
  FRIENDSHIP_POSITIVE,
  FRIENDSHIP_NEGATIVE,
  BANGLISH_POSITIVE_FRIENDSHIP,
  BANGLISH_NEGATIVE_FRIENDSHIP,
  FAKE_FRIEND_PATTERNS,
  BENEFITS_GIVER,
  BENEFITS_TAKER,
  LOYALTY_WORDS,
  STABILITY_WORDS,
  INSTABILITY_WORDS,
  FRIENDSHIP_TITLES,
  
  
  
  
  BANGLISH_TAKER
} from './friendship-dictionary';

interface FriendshipAnalysis {
  realFakeScore: number; // 0-100 (real friend vs fake friend)
  benefitsScore: number; // 0-100 (giver vs taker)
  loyaltyScore: number; // 0-100 (loyal vs disloyal)
  stabilityScore: number; // 0-100 (stable vs unstable)
  authenticityScore: number; // 0-100 (genuine vs fake)
  reciprocityScore: number; // 0-100 (mutual vs one-sided)
  energyScore: number; // 0-100 (giving vs draining)
  giverTakerRatio: number; // -1 (taker) to 1 (giver)
  fakeFriendPatterns: string[];
  benefitsPatterns: string[];
  loyaltyPatterns: string[];
  instabilityPatterns: string[];
  isAuthentic: boolean;
  isRealFriend: boolean;
  isFakeFriend: boolean;
  isOpportunist: boolean;
  isSuperficial: boolean;
  isOneSided: boolean;
  isDraining: boolean;
  isToxic: boolean;
  overallFriendshipQuality: 'excellent' | 'great' | 'good' | 'fair' | 'concerning' | 'poor' | 'toxic';
  title: string;
  subtitle: string;
  dramaticInsight: string;
  advice: string[];
  auraColor: 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'blue' | 'pink';
}

export function analyzeFriendship(text: string): FriendshipAnalysis {
  const cleanText = text.toLowerCase().trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const lines = text.split(/\n/).filter(l => l.trim().length > 0);

  console.log('[DEBUG] Friendship analysis called with', lines.length, 'lines,', words.length, 'words');

  // Detect language
  const isBanglish = detectBanglishFriendship(cleanText);

  // Count keywords
  const counts = {
    positive: countKeywords(cleanText, isBanglish ? BANGLISH_POSITIVE_FRIENDSHIP : FRIENDSHIP_POSITIVE),
    negative: countKeywords(cleanText, isBanglish ? BANGLISH_NEGATIVE_FRIENDSHIP : FRIENDSHIP_NEGATIVE),
    fakePatterns: countKeywords(cleanText, FAKE_FRIEND_PATTERNS),
    giver: countKeywords(cleanText, isBanglish ? BANGLISH_GIVER : BENEFITS_GIVER),
    taker: countKeywords(cleanText, isBanglish ? BANGLISH_TAKER : BENEFITS_TAKER),
    loyalty: countKeywords(cleanText, LOYALTY_WORDS),
    stability: countKeywords(cleanText, STABILITY_WORDS),
    instability: countKeywords(cleanText, INSTABILITY_WORDS)
  };

  console.log('[DEBUG] Keyword counts:', counts);

  // Calculate scores (0-100)
  const scores = {
    authenticity: calculateAuthenticity(counts, lines.length),
    reciprocity: calculateReciprocity(counts, lines.length),
    loyalty: calculateLoyalty(counts, lines.length),
    stability: calculateStability(counts, lines.length),
    energy: calculateEnergy(counts, lines.length),
    benefits: calculateBenefits(counts, lines.length)
  };

  // Overall scores
  const realFakeScore = calculateRealFakeScore(scores, counts.fakePatterns);
  const benefitsScore = scores.benefits;
  const loyaltyScore = scores.loyalty;
  const stabilityScore = scores.stability;
  const authenticityScore = scores.authenticity;
  const reciprocityScore = scores.reciprocity;
  const energyScore = scores.energy;
  const giverTakerRatio = calculateGiverTakerRatio(scores);

  // Detect patterns
  const fakeFriendPatterns = detectFakeFriendPatterns(cleanText, FAKE_FRIEND_PATTERNS);
  const benefitsPatterns = detectBenefitsPatterns(cleanText, isBanglish ? BANGLISH_GIVER : BENEFITS_GIVER);
  const loyaltyPatterns = detectLoyaltyPatterns(cleanText, LOYALTY_WORDS);
  const instabilityPatterns = detectInstabilityPatterns(cleanText, INSTABILITY_WORDS);

  // Binary flags
  const isAuthentic = authenticityScore >= 60;
  const isRealFriend = realFakeScore >= 60;
  const isFakeFriend = realFakeScore <= 40;
  const isOpportunist = fakeFriendPatterns.some(p => p.includes('opportunist') || p.includes('uses you') || p.includes('user'));
  const isSuperficial = realFakeScore <= 50 && fakeFriendPatterns.some(p => p.includes('shallow') || p.includes('superficial') || p.includes('surface'));
  const isOneSided = reciprocityScore <= 30;
  const isDraining = energyScore <= 30;
  const isToxic = counts.negative / Math.max(1, counts.positive) > 0.7;

  // Determine quality
  const overallFriendshipQuality = determineFriendshipQuality(scores, counts);

  // Select title and insight
  const title = selectFriendshipTitle(overallFriendshipQuality, isFakeFriend, isRealFriend, isOneSided, isDraining);
  const subtitle = selectFriendshipSubtitle(scores, overallFriendshipQuality, isFakeFriend, isOneSided);
  const dramaticInsight = selectFriendshipInsight(overallFriendshipQuality, isFakeFriend, isRealFriend, isOneSided, isDraining, isSuperficial, isOpportunist, fakeFriendPatterns);
  const advice = selectFriendshipAdvice(overallFriendshipQuality, isFakeFriend, isOneSided, isDraining, isOpportunist, isSuperficial, falseFriendPatterns);
  const auraColor = selectFriendshipAura(overallFriendshipQuality, isRealFriend, isFakeFriend, isToxic);

  console.log('[DEBUG] Friendship analysis complete:', {
    quality: overallFriendshipQuality,
    scores,
    flags: { isAuthentic, isRealFriend, isFakeFriend, isOneSided, isDraining }
  });

  return {
    realFakeScore,
    benefitsScore,
    loyaltyScore,
    stabilityScore,
    authenticityScore,
    reciprocityScore,
    energyScore,
    giverTakerRatio,
    fakeFriendPatterns,
    benefitsPatterns,
    loyaltyPatterns,
    instabilityPatterns,
    isAuthentic,
    isRealFriend,
    isFakeFriend,
    isOpportunist,
    isSuperficial,
    isOneSided,
    isDraining,
    isToxic,
    overallFriendshipQuality,
    title,
    subtitle,
    dramaticInsight,
    advice,
    auraColor
  };
}

function detectBanglishFriendship(text: string): boolean {
  const banglishWords = BANGLISH_POSITIVE_FRIENDSHIP.filter(word => text.includes(word));
  const englishWords = FRIENDSHIP_POSITIVE.filter(word => text.includes(word));
  const banglishRatio = banglishWords.length / Math.max(1, banglishWords.length + englishWords.length);
  return banglishRatio >= 0.3 || text.match(/['\u200B-\u200D\uFEFF]/);
}

function countKeywords(text: string, keywords: string[]): number {
  let count = 0;
  keywords.forEach(keyword => {
    if (keyword.includes(' ')) {
      // Handle multi-word phrases
      const phrase = keyword.toLowerCase();
      const regex = new RegExp(phrase, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    } else {
      // Single words
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
  });
  return count;
}

function calculateAuthenticity(counts: any, lineCount: number): number {
  let score = 50;
  score += counts.positive * 2;
  score -= counts.fakePatterns * 5;
  score -= counts.negative * 2;
  score += Math.min(10, lineCount * 0.5); // Consistent communication
  return Math.max(0, Math.min(100, score));
}

function calculateReciprocity(counts: any, lineCount: number): number {
  let score = 50;
  const ratio = counts.giver / Math.max(1, counts.taker);
  score += Math.min(30, ratio * 30); // Higher giver ratio = better reciprocity
  score -= Math.abs(ratio - 1) * 20; // Imbalance penalty
  score += Math.min(10, lineCount * 0.3); // Mutual conversation
  return Math.max(0, Math.min(100, score));
}

function calculateLoyalty(counts: any, lineCount: number): number {
  let score = 50;
  score += counts.loyalty * 3;
  score += counts.stability * 2;
  score -= counts.instability * 4;
  score += Math.min(10, lineCount * 0.4); // Consistent presence
  return Math.max(0, Math.min(100, score));
}

function calculateStability(counts: any, lineCount: number): number {
  let score = 50;
  score += counts.stability * 3;
  score -= counts.instability * 4;
  score += Math.min(10, lineCount * 0.5); // Consistent communication
  return Math.max(0, Math.min(100, score));
}

function calculateEnergy(counts: any, lineCount: number): number {
  let score = 50;
  score += counts.giver * 3;
  score -= counts.taker * 4;
  score += counts.positive * 2;
  score -= counts.negative * 3;
  return Math.max(0, Math.min(100, score));
}

function calculateBenefits(counts: any, lineCount: number): number {
  let score = 50;
  const ratio = counts.giver / Math.max(1, counts.taker);
  score += Math.min(30, ratio * 30);
  score -= Math.abs(ratio - 1) * 25;
  score += Math.min(10, lineCount * 0.3);
  return Math.max(0, Math.min(100, score));
}

function calculateRealFakeScore(scores: any, fakePatterns: number): number {
  let score = scores.authenticity * 0.4;
  score += scores.reciprocity * 0.3;
  score += scores.loyalty * 0.2;
  score += scores.stability * 0.1;
  score -= fakePatterns * 10;
  return Math.max(0, Math.min(100, score));
}

function calculateGiverTakerRatio(scores: any): number {
  const total = scores.benefits;
  if (total === 0) return 0;
  const score = (scores.benefits - 50) / 50;
  return Math.max(-1, Math.min(1, score));
}

function detectFakeFriendPatterns(text: string, patterns: string[]): string[] {
  const detected: string[] = [];
  patterns.forEach(pattern => {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      detected.push(pattern);
    }
  });
  return detected.slice(0, 5); // Top 5 patterns
}

function detectBenefitsPatterns(text: string, patterns: string[]): string[] {
  const detected: string[] = [];
  patterns.forEach(pattern => {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      detected.push(pattern);
    }
  });
  return detected.slice(0, 3); // Top 3 patterns
}

function detectLoyaltyPatterns(text: string, patterns: string[]): string[] {
  const detected: string[] = [];
  patterns.forEach(pattern => {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      detected.push(pattern);
    }
  });
  return detected.slice(0, 3); // Top 3 patterns
}

function detectInstabilityPatterns(text: string, patterns: string[]): string[] {
  const detected: string[] = [];
  patterns.forEach(pattern => {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      detected.push(pattern);
    }
  });
  return detected.slice(0, 3); // Top 3 patterns
}

function determineFriendshipQuality(scores: any, counts: any): 'excellent' | 'great' | 'good' | 'fair' | 'concerning' | 'poor' | 'toxic' {
  const avgScore = (scores.authenticity + scores.reciprocity + scores.loyalty + scores.stability) / 4;
  
  if (avgScore >= 80 && scores.benefits >= 60) {
    return 'excellent';
  }
  if (avgScore >= 65 && scores.benefits >= 50) {
    return 'great';
  }
  if (avgScore >= 50 && scores.benefits >= 40) {
    return 'good';
  }
  if (avgScore >= 35 && scores.benefits >= 30) {
    return 'fair';
  }
  if (avgScore >= 20 && scores.benefits >= 20) {
    return 'concerning';
  }
  if (avgScore >= 10) {
    return 'poor';
  }
  return 'toxic';
}

function selectFriendshipTitle(
  quality: any,
  isFake: boolean,
  isReal: boolean,
  isOneSided: boolean,
  isDraining: boolean
): string {
  const titles = FRIENDSHIP_TITLES;
  
  if (isFake) {
    return titles.fake[Math.floor(Math.random() * titles.fake.length)];
  }
  if (isOneSided) {
    return titles.unbalanced[Math.floor(Math.random() * titles.unbalanced.length)];
  }
  if (isDraining) {
    return titles.draining[Math.floor(Math.random() * titles.draining.length)];
  }
  
  // Otherwise, return based on quality
  const qualityTitles = titles[quality] || titles.good;
  return qualityTitles[Math.floor(Math.random() * qualityTitles.length)];
}

function selectFriendshipSubtitle(scores: any, quality: any, isFake: boolean, isOneSided: boolean): string {
  if (isFake) {
    return 'This person is not your real friend';
  }
  if (isOneSided) {
    if (scores.benefits > 50) {
      return 'You\'re doing all the work - are they your real friend?';
    }
    return 'This friendship is completely one-sided';
  }
  
  if (scores.benefits >= 60) {
    return 'This is genuinely one of your best friends';
  }
  if (scores.benefits >= 40) {
    return 'You have a good, supportive friend here';
  }
  return 'This friendship needs some work';
}

function selectFriendshipInsight(
  quality: any,
  isFake: boolean,
  isReal: boolean,
  isOneSided: boolean,
  isDraining: boolean,
  isSuperficial: boolean,
  isOpportunist: boolean,
  patterns: string[]
): string {
  const insights = FRIENDSHIP_INSIGHTS;
  
  if (isFake && isSuperficial) {
    return insights.superficial[Math.floor(Math.random() * insights.superficial.length)];
  }
  if (isOpportunist) {
    return insights.opportunistic[Math.floor(Math.random() * insights.opportunistic.length)];
  }
  if (isOneSided) {
    return insights.unbalanced[Math.floor(Math.random() * insights.unbalanced.length)];
  }
  if (isDraining) {
    return insights.draining[Math.floor(Math.random() * insights.draining.length)];
  }
  if (isReal) {
    return insights.genuine[Math.floor(Math.random() * insights.genuine.length)];
  }
  if (isFake) {
    return insights.fake[Math.floor(Math.random() * insights.fake.length)];
  }
  
  // Default to quality-based insight
  const qualityInsights = insights[quality] || insights.good;
  return qualityInsights[Math.floor(Math.random() * qualityInsights.length)];
}

function selectFriendshipAdvice(
  quality: any,
  isFake: boolean,
  isOneSided: boolean,
  isDraining: boolean,
  isOpportunist: boolean,
  isSuperficial: boolean,
  patterns: string[]
): string[] {
  const advice = FRIENDSHIP_ADVICE;
  
  if (isFake) {
    return advice.fake[Math.floor(Math.random() * advice.fake.length)];
  }
  if (isOneSided) {
    return advice.unbalanced[Math.floor(Math.random() * advice.unbalanced.length)];
  }
  if (isDraining) {
    return advice.draining[Math.floor(Math.random() * advice.draining.length)];
  }
  if (isOpportunist) {
    return advice.opportunistic[Math.floor(Math.random() * advice.opportunistic.length)];
  }
  if (isSuperficial) {
    return advice.superficial[Math.floor(Math.random() * advice.superficial.length)];
  }
  
  // Default to quality-based advice
  const qualityAdvice = advice[quality] || advice.good;
  return qualityAdvice[Math.floor(Math.random() * qualityAdvice.length)];
}

function selectFriendshipAura(quality: any, isReal: boolean, isFake: boolean, isToxic: boolean): 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'blue' | 'pink' {
  if (isToxic || quality === 'toxic') {
    return 'red';
  }
  if (isFake) {
    return 'orange';
  }
  if (quality === 'poor' || quality === 'concerning') {
    return 'yellow';
  }
  if (quality === 'fair') {
    return 'purple';
  }
  if (quality === 'good') {
    return 'blue';
  }
  if (quality === 'great') {
    return 'pink';
  }
  return 'green';
}

export { FriendshipAnalysis };
