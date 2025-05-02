// Recommend breaks flow
'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending strategic breaks and productivity techniques
 * based on user task history and focus patterns.
 *
 * @exports recommendBreaks - Function to trigger the break recommendation flow.
 * @exports RecommendBreaksInput - The input type for the recommendBreaks function.
 * @exports RecommendBreaksOutput - The output type for the recommendBreaks function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RecommendBreaksInputSchema = z.object({
  taskHistory: z
    .string()
    .describe(
      'A string containing the user task history, including task titles, durations, completion status, and any associated notes.'
    ),
  focusPatterns: z
    .string()
    .describe(
      'A string containing the user focus patterns, including peak focus times, periods of low focus, and any identified distractions.'
    ),
});
export type RecommendBreaksInput = z.infer<typeof RecommendBreaksInputSchema>;

const RecommendBreaksOutputSchema = z.object({
  breakRecommendation: z
    .string()
    .describe(
      'A recommendation for a strategic break, including the type of break (e.g., Pomodoro, micro-break), the duration, and suggested activities.'
    ),
  productivityTechnique: z
    .string()
    .describe(
      'A recommended productivity technique, such as time blocking, the Eisenhower Matrix, or the Getting Things Done (GTD) method.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why the break recommendation and productivity technique were chosen, based on the user task history and focus patterns.'
    ),
});
export type RecommendBreaksOutput = z.infer<typeof RecommendBreaksOutputSchema>;

export async function recommendBreaks(input: RecommendBreaksInput): Promise<RecommendBreaksOutput> {
  return recommendBreaksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBreaksPrompt',
  input: {
    schema: z.object({
      taskHistory: z
        .string()
        .describe(
          'A string containing the user task history, including task titles, durations, completion status, and any associated notes.'
        ),
      focusPatterns: z
        .string()
        .describe(
          'A string containing the user focus patterns, including peak focus times, periods of low focus, and any identified distractions.'
        ),
    }),
  },
  output: {
    schema: z.object({
      breakRecommendation: z
        .string()
        .describe(
          'A recommendation for a strategic break, including the type of break (e.g., Pomodoro, micro-break), the duration, and suggested activities.'
        ),
      productivityTechnique: z
        .string()
        .describe(
          'A recommended productivity technique, such as time blocking, the Eisenhower Matrix, or the Getting Things Done (GTD) method.'
        ),
      reasoning: z
        .string()
        .describe(
          'A brief explanation of why the break recommendation and productivity technique were chosen, based on the user task history and focus patterns.'
        ),
    }),
  },
  prompt: `Based on the user's task history and focus patterns, provide a strategic break recommendation and a productivity technique.

Task History: {{{taskHistory}}}

Focus Patterns: {{{focusPatterns}}}

Recommendation should contain the type of break (e.g., Pomodoro, micro-break), the duration, and suggested activities.

Also recommend a productivity technique, such as time blocking, the Eisenhower Matrix, or the Getting Things Done (GTD) method.

Include a brief explanation of why the break recommendation and productivity technique were chosen, based on the user task history and focus patterns.

Ensure that the the response is valid in terms of the schema. Do not add extra fields.
`,
});

const recommendBreaksFlow = ai.defineFlow<
  typeof RecommendBreaksInputSchema,
  typeof RecommendBreaksOutputSchema
>(
  {
    name: 'recommendBreaksFlow',
    inputSchema: RecommendBreaksInputSchema,
    outputSchema: RecommendBreaksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

