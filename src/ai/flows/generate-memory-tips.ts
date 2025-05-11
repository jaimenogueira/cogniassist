// src/ai/flows/generate-memory-tips.ts
'use server';
/**
 * @fileOverview Generates personalized memory tips based on user cognitive profile and past behavior.
 *
 * - generateMemoryTips - A function that generates memory tips.
 * - GenerateMemoryTipsInput - The input type for the generateMemoryTips function.
 * - GenerateMemoryTipsOutput - The return type for the generateMemoryTips function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMemoryTipsInputSchema = z.object({
  cognitiveProfile: z
    .string()
    .describe('The user cognitive profile, e.g., Senior Mode, ADHD Mode.'),
  pastBehavior: z
    .string()
    .describe('The user past behavior related to task completion and focus.'),
});
export type GenerateMemoryTipsInput = z.infer<typeof GenerateMemoryTipsInputSchema>;

const GenerateMemoryTipsOutputSchema = z.object({
  memoryTips: z
    .array(z.string())
    .describe('An array of personalized memory tips for the user.'),
});
export type GenerateMemoryTipsOutput = z.infer<typeof GenerateMemoryTipsOutputSchema>;

const defaultMemoryTips: GenerateMemoryTipsOutput = {
    memoryTips: [
        "Break routines into smaller, manageable sections.",
        "Associate new information with things you already know.",
        "Practice mindfulness to improve focus and memory encoding."
    ]
};

export async function generateMemoryTips(input: GenerateMemoryTipsInput): Promise<GenerateMemoryTipsOutput> {
  return generateMemoryTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMemoryTipsPrompt',
  input: {
    schema: z.object({
      cognitiveProfile: z
        .string()
        .describe('The user cognitive profile, e.g., Senior Mode, ADHD Mode.'),
      pastBehavior: z
        .string()
        .describe('The user past behavior related to task completion and focus.'),
    }),
  },
  output: {
    schema: z.object({
      memoryTips: z
        .array(z.string())
        .describe('An array of personalized memory tips for the user.'),
    }),
  },
  prompt: `You are an AI assistant designed to provide personalized memory tips based on user cognitive profile and past behavior.

  Cognitive Profile: {{{cognitiveProfile}}}
  Past Behavior: {{{pastBehavior}}}

  Generate 3 memory tips tailored to the user. Return the tips as a numbered list.
  `,
});

const generateMemoryTipsFlow = ai.defineFlow<
  typeof GenerateMemoryTipsInputSchema,
  typeof GenerateMemoryTipsOutputSchema
>({
  name: 'generateMemoryTipsFlow',
  inputSchema: GenerateMemoryTipsInputSchema,
  outputSchema: GenerateMemoryTipsOutputSchema,
},
async (input: GenerateMemoryTipsInput) => {
  try {
    const {output} = await prompt(input);
    if (output && output.memoryTips && output.memoryTips.length > 0) {
        return output;
    }
    console.warn("AI output for generateMemoryTipsFlow was incomplete or empty, returning default tips.");
    return defaultMemoryTips;
  } catch (error) {
    console.error("Error in generateMemoryTipsFlow calling prompt:", error);
    // Fallback to default suggestions if AI fails or throws an error
    return defaultMemoryTips;
  }
});
