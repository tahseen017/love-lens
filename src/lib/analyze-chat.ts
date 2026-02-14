import {
  AnalysisResult,
  AuraColor,
  BANGLISH_POSITIVE,
  BANGLISH_NEGATIVE,
  BANGLISH_DRY_RESPONSES,
  BANGLISH_RED_FLAGS,
  ENGLISH_POSITIVE,
  ENGLISH_NEGATIVE,
  ENGLISH_DRY_RESPONSES,
  ENGLISH_RED_FLAGS,
  DRAMATIC_TITLES,
  BANGLISH_TITLES,
  DRAMATIC_INSIGHTS,
  PERSONA_TYPES,
  COMMUNICATION_STYLES,
  ADVICE,
  RED_FLAG_MESSAGES,
  GREEN_FLAG_MESSAGES,
  GENDER_PRONOUNS,
  SPEAKER_PATTERNS
} from './sentiment-dictionary';

export interface ChatLine {
  text: string;
  isSender: boolean; // true = User (Right), false = Partner (Left)
}

interface SpeakerAnalysis {
  speaker1Label: string;
  speaker2Label: string;
  speaker1Words: number;
  speaker2Words: number;
  dominance: string;
  questionRatio: number;
  dryResponsesBySpeaker: { speaker1: number; speaker2: number };
  speaker1StartsConversations: number;
  speaker2StartsConversations: number;
  imbalance: number;
  responseLengths: number[];
}

function detectSpeakers(lines: string[], cleanText: string, isBanglish: boolean, linesData?: ChatLine[]): SpeakerAnalysis {
  console.log('[DEBUG] detectSpeakers called with', lines.length, 'lines');

  const speaker1Lines: string[] = [];
  const speaker2Lines: string[] = [];
  const responseLengths: number[] = [];
  const speaker1DryResponses = { count: 0, total: 0 };
  const speaker2DryResponses = { count: 0, total: 0 };

  let speaker1Words = 0;
  let speaker2Words = 0;
  let speaker1Questions = 0;
  let speaker2Questions = 0;
  let speaker1Starts = 0;
  let speaker2Starts = 0;

  // If we have visual line data, use it!
  if (linesData && linesData.length > 0) {
    console.log('[DEBUG] Using visual line data for speaker detection');

    linesData.forEach((lineObj) => {
      const trimmedLine = lineObj.text.trim();
      if (!trimmedLine) return;

      const wordCount = trimmedLine.split(/\s+/).filter(w => w.length > 0).length;
      const isQuestion = trimmedLine.includes('?') || trimmedLine.includes(' ki') || trimmedLine.includes(' kibhabe');

      // Speaker 1 = Partner (Left/False), Speaker 2 = User (Right/True)
      if (!lineObj.isSender) {
        // Speaker 1 (Partner)
        speaker1Lines.push(trimmedLine);
        speaker1Words += wordCount;
        if (isNewConversationStart(trimmedLine)) speaker1Starts++;
        if (isDryResponse(trimmedLine, isBanglish)) {
          speaker1DryResponses.count++;
          speaker1DryResponses.total++;
        }
        speaker1DryResponses.total++;
        if (isQuestion) speaker1Questions++;
      } else {
        // Speaker 2 (User)
        speaker2Lines.push(trimmedLine);
        speaker2Words += wordCount;
        responseLengths.push(wordCount);
        if (isNewConversationStart(trimmedLine)) speaker2Starts++;
        if (isDryResponse(trimmedLine, isBanglish)) {
          speaker2DryResponses.count++;
          speaker2DryResponses.total++;
        }
        speaker2DryResponses.total++;
        if (isQuestion) speaker2Questions++;
      }
    });
  } else {
    // Fallback to alternating assumption (Legacy)
    console.warn('[WARN] No visual data, falling back to alternating assumption');
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const wordCount = trimmedLine.split(/\s+/).filter(w => w.length > 0).length;
      const isQuestion = trimmedLine.includes('?') || trimmedLine.includes(' ki') || trimmedLine.includes(' kibhabe');

      if (index % 2 === 0) {
        speaker1Lines.push(trimmedLine);
        speaker1Words += wordCount;
        if (isNewConversationStart(trimmedLine)) speaker1Starts++;
        if (isDryResponse(trimmedLine, isBanglish)) {
          speaker1DryResponses.count++;
          speaker1DryResponses.total++;
        }
        speaker1DryResponses.total++;
        if (isQuestion) speaker1Questions++;
      } else {
        speaker2Lines.push(trimmedLine);
        speaker2Words += wordCount;
        responseLengths.push(wordCount);
        if (isNewConversationStart(trimmedLine)) speaker2Starts++;
        if (isDryResponse(trimmedLine, isBanglish)) {
          speaker2DryResponses.count++;
          speaker2DryResponses.total++;
        }
        speaker2DryResponses.total++;
        if (isQuestion) speaker2Questions++;
      }
    });
  }

  console.log('[DEBUG] Speaker counts:', speaker1Words, speaker2Words);

  const speaker1Text = speaker1Lines.join(' ').toLowerCase();
  const speaker2Text = speaker2Lines.join(' ').toLowerCase();

  const totalWords = speaker1Words + speaker2Words;
  const speaker1Ratio = totalWords > 0 ? speaker1Words / totalWords : 0.5;
  const speaker2Ratio = totalWords > 0 ? speaker2Words / totalWords : 0.5;
  const imbalance = speaker1Ratio - speaker2Ratio;

  let dominance = 'Balanced';
  if (Math.abs(imbalance) > 0.3) {
    dominance = speaker1Ratio > speaker2Ratio ? 'They dominate' : 'You dominate';
  } else if (Math.abs(imbalance) > 0.2) {
    dominance = speaker1Ratio > speaker2Ratio ? 'They are more invested' : 'You are more invested';
  }

  // Speaker 1 = Partner (Them), Speaker 2 = User (You)
  const speaker1Label = 'Them';
  const speaker2Label = 'You';

  console.log('[DEBUG] Speaker analysis complete:', { speaker1Label, speaker2Label, dominance });

  return {
    speaker1Label,
    speaker2Label,
    speaker1Words,
    speaker2Words,
    dominance,
    questionRatio: totalWords > 0 ? (speaker1Questions + speaker2Questions) / lines.length : 0,
    responseLengths,
    imbalance,
    speaker1StartsConversations: speaker1Starts,
    speaker2StartsConversations: speaker2Starts,
    dryResponsesBySpeaker: {
      speaker1: speaker1DryResponses.total > 0 ? Math.round((speaker1DryResponses.count / speaker1DryResponses.total) * 100) : 0,
      speaker2: speaker2DryResponses.total > 0 ? Math.round((speaker2DryResponses.count / speaker2DryResponses.total) * 100) : 0
    }
  };
}

