import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { extractedText, analysisResult } = await request.json();

    // Use LLM to generate deep, dramatic relationship analysis
    const prompt = `Analyze this romantic relationship chat and provide a brutally honest, dramatic assessment:

CHAT TEXT:
${extractedText}

CURRENT ANALYSIS:
- Vibe Score: ${analysisResult.vibeScore}/100
- Persona: ${analysisResult.personaType}
- Communication Style: ${analysisResult.communicationStyle}
- Dry Texts: ${analysisResult.dryTextCount}
- Red Flags: ${analysisResult.redFlagCount}
- Investment: ${analysisResult.investmentBalance.analysis}
- Language: ${analysisResult.banglishDetected ? 'Banglish' : 'English'}

Provide a dramatic, emotionally charged analysis in JSON format with these exact fields:
{
  "burningQuestion": "One sharp, dramatic question that hits hard",
  "brutalTruth": "The raw truth about this relationship - be honest even if it hurts",
  "emotionalImpact": "How this relationship is actually affecting them emotionally",
  "personalityAnalysis": {
    "personA": "Deep personality insight about Person A",
    "personB": "Deep personality insight about Person B"
  },
  "relationshipForecast": "Where this is heading in 6 months",
  "breakupProbability": "Percentage (0-100) of likely breakup",
  "toxicityBreakdown": {
    "manipulation": "Percentage",
    "gaslighting": "Percentage", 
    "neglect": "Percentage",
    "disrespect": "Percentage"
  },
  "actionPlan": [
    "Step 1: What they need to do immediately",
    "Step 2: Important action to take",
    "Step 3: Final step for clarity"
  ],
  "hardPillsToSwallow": [
    "Hard truth 1",
    "Hard truth 2",
    "Hard truth 3"
  ]
}

IMPORTANT RULES:
1. Be BRUTALLY HONEST - don't sugarcoat
2. Make it DRAMATIC and EMOTIONAL
3. If there are red flags, be VERY explicit about danger
4. If score is below 40, tell them to BREAK UP
5. If it's toxic, use phrases like "emotional vampire," "master manipulator," "walking away from disaster"
6. If it's good, acknowledge genuine connection
7. Support BOTH English and Banglish contexts
8. Generate FRESH analysis - no repeated phrases
9. Make each insight UNIQUE to this specific chat
10. Include specific examples from chat text

Return ONLY valid JSON. No markdown, no explanations, just the JSON object.`;

    // Import LLM SDK
    const zAI = await import('z-ai-web-dev-sdk');
    const LLM = zAI.LLM;

    const llm = new LLM({
      apiKey: process.env.Z_AI_API_KEY || ''
    });

    const response = await llm.chat({
      messages: [
        {
          role: 'system',
          content: 'You are a brutally honest relationship expert who tells people the hard truths they need to hear. You are dramatic, direct, and emotionally intelligent. You can analyze both English and Banglish (Bengali written in English letters) relationships. Your analysis is unique for each conversation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9, // Higher temperature for more variety
      maxTokens: 1500
    });

    // Parse response
    let deepAnalysis;
    try {
      const responseText = typeof response === 'string' ? response : JSON.stringify(response);
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        deepAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback to basic structure if parsing fails
      deepAnalysis = {
        burningQuestion: 'What are you actually getting from this relationship?',
        brutalTruth: 'This relationship needs serious evaluation.',
        emotionalImpact: 'Unclear emotional dynamic.',
        personalityAnalysis: {
          personA: 'Needs more expression.',
          personB: 'Needs more engagement.'
        },
        relationshipForecast: 'Needs work.',
        breakupProbability: analysisResult.vibeScore < 40 ? 60 : 20,
        toxicityBreakdown: {
          manipulation: '20%',
          gaslighting: '10%',
          neglect: '30%',
          disrespect: '20%'
        },
        actionPlan: [
          'Communicate openly',
          'Set clear boundaries',
          'Evaluate honestly'
        ],
        hardPillsToSwallow: [
          'You deserve better',
          'Actions speak louder than words',
          'Love shouldn\'t be this hard'
        ]
      };
    }

    return NextResponse.json({ success: true, deepAnalysis });
  } catch (error) {
    console.error('Deep analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate deep analysis' },
      { status: 500 }
    );
  }
}
