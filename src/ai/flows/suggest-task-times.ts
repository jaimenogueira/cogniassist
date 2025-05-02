'use server';

/**
 * @fileOverview AI-powered task time suggestion flow.
 *
 * - suggestTaskTimes - A function that suggests ideal times for scheduling new tasks based on user behavior.
 * - SuggestTaskTimesInput - The input type for the suggestTaskTimes function.
 * - SuggestTaskTimesOutput - The return type for the suggestTaskTimes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTaskTimesInputSchema = z.object({
  taskType: z.string().describe('The type of task to schedule (e.g., work, personal, study).'),
  focusHistory: z
    .string() // In a real application, this might be a more structured format
    .describe(
      'A string containing the user focus history, detailing times of high and low concentration.'
    ),
  pastTaskCompletionTimes: z
    .string() // In a real application, this might be a more structured format
    .describe('A string containing the user past task completion times.'),
});
export type SuggestTaskTimesInput = z.infer<typeof SuggestTaskTimesInputSchema>;

const SuggestTaskTimesOutputSchema = z.object({
  suggestedTimes: z
    .string() // In a real application, this might be a more structured format
    .describe('A list of suggested times for the task, based on focus history and past task completion times.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested times.'),
});
export type SuggestTaskTimesOutput = z.infer<typeof SuggestTaskTimesOutputSchema>;

export async function suggestTaskTimes(input: SuggestTaskTimesInput): Promise<SuggestTaskTimesOutput> {
  return suggestTaskTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskTimesPrompt',
  input: {
    schema: z.object({
      taskType: z.string().describe('The type of task to schedule (e.g., work, personal, study).'),
      focusHistory: z
        .string()
        .describe(
          'A string containing the user focus history, detailing times of high and low concentration.'
        ),
      pastTaskCompletionTimes: z
        .string()
        .describe('A string containing the user past task completion times.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedTimes: z
        .string()
        .describe('A list of suggested times for the task, based on focus history and past task completion times.'),
      reasoning: z.string().describe('The AI reasoning behind the suggested times.'),
    }),
  },
  prompt: `Based on the user's focus history and past task completion times, suggest the ideal times for the following task type:

Task Type: {{{taskType}}}
Focus History: {{{focusHistory}}}
Past Task Completion Times: {{{pastTaskCompletionTimes}}}

Respond with a list of suggested times and a brief explanation of your reasoning.
`,
});

const suggestTaskTimesFlow = ai.defineFlow<
  typeof SuggestTaskTimesInputSchema,
  typeof SuggestTaskTimesOutputSchema
>(
  {
    name: 'suggestTaskTimesFlow',
    inputSchema: SuggestTaskTimesInputSchema,
    outputSchema: SuggestTaskTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