function isNewConversationStart(line: string): boolean {
  const lowerLine = line.toLowerCase();
  const starters = [
    'hi', 'hello', 'hey', 'good morning', 'good evening', 'good night',
    'ki khabor', 'ki obostha', 'kemon acho',
    'asa', 'asbo', 'kemon achen', 'how are you',
    'oi', 'oy', 'hello', 'oi kemon', 'oy kemon'
  ];

  return starters.some(start => lowerLine.startsWith(start));
}

function isDryResponse(line: string, isBanglish: boolean): boolean {
  const lowerLine = line.toLowerCase();
  const allDryResponses = [...ENGLISH_DRY_RESPONSES, ...BANGLISH_DRY_RESPONSES];

  return allDryResponses.some(response => {
    const regex = new RegExp(`\\b${response.toLowerCase()}\\b`, 'gi');
    return regex.test(lowerLine);
  }) && line.split(/\s+/).length <= 5;
}

// detectGender function removed

function createSpeakerLabel(baseLabel: string, gender: string, isDominant: boolean): string {
  // This function is now simplified as we hardcode 'You' vs 'Them'
  return baseLabel;
}

export function analyzeChatText(text: string, linesData?: ChatLine[]): AnalysisResult {
  console.log('[DEBUG] analyzeChatText called with', text.length, 'characters');

  const cleanText = text.toLowerCase().trim();
  const lines = text.split(/\n/).filter(l => l.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);

  if (lines.length === 0 || words.length === 0) {
    console.log('[DEBUG] No text found, using mock result');
    return getMockResult();
  }

  console.log('[DEBUG] Processing', lines.length, 'lines,', words.length, 'words');

  const languageDetection = detectLanguage(cleanText);
  const { isBanglish, dominantLanguage } = languageDetection;
  console.log('[DEBUG] Language detected:', isBanglish, dominantLanguage);

  const speakerAnalysis = detectSpeakers(lines, cleanText, isBanglish, linesData);
  console.log('[DEBUG] Speaker analysis complete');

  const sentimentCounts = countSentimentKeywords(cleanText, isBanglish);
  console.log('[DEBUG] Sentiment counts:', sentimentCounts);

  const patternAnalysis = analyzePatterns(text, lines, words);
  console.log('[DEBUG] Pattern analysis complete');

  const emojiAnalysis = analyzeEmojis(text);
  const punctuationAnalysis = analyzePunctuation(text);

  const dryTextCount = countDryResponses(cleanText, isBanglish);
  const redFlagAnalysis = detectRedFlags(cleanText, isBanglish);
  console.log('[DEBUG] Dry responses:', dryTextCount, 'Red flags:', redFlagAnalysis.count);

  const investmentBalance = analyzeInvestment(lines, words, speakerAnalysis);
  console.log('[DEBUG] Investment balance:', investmentBalance);

  const conversationFlow = analyzeConversationFlow(lines, speakerAnalysis, patternAnalysis);
  console.log('[DEBUG] Conversation flow:', conversationFlow);

  const positivity = sentimentCounts.positive / Math.max(1, sentimentCounts.positive + sentimentCounts.negative);
  const dryPenalty = Math.min(dryTextCount * 8, 40);
  const redFlagPenalty = redFlagAnalysis.count * 25;
  const consistencyBonus = patternAnalysis.consistency ? 10 : -5;
  const responseTimePenalty = patternAnalysis.imbalancedResponses ? -15 : 0;
  const emojiBonus = emojiAnalysis.heartCount * 3 + emojiAnalysis.loveEmojiCount * 5;
  const questionBonus = punctuationAnalysis.questionRatio > 0.2 ? 5 : 0;
  const exclamationBonus = punctuationAnalysis.exclamationCount > 5 ? 3 : 0;
  const flowBonus = conversationFlow.score * 10;

  let vibeScore = Math.round(
    (positivity * 60) +
    consistencyBonus +
    emojiBonus +
    questionBonus +
    exclamationBonus +
    flowBonus -
    dryPenalty -
    redFlagPenalty +
    responseTimePenalty
  );

  vibeScore = Math.max(0, Math.min(100, vibeScore));
  console.log('[DEBUG] Final vibe score:', vibeScore);

  const { auraColor, category } = determineAuraAndCategory(vibeScore, redFlagAnalysis.count, isBanglish, speakerAnalysis);
  console.log('[DEBUG] Aura and category:', auraColor, category);

  const uniqueSignature = generateUniqueSignature(
    vibeScore,
    dryTextCount,
    redFlagAnalysis.count,
    investmentBalance,
    patternAnalysis,
    emojiAnalysis,
    speakerAnalysis
  );
  console.log('[DEBUG] Unique signature:', uniqueSignature);

  const title = selectTitle(isBanglish, category, dominantLanguage);
  const subtitle = selectSubtitle(vibeScore, category, isBanglish);
  const dramaticInsight = selectInsight(category, vibeScore, redFlagAnalysis.count, speakerAnalysis);
  const advice = selectAdvice(category, vibeScore, speakerAnalysis);
  const personaType = selectPersonaType(category);
  const communicationStyle = selectCommunicationStyle(patternAnalysis, vibeScore, conversationFlow);
  const authenticityScore = calculateAuthenticity(
    sentimentCounts,
    patternAnalysis,
    dryTextCount,
    vibeScore,
    speakerAnalysis
  );
  const trustLevel = calculateTrustLevel(
    redFlagAnalysis.count,
    patternAnalysis.consistency,
    sentimentCounts,
    speakerAnalysis
  );
  const longTermPotential = calculateLongTermPotential(
    vibeScore,
    investmentBalance.imbalanceRatio,
    patternAnalysis,
    conversationFlow
  );
  const personalityMatch = determinePersonalityMatch(
    patternAnalysis,
    investmentBalance,
    vibeScore,
    speakerAnalysis
  );
  const redFlags = selectSpecificFlags(redFlagAnalysis.detectedFlags, true);
  const greenFlags = selectSpecificFlags(patternAnalysis.greenFlags, false);
  const toxicityLevel = calculateToxicityLevel(
    redFlagAnalysis.count,
    sentimentCounts.negative,
    vibeScore,
    speakerAnalysis
  );

  console.log('[DEBUG] Analysis complete, returning result');

  return {
    vibeScore,
    title,
    subtitle,
    auraColor,
    personaType,
    dramaticInsight,
    advice,
    simpScore: investmentBalance.summary,
    dryTextCount,
    redFlagCount: redFlagAnalysis.count,
    toxicityLevel,
    investmentBalance: {
      personA: investmentBalance.personA,
      personB: investmentBalance.personB,
      analysis: investmentBalance.analysis,
      speakerAnalysis: {
        speaker1: speakerAnalysis.speaker1Label,
        speaker2: speakerAnalysis.speaker2Label,
        dominance: speakerAnalysis.dominance
      }
    },
    communicationStyle,
    authenticityScore,
    trustLevel,
    longTermPotential,
    personalityMatch,
    redFlags,
    greenFlags,
    uniqueSignature,
    banglishDetected: isBanglish,
    dominantLanguage,
    conversationFlow: conversationFlow.description
  };
}

