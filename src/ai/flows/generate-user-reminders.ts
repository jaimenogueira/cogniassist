// src/ai/flows/generate-user-reminders.ts
'use server';
/**
 * @fileOverview Defines a Genkit flow for generating smart, contextual user reminders.
 *
 * - generateUserReminders - A function that generates personalized reminders.
 * - GenerateUserRemindersInput - The input type for the generateUserReminders function.
 * - GenerateUserRemindersOutput - The return type for the generateUserReminders function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateUserRemindersInputSchema = z.object({
  userHabits: z
    .string()
    .describe('A summary of the user habits, preferences, and typical routines.'),
  currentTime: z
    .string()
    .describe('The current ISO date and time string.'),
  upcomingCalendarEvents: z
    .string()
    .describe('A summary of upcoming calendar events for the user (e.g., "Meeting at 2 PM", "Dentist tomorrow 10 AM").'),
  recentTaskActivity: z
    .string()
    .describe('A summary of recent task activity, including completed and pending tasks.'),
  preferredTone: z
    .enum(['motivational', 'neutral', 'gentle'])
    .default('neutral')
    .describe('The preferred tone for the reminders.'),
});
export type GenerateUserRemindersInput = z.infer<typeof GenerateUserRemindersInputSchema>;

const GenerateUserRemindersOutputSchema = z.object({
  reminders: z
    .array(z.string())
    .describe('An array of 1-3 contextually relevant reminder strings.'),
  reasoning: z
    .string()
    .describe('A brief explanation of why these reminders were generated.'),
});
export type GenerateUserRemindersOutput = z.infer<typeof GenerateUserRemindersOutputSchema>;

export async function generateUserReminders(input: GenerateUserRemindersInput): Promise<GenerateUserRemindersOutput> {
  return generateUserRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUserRemindersPrompt',
  input: {schema: GenerateUserRemindersInputSchema},
  output: {schema: GenerateUserRemindersOutputSchema},
  prompt: `You are an AI assistant designed to generate smart, contextual reminders for a user to help them stay on track and manage their cognitive load.

Consider the following user information:
- User Habits: {{{userHabits}}}
- Current Time: {{{currentTime}}}
- Upcoming Calendar Events: {{{upcomingCalendarEvents}}}
- Recent Task Activity: {{{recentTaskActivity}}}
- Preferred Reminder Tone: {{{preferredTone}}}

Based on this information, generate 1 to 3 concise, helpful, and actionable reminders.
The reminders should be relevant to the user's current context and anticipate potential needs or forgetfulness.
For example, if the user tends to focus well at a certain time, suggest scheduling demanding tasks then. If a task related to a habit hasn't been done in a while, gently remind them. If there's an upcoming event, create a preparatory reminder.

Adapt the tone of the reminders to be "{{{preferredTone}}}".
- If 'motivational', make them encouraging and empowering.
- If 'neutral', keep them direct and informative.
- If 'gentle', make them soft and understanding.

Also provide a brief 'reasoning' string explaining why these specific reminders were generated in relation to the provided user data.

Example Output for a 'neutral' tone:
{
  "reminders": [
    "Your 'Team Meeting' is at 2 PM. Consider preparing your notes 30 minutes beforehand.",
    "You usually have good focus in the late morning. It might be a good time to tackle the 'Market Research' task."
  ],
  "reasoning": "Generated reminders based on upcoming calendar event and user's peak focus time for task scheduling."
}

Ensure the output contains an array of reminder strings and a reasoning string.
`,
});

const generateUserRemindersFlow = ai.defineFlow(
  {
    name: 'generateUserRemindersFlow',
    inputSchema: GenerateUserRemindersInputSchema,
    outputSchema: GenerateUserRemindersOutputSchema,
  },
  async (input: GenerateUserRemindersInput) => {
    try {
      const {output} = await prompt(input);
      if (output && output.reminders) {
        return output;
      }
      // Fallback if AI output is not as expected
      return {
        reminders: ["Could not generate specific reminders at this time. Please check your general task list."],
        reasoning: "AI failed to generate specific reminders, providing a default message."
      };
    } catch (error) {
      console.error("Error in generateUserRemindersFlow calling prompt:", error);
      // Fallback to default suggestions if AI fails or throws an error
      return {
        reminders: ["Error generating reminders. Please try again later."],
        reasoning: "An error occurred while trying to generate smart reminders.",
      };
    }
  }
);

