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
    .describe('A summary of the user habits, preferences, and typical routines. Example: "User often works late, checks emails first thing. Occasionally forgets to take breaks during long work sessions. Prefers visual reminders."'),
  currentTime: z
    .string()
    .describe('The current ISO date and time string.'),
  upcomingCalendarEvents: z
    .string()
    .describe('A summary of upcoming calendar events for the user (e.g., "Meeting at 2 PM", "Dentist tomorrow 10 AM").'),
  recentTaskActivity: z
    .string()
    .describe('A summary of recent task activity, including completed, pending, and overdue tasks. Example: "Completed: Project Report (2h), Client Call Prep (1h). In Progress: Market Research (Est. 3h). Missed: Follow up email (due yesterday)."'),
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
  prompt: `You are an AI assistant designed to generate smart, contextual reminders for a user to help them stay on track, manage their cognitive load, and build good habits.

Consider the following user information:
- User Habits & Preferences: {{{userHabits}}}
- Current Time: {{{currentTime}}}
- Upcoming Calendar Events: {{{upcomingCalendarEvents}}}
- Recent Task Activity (including overdue/missed): {{{recentTaskActivity}}}
- Preferred Reminder Tone: {{{preferredTone}}}

Based on this information, generate 1 to 3 concise, helpful, and actionable reminders.
The reminders should be:
1.  **Contextual**: Relevant to the user's current situation, time of day, and calendar.
2.  **Intelligent**: Analyze habits and activity. For example, if the user tends to focus well at a certain time not currently utilized, suggest scheduling demanding tasks then. If a task related to a habit hasn't been done in a while, gently remind them (e.g., "It’s been 3 days since you practiced [X]. Want to resume today?"). If there's an upcoming event, create a preparatory reminder. If they seem to be procrastinating on something, offer a suggestion.
3.  **Personalized**: Adapt the tone of the reminders to be "{{{preferredTone}}}".
    -   If 'motivational', make them encouraging and empowering. (e.g., "You've got this! Seize your peak focus time now for that big project.")
    -   If 'neutral', keep them direct and informative. (e.g., "Your peak focus time is typically at night. Consider working on [Task X] now.")
    -   If 'gentle', make them soft and understanding. (e.g., "It seems like [Task Y] is still pending. Perhaps starting with a small part of it now might feel good?")

Also provide a brief 'reasoning' string (1-2 sentences) explaining why these specific reminders were generated in relation to the provided user data and how they aim to help.

Example Output for a 'neutral' tone:
{
  "reminders": [
    "Your 'Team Meeting' is at 2 PM. Consider preparing your notes 30 minutes beforehand.",
    "You usually have good focus in the late morning. It might be a good time to tackle the 'Market Research' task.",
    "It's been a few days since you worked on 'Language Practice'. A short session today could be beneficial."
  ],
  "reasoning": "Generated reminders based on an upcoming calendar event, user's peak focus time for task scheduling, and a gentle nudge for a recurring habit."
}

Ensure the output contains an array of 1-3 reminder strings and a reasoning string. Be creative and genuinely helpful.
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
      if (output && output.reminders && output.reminders.length > 0) {
        return output;
      }
      // Fallback if AI output is not as expected or no reminders generated
      return {
        reminders: ["Could not generate specific reminders at this time. Please check your general task list."],
        reasoning: "AI did not generate specific reminders, providing a default message."
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