function getMockResult(): AnalysisResult {
  return {
    vibeScore: 75,
    title: 'Test Result - Upload to Analyze',
    subtitle: 'Your chat screenshot will be analyzed',
    auraColor: 'purple',
    personaType: 'Testing',
    dramaticInsight: 'This is a test result. Upload a real chat for analysis.',
    advice: ['Upload a chat screenshot', 'Click analyze button', 'See results'],
    simpScore: '50/50 - Test mode',
    dryTextCount: 0,
    redFlagCount: 0,
    toxicityLevel: 25,
    investmentBalance: {
      personA: 50,
      personB: 50,
      analysis: 'Test mode - Balanced',
      speakerAnalysis: {
        speaker1: 'Speaker 1',
        speaker2: 'Speaker 2',
        dominance: 'Balanced'
      }
    },
    communicationStyle: 'Test Mode',
    authenticityScore: 50,
    trustLevel: 50,
    longTermPotential: 50,
    personalityMatch: {
      personA: 'Test Speaker A',
      personB: 'Test Speaker B',
      compatibility: 'Test Compatibility'
    },
    redFlags: [],
    greenFlags: ['Test Mode', 'Ready for Upload'],
    uniqueSignature: 'TEST-TEST-75',
    banglishDetected: false,
    dominantLanguage: 'Test',
    conversationFlow: 'Test mode active'
  };
}

