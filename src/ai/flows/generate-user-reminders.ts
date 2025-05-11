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
    .describe('A summary of the user habits, preferences, typical routines, and focus times. Example: "User often works late, peak focus 9-11 PM. Checks emails first thing. Occasionally forgets to take breaks. Prefers visual reminders."'),
  currentTime: z
    .string()
    .describe('The current ISO date and time string.'),
  upcomingCalendarEvents: z
    .string()
    .describe('A summary of upcoming calendar events for the user (e.g., "Meeting at 2 PM", "Dentist tomorrow 10 AM").'),
  recentTaskActivity: z
    .string()
    .describe('A summary of recent task activity, including completed, pending, overdue tasks, and recurring tasks/habits. Example: "Completed: Project Report (2h), Client Call Prep (1h). In Progress: Market Research (Est. 3h). Missed: Follow up email (due yesterday). Habit: Language Practice (last done 3 days ago)."'),
  preferredTone: z
    .enum(['motivational', 'neutral', 'gentle'])
    .default('neutral')
    .describe('The preferred tone for the reminders.'),
  mood: z.string().optional().describe("The user's current mood, if available (e.g., 'stressed', 'focused', 'tired'). This can help tailor the reminder's sensitivity.")
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
- User Habits & Preferences (including focus times): {{{userHabits}}}
- Current Time: {{{currentTime}}}
- Upcoming Calendar Events: {{{upcomingCalendarEvents}}}
- Recent Task Activity (including overdue/missed and habit tracking): {{{recentTaskActivity}}}
{{#if mood}}- User's Current Mood: {{{mood}}}{{#endif}}
- Preferred Reminder Tone: {{{preferredTone}}}

Based on this information, generate 1 to 3 concise, helpful, and actionable reminders.
The reminders should be:
1.  **Contextual**: Relevant to the user's current situation, time of day, and calendar. For example, if the user has an upcoming calendar event, suggest preparation.
2.  **Intelligent & Personalized**: Analyze habits, activity, and focus times.
    *   If the user tends to focus well at a certain time that's approaching or current, suggest scheduling demanding tasks then. (e.g., "You tend to focus better at night — want to schedule something now?").
    *   If a recurring task or habit (like 'Language Practice') hasn't been done in a while (e.g., 3 days), gently remind them. (e.g., "It’s been 3 days since your last practice of [Task Name]. Want to resume?").
    *   If they seem to be procrastinating on something important, offer a suggestion tailored to their habits.
3.  **Tone-Adapted**: Adapt the tone of the reminders to be "{{{preferredTone}}}".
    -   If 'motivational', make them encouraging and empowering. (e.g., "Go for it! You’ve got this 💪 Tackle that important project now!")
    -   If 'neutral', keep them direct and informative. (e.g., "Your peak focus time is typically at night. Consider working on [Task X] now.")
    -   If 'gentle', make them soft and understanding. (e.g., "Remember, you can continue [Task Y] when you’re ready. Perhaps a small step now?")
{{#if mood}}4. **Mood-Sensitive**: If mood is provided ({{{mood}}}), try to make the reminder sensitive to it. For example, if 'stressed', a gentle or very light motivational reminder might be better. If 'focused', a direct reminder might be fine.{{/if}}

Also provide a brief 'reasoning' string (1-2 sentences) explaining why these specific reminders were generated in relation to the provided user data and how they aim to help.

Example Output for a 'motivational' tone:
{
  "reminders": [
    "Your 'Team Meeting' is at 2 PM. Crush those prep notes 30 minutes beforehand! 🚀",
    "It's your peak focus time! How about diving into 'Market Research' and making some serious progress?",
    "It's been a few days since you practiced 'Language Learning'. A quick session today will keep your streak alive! You can do it!"
  ],
  "reasoning": "Generated motivational reminders based on an upcoming event, user's peak focus time, and a habit nudge, aiming to energize and encourage."
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
      if (output && output.reminders && output.reminders.length > 0 && output.reasoning) {
        return output;
      }
      console.warn("AI output for generateUserRemindersFlow was incomplete or empty, returning default message.", {aiOutput: output});
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

