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

const TimeBlockSchema = z.object({
  title: z.string().describe('The title of the time block (e.g., Morning Focus).'),
  timeRange: z.string().describe('The suggested time range for this block (e.g., 8 AM - 11 AM).'),
  description: z.string().describe('A brief description of what this time block is suitable for.'),
});
export type TimeBlock = z.infer<typeof TimeBlockSchema>;

const SuggestTaskTimesInputSchema = z.object({
  taskType: z.string().describe('The type of task to schedule (e.g., work, personal, study).'),
  focusHistory: z
    .string()
    .describe(
      'A string containing the user focus history, detailing times of high and low concentration.'
    ),
  pastTaskCompletionTimes: z
    .string()
    .describe('A string containing the user past task completion times.'),
  adaptAutomatically: z
    .boolean()
    .optional()
    .describe(
      'If true, suggestions will be tailored based on user behavior. If false or undefined, general circadian rhythm suggestions will be provided.'
    ),
});
export type SuggestTaskTimesInput = z.infer<typeof SuggestTaskTimesInputSchema>;

const SuggestTaskTimesOutputSchema = z.object({
  timeBlocks: z
    .array(TimeBlockSchema)
    .describe('An array of suggested time blocks, each with a title, time range, and description.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested times.'),
});
export type SuggestTaskTimesOutput = z.infer<typeof SuggestTaskTimesOutputSchema>;

const defaultTimeBlocks: TimeBlock[] = [
  {
    title: 'Morning Focus',
    timeRange: '8 AM – 11 AM',
    description:
      'Ideal for deep work and tasks requiring high concentration and cognitive engagement.',
  },
  {
    title: 'Midday Momentum',
    timeRange: '12 PM – 3 PM',
    description:
      'Suitable for meetings, communication, and collaborative work, when energy levels remain steady.',
  },
  {
    title: 'Evening Creativity',
    timeRange: '6 PM – 9 PM',
    description: 'A great window for creative thinking, brainstorming, or reflective tasks.',
  },
];

export async function suggestTaskTimes(input: SuggestTaskTimesInput): Promise<SuggestTaskTimesOutput> {
  return suggestTaskTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskTimesPrompt',
  input: { schema: SuggestTaskTimesInputSchema },
  output: { schema: SuggestTaskTimesOutputSchema },
  prompt: `You are an AI assistant that suggests ideal task times.

Based on the user's task type, focus history, past task completion times, and adaptation preference, provide three primary time blocks for productivity: Morning Focus, Midday Momentum, and Evening Creativity.

Default Time Blocks (use these as a base if 'adaptAutomatically' is false or user history is insufficient):
- Morning Focus (e.g., 8 AM – 11 AM): Ideal for deep work and tasks requiring high concentration.
- Midday Momentum (e.g., 12 PM – 3 PM): Suitable for meetings, communication, and collaborative work.
- Evening Creativity (e.g., 6 PM – 9 PM): Good for creative thinking, brainstorming, or reflective tasks.

User Inputs:
Task Type: {{{taskType}}}
Focus History: {{{focusHistory}}}
Past Task Completion Times: {{{pastTaskCompletionTimes}}}
Adapt Automatically: {{#if adaptAutomatically}}Yes{{else}}No (provide general suggestions based on circadian rhythms){{/if}}

If 'Adapt Automatically' is 'Yes' and user history is available, tailor the time ranges and descriptions of these three blocks to the user's specific patterns. Ensure the titles remain "Morning Focus", "Midday Momentum", and "Evening Creativity".
If 'Adapt Automatically' is 'No', or if user history is insufficient for meaningful adaptation, provide the general descriptions and typical time ranges for Morning Focus, Midday Momentum, and Evening Creativity.

The output must contain exactly three time blocks in the 'timeBlocks' array, with the specified titles.
Also, provide an overall 'reasoning' string explaining your suggestions, especially if adaptations were made or why general suggestions were provided.
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
  async (input: SuggestTaskTimesInput) => {
    try {
      const {output} = await prompt(input);
      if (output && output.timeBlocks && output.timeBlocks.length === 3) {
        // Basic validation that titles match, can be enhanced
        const hasCorrectTitles = output.timeBlocks.every(block => 
          defaultTimeBlocks.some(defaultBlock => defaultBlock.title === block.title)
        );
        if (hasCorrectTitles) {
          return output;
        }
      }
    } catch (error) {
      console.error("Error in suggestTaskTimesFlow calling prompt:", error);
      // Fall through to default if AI fails
    }
    
    // Fallback to default suggestions if AI output is not as expected or an error occurs
    return {
      timeBlocks: defaultTimeBlocks,
      reasoning:
        'Using general productivity patterns. Enable "Adapt Automatically" and use the app more for personalized suggestions.',
    };
  }
);