function detectLanguage(text: string): { isBanglish: boolean; dominantLanguage: string } {
  const banglishWords = BANGLISH_POSITIVE.filter(word => text.includes(word));
  const englishWords = ENGLISH_POSITIVE.filter(word => text.includes(word));

  const banglishRatio = banglishWords.length / Math.max(1, banglishWords.length + englishWords.length);
  const isBanglish = banglishRatio >= 0.3 || !!text.match(/['\u200B-\u200D\uFEFF]/);

  const dominantLanguage = isBanglish ? 'Banglish' : 'English';
  return { isBanglish, dominantLanguage };
}

function countSentimentKeywords(text: string, isBanglish: boolean): {
  positive: number;
  negative: number;
} {
  let positiveCount = 0;
  let negativeCount = 0;

  const allPositive = [...ENGLISH_POSITIVE, ...BANGLISH_POSITIVE];
  const allNegative = [...ENGLISH_NEGATIVE, ...BANGLISH_NEGATIVE];

  allPositive.forEach(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = text.match(regex);
    if (matches) positiveCount += matches.length;
  });

  allNegative.forEach(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = text.match(regex);
    if (matches) negativeCount += matches.length;
  });

  return { positive: positiveCount, negative: negativeCount };
}

function analyzePatterns(text: string, lines: string[], words: string[]): {
  consistency: boolean;
  imbalancedResponses: boolean;
  repetitionScore: number;
  questionRatio: number;
  greenFlags: string[];
} {
  let consistency = true;
  let imbalancedResponses = false;
  let repetitionScore = 0;
  let questionCount = 0;
  const greenFlags: string[] = [];

  const lineLengths = lines.map(l => l.trim().length);
  const avgLength = lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length;
  const variance = lineLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / lineLengths.length;
  consistency = variance < avgLength * 2;

  const shortResponses = lineLengths.filter(l => l < 10).length;
  const longResponses = lineLengths.filter(l => l > 30).length;
  imbalancedResponses = Math.abs(shortResponses - longResponses) > lines.length * 0.3;

  const uniqueWords = new Set(words);
  repetitionScore = words.length / Math.max(1, uniqueWords.size);

  questionCount = (text.match(/\?/g) || []).length;
  const questionRatio = questionCount / Math.max(1, lines.length);

  if (questionRatio > 0.15) greenFlags.push('Asks questions - shows interest');
  if (consistency) greenFlags.push('Consistent communication');
  if (repetitionScore < 2.5) greenFlags.push('Varied vocabulary - not repetitive');
  if (!imbalancedResponses) greenFlags.push('Balanced conversation flow');

  return {
    consistency,
    imbalancedResponses,
    repetitionScore,
    questionRatio,
    greenFlags
  };
}

function analyzeEmojis(text: string): {
  heartCount: number;
  loveEmojiCount: number;
  laughingEmojiCount: number;
  sadEmojiCount: number;
  angryEmojiCount: number;
  emojiDiversity: number;
} {
  const heartEmojis = /❤️|💕|💖|💗|💓|💞|💝|💘|❤|♥/g;
  const loveEmojis = /💑|👩‍❤️‍👨|👩‍❤️‍💋‍👨|💋|💘|🌹|💑/g;
  const laughingEmojis = /😂|🤣|😄|😆|😁|😊|😃|🙂|😌|😜/g;
  const sadEmojis = /😢|😭|😞|😔|☹️|😣|😖|😫|😩|😤|😠|😡/g;
  const angryEmojis = /😠|😡|🤬|😾|💢|👿|😈|💣|🔥|💀/g;

  const heartCount = (text.match(heartEmojis) || []).length;
  const loveEmojiCount = (text.match(loveEmojis) || []).length;
  const laughingEmojiCount = (text.match(laughingEmojis) || []).length;
  const sadEmojiCount = (text.match(sadEmojis) || []).length;
  const angryEmojiCount = (text.match(angryEmojis) || []).length;

  const allEmojis = text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{1FA00}-\u{1FA6F}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || [];
  const uniqueEmojis = new Set(allEmojis);
  const emojiDiversity = allEmojis.length > 0 ? uniqueEmojis.size / allEmojis.length : 0;

  return {
    heartCount,
    loveEmojiCount,
    laughingEmojiCount,
    sadEmojiCount,
    angryEmojiCount,
    emojiDiversity
  };
}

