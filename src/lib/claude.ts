import Anthropic from '@anthropic-ai/sdk';
import type { IntakeData, EligibilityResult } from '../types';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ActionPlan {
  summary: string;
  legalSteps: string[];
  workforceSteps: string[];
  resumeSummary: string;
  interviewScript: string;
  suggestedRoles: string[];
  timeline: string;
}

export async function generateActionPlan(
  intake: IntakeData,
  eligibility: EligibilityResult
): Promise<ActionPlan> {
  const ruleContext = eligibility.rule
    ? `Process: ${eligibility.rule.process}. Timeline: ${eligibility.rule.timeline}. Fee: ${eligibility.rule.fee}.`
    : 'No exact rule found — general guidance applies.';

  const prompt = `You are a compassionate legal workforce assistant for SecondPath, helping someone navigate record relief and employment.

User profile:
- State: ${intake.state}, County: ${intake.county}
- Offense type: ${intake.offenseType}
- Completed sentence: ${intake.yearCompleted} (${eligibility.yearsWaited} years ago)
- Employment goal: ${intake.employmentGoal}
- Skills: ${intake.skills || 'Not provided'}
- Eligibility status: ${eligibility.status === 'eligible' ? 'Likely eligible for record relief' : 'Needs further review'}
- ${ruleContext}

Generate a personalized Second Path Plan. Return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence empathetic overview of their situation and path forward",
  "legalSteps": ["step 1", "step 2", "step 3", "step 4"],
  "workforceSteps": ["step 1", "step 2", "step 3"],
  "resumeSummary": "2-3 sentence professional resume summary they can use",
  "interviewScript": "2-3 sentence script for explaining their background to employers",
  "suggestedRoles": ["Role 1", "Role 2", "Role 3", "Role 4", "Role 5"],
  "timeline": "Realistic timeline summary in 1-2 sentences"
}

Keep tone hopeful, practical, and professional. Do not provide legal advice — only general guidance.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response from AI');
  return JSON.parse(jsonMatch[0]) as ActionPlan;
}
