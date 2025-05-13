
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
    .describe('Um resumo dos hábitos, preferências, rotinas típicas e horários de foco do utilizador. Exemplo: "Utilizador costuma trabalhar até tarde, pico de foco das 21h às 23h. Verifica e-mails logo cedo. Ocasionalmente esquece-se de fazer pausas. Prefere lembretes visuais."'),
  currentTime: z
    .string()
    .describe('A data e hora ISO atuais.'),
  upcomingCalendarEvents: z
    .string()
    .describe('Um resumo dos próximos eventos do calendário do utilizador (ex: "Reunião às 14h", "Dentista amanhã às 10h").'),
  recentTaskActivity: z
    .string()
    .describe('Um resumo da atividade recente de tarefas, incluindo tarefas concluídas, pendentes, atrasadas e tarefas/hábitos recorrentes. Exemplo: "Concluído: Relatório do Projeto (2h), Preparação Chamada Cliente (1h). Em Curso: Pesquisa de Mercado (Est. 3h). Perdido: E-mail de acompanhamento (venceu ontem). Hábito: Prática de Idioma (última vez há 3 dias)."'),
  preferredTone: z
    .enum(['motivational', 'neutral', 'gentle'])
    .default('neutral')
    .describe('O tom preferido para os lembretes (motivacional, neutro, gentil).'),
  mood: z.string().optional().describe("O humor atual do utilizador, se disponível (ex: 'stressado', 'focado', 'cansado'). Isto pode ajudar a adaptar a sensibilidade do lembrete.")
});
export type GenerateUserRemindersInput = z.infer<typeof GenerateUserRemindersInputSchema>;

const GenerateUserRemindersOutputSchema = z.object({
  reminders: z
    .array(z.string())
    .describe('Uma lista de 1-3 mensagens de lembrete contextualmente relevantes.'),
  reasoning: z
    .string()
    .describe('Uma breve explicação de por que estes lembretes foram gerados.'),
});
export type GenerateUserRemindersOutput = z.infer<typeof GenerateUserRemindersOutputSchema>;

export async function generateUserReminders(input: GenerateUserRemindersInput): Promise<GenerateUserRemindersOutput> {
  return generateUserRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUserRemindersPrompt',
  input: {schema: GenerateUserRemindersInputSchema},
  output: {schema: GenerateUserRemindersOutputSchema},
  prompt: `You are an AI assistant designed to generate smart, contextual reminders for a user to help them stay on track, manage their cognitive load, and build good habits. Your output should be in European Portuguese if the user's context implies it (e.g., userHabits description in European Portuguese).

Consider the following user information:
- User Habits & Preferences (including focus times): {{{userHabits}}}
- Current Time: {{{currentTime}}}
- Upcoming Calendar Events: {{{upcomingCalendarEvents}}}
- Recent Task Activity (including overdue/missed and habit tracking): {{{recentTaskActivity}}}
{{#if mood}}- User's Current Mood: {{{mood}}}{{#endif}}
- Preferred Reminder Tone: {{{preferredTone}}}

Based on this information, generate 1 to 3 concise, helpful, and actionable reminders in European Portuguese.
The reminders should be:
1.  **Contextual**: Relevant to the user's current situation, time of day, and calendar. For example, if the user has an upcoming calendar event, suggest preparation.
2.  **Intelligent & Personalized**: Analyze habits, activity, and focus times.
    *   If the user tends to focus well at a certain time that's approaching or current, suggest scheduling demanding tasks then. (e.g., "Costuma focar-se melhor à noite — quer agendar algo agora?").
    *   If a recurring task or habit (like 'Prática de Idioma') hasn't been done in a while (e.g., 3 days), gently remind them. (e.g., "Faz 3 dias desde a sua última prática de [Nome da Tarefa]. Quer retomar?").
    *   If they seem to be procrastinating on something important, offer a suggestion tailored to their habits.
3.  **Tone-Adapted**: Adapt the tone of the reminders to be "{{{preferredTone}}}".
    -   If 'motivational', make them encouraging and empowering. (e.g., "Força! Consegue 💪 Encare aquele projeto importante agora!")
    -   If 'neutral', keep them direct and informative. (e.g., "O seu pico de foco costuma ser à noite. Considere trabalhar em [Tarefa X] agora.")
    -   If 'gentle', make them soft and understanding. (e.g., "Lembre-se, pode continuar [Tarefa Y] quando estiver pronto. Que tal um pequeno passo agora?")
{{#if mood}}4. **Mood-Sensitive**: If mood is provided ({{{mood}}}), try to make the reminder sensitive to it. For example, if 'stressado', a gentle or very light motivational reminder might be better. If 'focado', a direct reminder might be fine.{{/if}}

Also provide a brief 'reasoning' string (1-2 sentences) in European Portuguese explaining why these specific reminders were generated in relation to the provided user data and how they aim to help.

Example Output for a 'motivational' tone (in European Portuguese):
{
  "reminders": [
    "A sua 'Reunião de Equipa' é às 14h. Deixe tudo pronto nas anotações preparatórias 30 minutos antes! 🚀",
    "É o seu horário de pico de foco! Que tal mergulhar na 'Pesquisa de Mercado' e fazer um progresso sério?",
    "Faz alguns dias que não pratica 'Aprendizagem de Idioma'. Uma sessão rápida hoje manterá a sua sequência viva! Consegue!"
  ],
  "reasoning": "Lembretes motivacionais gerados com base num evento futuro, horário de pico de foco do utilizador e um incentivo de hábito, visando energizar e encorajar."
}

Ensure the output contains an array of 1-3 reminder strings and a reasoning string, both in European Portuguese. Be creative and genuinely helpful.
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
      console.warn("A saída da IA para generateUserRemindersFlow estava incompleta ou vazia, retornando mensagem padrão.", {aiOutput: output});
      return {
        reminders: ["Não foi possível gerar lembretes específicos no momento. Por favor, verifique a sua lista geral de tarefas."],
        reasoning: "A IA não gerou lembretes específicos, fornecendo uma mensagem padrão."
      };
    } catch (error) {
      console.error("Erro em generateUserRemindersFlow ao chamar o prompt:", error);
      return {
        reminders: ["Erro ao gerar lembretes. Por favor, tente novamente mais tarde."],
        reasoning: "Ocorreu um erro ao tentar gerar lembretes inteligentes.",
      };
    }
  }
);