function analyzePunctuation(text: string): {
  exclamationCount: number;
  questionCount: number;
  ellipsisCount: number;
  questionRatio: number;
} {
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const ellipsisCount = (text.match(/\.\.\./g) || []).length;
  const questionRatio = questionCount / Math.max(1, text.split('\n').length);

  return { exclamationCount, questionCount, ellipsisCount, questionRatio };
}

function countDryResponses(text: string, isBanglish: boolean): number {
  let count = 0;
  const allDryResponses = [...ENGLISH_DRY_RESPONSES, ...BANGLISH_DRY_RESPONSES];

  allDryResponses.forEach(response => {
    const regex = new RegExp(`\\b${response}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });

  return count;
}

function detectRedFlags(text: string, isBanglish: boolean): {
  count: number;
  severity: number;
  detectedFlags: string[];
} {
  let count = 0;
  const detectedFlags: string[] = [];
  let severityScore = 0;

  const allRedFlags = [...ENGLISH_RED_FLAGS, ...BANGLISH_RED_FLAGS];

  allRedFlags.forEach(flag => {
    if (text.toLowerCase().includes(flag.toLowerCase())) {
      count++;
      detectedFlags.push(flag);
      if (flag.includes('break') || flag.includes('leave') || flag.includes('toxic') || flag.includes('ses')) {
        severityScore += 3;
      } else if (flag.includes('manipulate') || flag.includes('control') || flag.includes('gaslight')) {
        severityScore += 2;
      } else {
        severityScore += 1;
      }
    }
  });

  return { count, severity: severityScore, detectedFlags };
}

function analyzeInvestment(lines: string[], words: string[], speakerAnalysis: SpeakerAnalysis): {
  personA: number;
  personB: number;
  summary: string;
  imbalanceRatio: number;
  analysis: string;
} {
  const personAWords = speakerAnalysis.speaker1Words;
  const personBWords = speakerAnalysis.speaker2Words;

  const totalWords = personAWords + personBWords;
  const personARatio = totalWords > 0 ? personAWords / totalWords : 0.5;
  const personBRatio = totalWords > 0 ? personBWords / totalWords : 0.5;

  const imbalanceRatio = Math.abs(personARatio - personBRatio);

  let summary = 'Balanced effort';
  let analysis = 'Both are equally invested';

  if (imbalanceRatio > 0.3) {
    const moreInvested = personARatio > personBRatio ? 'Speaker 1' : 'Speaker 2';
    const percentage = Math.round(Math.abs(personARatio - personBRatio) * 100);
    summary = `${moreInvested} is ${percentage}% more invested`;
    analysis = `${moreInvested} is carrying this conversation`;
  } else if (imbalanceRatio > 0.2) {
    const moreInvested = personARatio > personBRatio ? 'Speaker 1' : 'Speaker 2';
    summary = `${moreInvested} is trying harder`;
    analysis = `${moreInvested} shows more interest`;
  } else {
    const person1Label = speakerAnalysis.speaker1Label;
    const person2Label = speakerAnalysis.speaker2Label;
    analysis = `${person1Label} and ${person2Label} have balanced communication`;
  }

  console.log('[DEBUG] Investment balance:', { personA: personARatio, personB: personBRatio });

  return {
    personA: Math.round(personARatio * 100),
    personB: Math.round(personBRatio * 100),
    summary,
    imbalanceRatio,
    analysis
  };
}

function analyzeConversationFlow(lines: string[], speakerAnalysis: SpeakerAnalysis, patternAnalysis: any): {
  score: number;
  description: string;
} {
  let score = 0;
  const issues: string[] = [];
  const positives: string[] = [];

  const isAlternating = Math.abs(speakerAnalysis.imbalance) >= -0.2 && Math.abs(speakerAnalysis.imbalance) <= 0.2;

  if (isAlternating) {
    score += 0.3;
    positives.push('Balanced turn-taking');
  } else {
    score -= 0.2;
    issues.push('Imbalanced turn-taking');
  }

  if (speakerAnalysis.questionRatio > 0.15) {
    score += 0.2;
    positives.push('Shows interest with questions');
  }

  const avgDryResponseRate = (speakerAnalysis.dryResponsesBySpeaker.speaker1 + speakerAnalysis.dryResponsesBySpeaker.speaker2) / 2;
  if (avgDryResponseRate > 40) {
    score -= 0.3;
    issues.push('High dry response rate');
  } else if (avgDryResponseRate < 20) {
    score += 0.2;
    positives.push('Low dry response rate');
  }

  if (patternAnalysis.consistency) {
    score += 0.2;
    positives.push('Consistent engagement');
  } else {
    score -= 0.2;
    issues.push('Inconsistent communication');
  }

  if (speakerAnalysis.imbalance < -0.3 || speakerAnalysis.imbalance > 0.3) {
    score -= 0.2;
    issues.push('Severe power imbalance');
  }

  score = Math.max(-1, Math.min(1, score));

  let description = '';
  if (score > 0.5) {
    description = 'Healthy Flow: Balanced, engaging, mutual interest';
  } else if (score > 0) {
    description = `Good Flow: Generally balanced. ${issues.length > 0 ? issues[0] : ''}`;
  } else if (score > -0.5) {
    description = `Unhealthy Flow: ${issues[0] || 'Imbalanced'}`;
  } else {
    description = 'Toxic Flow: Severely imbalanced, one-sided, damaging';
  }

  console.log('[DEBUG] Conversation flow:', score, description);

  return { score, description };
}

function determineAuraAndCategory(vibeScore: number, redFlagCount: number, isBanglish: boolean, speakerAnalysis: SpeakerAnalysis): {
  auraColor: AuraColor;
  category: string;
} {
  const severeImbalance = Math.abs(speakerAnalysis.imbalance) > 0.4;

  if (redFlagCount >= 4 || severeImbalance) {
    return { auraColor: 'red', category: 'critical' };
  }
  if (redFlagCount >= 2 || Math.abs(speakerAnalysis.imbalance) > 0.3) {
    return { auraColor: 'orange', category: 'critical' };
  }

  if (vibeScore >= 80) {
    return { auraColor: 'pink', category: 'high' };
  }
  if (vibeScore >= 60) {
    return { auraColor: 'purple', category: 'medium_high' };
  }
  if (vibeScore >= 40) {
    return { auraColor: 'blue', category: 'medium' };
  }
  if (vibeScore >= 20) {
    return { auraColor: 'grey', category: 'low' };
  }

  return { auraColor: 'red', category: 'critical' };
}

function selectTitle(isBanglish: boolean, category: string, dominantLanguage: string): string {
  const titles = isBanglish ? BANGLISH_TITLES : DRAMATIC_TITLES;
  const categoryTitles = titles[category as keyof typeof titles];

  const randomIndex = Math.floor(Math.random() * categoryTitles.length);
  const selectedTitle = categoryTitles[randomIndex];

  console.log('[DEBUG] Selected title:', selectedTitle);
  return selectedTitle;
}

function selectSubtitle(vibeScore: number, category: string, isBanglish: boolean): string {
  const subtitles: Record<string, string[]> = {
    high: [
      'Your connection is truly special',
      'This love is one in a million',
      'You\'ve found something rare'
    ],
    medium_high: [
      'Strong foundation for love',
      'Potential for something beautiful',
      'Keep nurturing this bond'
    ],
    medium: [
      'Time to define the relationship',
      'One-sided or misunderstood',
      'Communication is key'
    ],
    low: [
      'You deserve better than this',
      'Not the love you\'re looking for',
      'Time to move on'
    ],
    critical: [
      'This is toxic - get out now',
      'They\'re playing games with you',
      'Protect yourself and leave'
    ]
  };

  const categorySubtitles = subtitles[category as keyof typeof subtitles];
  const randomIndex = Math.floor(Math.random() * categorySubtitles.length);

  console.log('[DEBUG] Selected subtitle:', categorySubtitles[randomIndex]);
  return categorySubtitles[randomIndex];
}

function selectInsight(category: string, vibeScore: number, redFlagCount: number, speakerAnalysis: SpeakerAnalysis): string {
  const insights = DRAMATIC_INSIGHTS[category as keyof typeof DRAMATIC_INSIGHTS];

  if (category === 'critical' && redFlagCount >= 2) {
    if (Math.abs(speakerAnalysis.imbalance) > 0.3) {
      const dominantSpeaker = speakerAnalysis.speaker1Words > speakerAnalysis.speaker2Words ?
        `${speakerAnalysis.speaker1Label}` :
        `${speakerAnalysis.speaker2Label}`;
      const randomIndex = Math.floor(Math.random() * 3);
      const insightWithSpeaker = insights[randomIndex] + `. ${dominantSpeaker} does all the talking. This isn't a conversation - it's a monologue with an audience.`;
      console.log('[DEBUG] Speaker-aware insight generated');
      return insightWithSpeaker;
    }
    return insights[Math.floor(Math.random() * 3)];
  }

  const randomIndex = Math.floor(Math.random() * insights.length);
  const selectedInsight = insights[randomIndex];

  console.log('[DEBUG] Selected insight:', selectedInsight);
  return selectedInsight;
}

function selectAdvice(category: string, vibeScore: number, speakerAnalysis: SpeakerAnalysis): string[] {
  const advice = ADVICE[category as keyof typeof ADVICE];

  let speakerAdvice: string[] = [];
  if (Math.abs(speakerAnalysis.imbalance) > 0.3) {
    const dominantSpeaker = speakerAnalysis.speaker1Words > speakerAnalysis.speaker2Words ? 'Speaker 1' : 'Speaker 2';
    const passiveSpeaker = speakerAnalysis.speaker1Words > speakerAnalysis.speaker2Words ? 'Speaker 2' : 'Speaker 1';
    speakerAdvice = [
      `${dominantSpeaker} needs to listen more and stop dominating conversation`,
      `${passiveSpeaker} needs to speak up and express themselves`,
      'This power imbalance is unsustainable - address it now'
    ];
  }

  const shuffled = [...advice, ...speakerAdvice].sort(() => Math.random() - 0.5);
  const selectedAdvice = shuffled.slice(0, 3);

  console.log('[DEBUG] Selected advice:', selectedAdvice);
  return selectedAdvice;
}

function selectPersonaType(category: string): string {
  const personas = PERSONA_TYPES[category as keyof typeof PERSONA_TYPES];
  const randomIndex = Math.floor(Math.random() * personas.length);

  console.log('[DEBUG] Selected persona:', personas[randomIndex]);
  return personas[randomIndex];
}

function selectCommunicationStyle(patternAnalysis: any, vibeScore: number, conversationFlow: any): string {
  if (patternAnalysis.consistency && vibeScore > 60) {
    return 'Passionate & Expressive';
  }
  if (patternAnalysis.imbalancedResponses) {
    return 'One-Sided Imbalance';
  }
  if (vibeScore < 40) {
    return 'Dry & Uninvested';
  }
  if (conversationFlow.score < -0.3) {
    return 'Toxic & Manipulative';
  }

  const randomIndex = Math.floor(Math.random() * COMMUNICATION_STYLES.length);

  console.log('[DEBUG] Selected communication style:', COMMUNICATION_STYLES[randomIndex]);
  return COMMUNICATION_STYLES[randomIndex];
}

function calculateAuthenticity(
  sentimentCounts: { positive: number; negative: number },
  patternAnalysis: any,
  dryTextCount: number,
  vibeScore: number,
  speakerAnalysis: SpeakerAnalysis
): number {
  let score = 50;

  if (sentimentCounts.positive > 0 && sentimentCounts.negative > 0) {
    score += 20;
  }

  if (patternAnalysis.consistency) {
    score += 15;
  }

  if (dryTextCount > patternAnalysis.questionRatio * 10) {
    score -= 25;
  }

  if (vibeScore > 70) {
    score += 10;
  }

  if (Math.abs(speakerAnalysis.imbalance) < 0.2) {
    score += 10;
  } else if (Math.abs(speakerAnalysis.imbalance) > 0.4) {
    score -= 15;
  }

  console.log('[DEBUG] Authenticity score:', score);
  return Math.max(0, Math.min(100, score));
}

function calculateTrustLevel(
  redFlagCount: number,
  consistency: boolean,
  sentimentCounts: { positive: number; negative: number },
  speakerAnalysis: SpeakerAnalysis
): number {
  let score = 50;

  score -= redFlagCount * 15;
  if (consistency) {
    score += 15;
  }

  if (sentimentCounts.negative < sentimentCounts.positive / 2) {
    score += 10;
  }

  if (Math.abs(speakerAnalysis.imbalance) < 0.2) {
    score += 10;
  } else if (Math.abs(speakerAnalysis.imbalance) > 0.4) {
    score -= 15;
  }

  console.log('[DEBUG] Trust level score:', score);
  return Math.max(0, Math.min(100, score));
}

function calculateLongTermPotential(
  vibeScore: number,
  imbalanceRatio: number,
  patternAnalysis: any,
  conversationFlow: any
): number {
  let score = vibeScore * 0.5;

  if (imbalanceRatio > 0.3) {
    score -= 20;
  }

  if (patternAnalysis.consistency) {
    score += 15;
  }

  if (patternAnalysis.questionRatio > 0.1) {
    score += 10;
  }

  score += conversationFlow.score * 10;

  console.log('[DEBUG] Long term potential score:', score);
  return Math.max(0, Math.min(100, score));
}

function determinePersonalityMatch(
  patternAnalysis: any,
  investmentBalance: any,
  vibeScore: number,
  speakerAnalysis: SpeakerAnalysis
): {
  personA: string;
  personB: string;
  compatibility: string;
} {
  const personATypes = [
    'Expressive & Caring',
    'Thoughtful & Deep',
    'Casual & Relaxed',
    'Intense & Passionate',
    'Reserved & Observant',
    'Dominant & Direct',
    'Supportive & Kind',
    'Shy & Quiet',
    'Playful & Fun'
  ];

  const personBTypes = [
    'Supportive & Kind',
    'Analytical & Smart',
    'Fun & Spontaneous',
    'Serious & Committed',
    'Laid-back & Easygoing',
    'Emotional & Expressive',
    'Protective & Loyal',
    'Independent & Strong',
    'Creative & Artistic',
    'Rational & Logical'
  ];

  const compatibilities = [
    'Highly Compatible',
    'Good Match',
    'Some Differences',
    'Learning Curve',
    'Challenging Dynamic'
  ];

  const personAIndex = Math.floor(Math.random() * personATypes.length);
  const personBIndex = Math.floor(Math.random() * personBTypes.length);

  let compatibilityIndex = 2;
  if (vibeScore > 70 && patternAnalysis.consistency) {
    compatibilityIndex = 0;
  } else if (vibeScore > 50) {
    compatibilityIndex = 1;
  } else if (investmentBalance.imbalanceRatio > 0.4) {
    compatibilityIndex = 4;
  }

  console.log('[DEBUG] Personality match:', { personA: personATypes[personAIndex], personB: personBTypes[personBIndex], compatibility: compatibilities[compatibilityIndex] });
  return {
    personA: personATypes[personAIndex],
    personB: personBTypes[personBIndex],
    compatibility: compatibilities[compatibilityIndex]
  };
}

function selectSpecificFlags(detectedFlags: string[], isRed: boolean): string[] {
  if (isRed) {
    return detectedFlags.slice(0, 3);
  } else {
    return GREEN_FLAG_MESSAGES.slice(0, 3);
  }
}

function calculateToxicityLevel(
  redFlagCount: number,
  negativeSentiment: number,
  vibeScore: number,
  speakerAnalysis: SpeakerAnalysis
): number {
  let toxicity = redFlagCount * 20;
  toxicity += negativeSentiment * 2;
  if (vibeScore < 30) {
    toxicity += 20;
  }
  if (Math.abs(speakerAnalysis.imbalance) > 0.4) {
    toxicity += 15;
  }

  console.log('[DEBUG] Toxicity level:', toxicity);
  return Math.min(100, Math.max(0, toxicity));
}

function generateUniqueSignature(
  vibeScore: number,
  dryTextCount: number,
  redFlagCount: number,
  investmentBalance: any,
  patternAnalysis: any,
  emojiAnalysis: any,
  speakerAnalysis: SpeakerAnalysis
): string {
  const factors = [
    vibeScore,
    dryTextCount,
    redFlagCount,
    investmentBalance.imbalanceRatio,
    patternAnalysis.repetitionScore,
    emojiAnalysis.emojiDiversity,
    patternAnalysis.questionRatio,
    speakerAnalysis.imbalance
  ];

  const hash = factors.reduce((acc, val, index) => {
    return acc + (val * (index + 1) * 17);
  }, 0);

  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');

  console.log('[DEBUG] Generated signature:', `LOVE-${hexHash}-${vibeScore}`);
  return `LOVE-${hexHash}-${vibeScore}`;
}

export function getAuraGradient(auraColor: AuraColor): string {
  const gradients = {
    pink: 'radial-gradient(circle, rgba(255,105,180,0.8) 0%, rgba(199,21,133,0.6) 50%, rgba(139,0,139,0.3) 100%)',
    blue: 'radial-gradient(circle, rgba(65,105,225,0.8) 0%, rgba(30,144,255,0.6) 50%, rgba(0,0,139,0.3) 100%)',
    grey: 'radial-gradient(circle, rgba(128,128,128,0.8) 0%, rgba(105,105,105,0.6) 50%, rgba(47,79,79,0.3) 100%)',
    orange: 'radial-gradient(circle, rgba(255,140,0,0.9) 0%, rgba(255,69,0,0.7) 50%, rgba(139,0,0,0.4) 100%)',
    purple: 'radial-gradient(circle, rgba(147,112,219,0.8) 0%, rgba(138,43,226,0.6) 50%, rgba(75,0,130,0.3) 100%)',
    red: 'radial-gradient(circle, rgba(255,0,0,0.95) 0%, rgba(220,20,60,0.8) 50%, rgba(139,0,0,0.5) 100%)',
    yellow: 'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,165,0,0.7) 50%, rgba(184,134,11,0.4) 100%)'
  };

  return gradients[auraColor] || gradients.purple;
}

export function getAuraGlowColor(auraColor: AuraColor): string {
  const glows = {
    pink: 'rgba(255,105,180,0.6)',
    blue: 'rgba(65,105,225,0.6)',
    grey: 'rgba(128,128,128,0.6)',
    orange: 'rgba(255,140,0,0.8)',
    purple: 'rgba(147,112,219,0.6)',
    red: 'rgba(255,0,0,0.9)',
    yellow: 'rgba(255,215,0,0.9)'
  };

  return glows[auraColor] || glows.purple;
}
