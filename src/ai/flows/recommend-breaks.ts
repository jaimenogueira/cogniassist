
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
      'Uma string contendo o histórico de tarefas do utilizador, incluindo títulos, durações, status de conclusão e quaisquer notas associadas.'
    ),
  focusPatterns: z
    .string()
    .describe(
      'Uma string contendo os padrões de foco do utilizador, incluindo horários de pico de foco, períodos de baixo foco e quaisquer distrações identificadas.'
    ),
});
export type RecommendBreaksInput = z.infer<typeof RecommendBreaksInputSchema>;

const RecommendBreaksOutputSchema = z.object({
  breakRecommendation: z
    .string()
    .describe(
      'Uma recomendação para uma pausa estratégica, incluindo o tipo de pausa (ex: Pomodoro, micropausa), a duração e actividades sugeridas.' // actividades
    ),
  productivityTechnique: z
    .string()
    .describe(
      'Uma técnica de produtividade recomendada, como blocos de tempo, a Matriz de Eisenhower ou o método Getting Things Done (GTD).'
    ),
  reasoning: z
    .string()
    .describe(
      'Uma breve explicação do motivo pelo qual a recomendação de pausa e a técnica de produtividade foram escolhidas, com base no histórico de tarefas e padrões de foco do utilizador.'
    ),
});
export type RecommendBreaksOutput = z.infer<typeof RecommendBreaksOutputSchema>;

const defaultBreakRecommendation: RecommendBreaksOutput = {
  breakRecommendation: "Considere fazer uma pequena pausa de 5-10 minutos para se alongar ou caminhar.",
  productivityTechnique: "Experimente a Técnica Pomodoro: trabalhe por 25 minutos, depois faça uma pausa de 5 minutos.",
  reasoning: "Recomendação padrão fornecida, pois as sugestões da IA não puderam ser carregadas. Pausas regulares podem ajudar a manter o foco e a produtividade."
};

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
          'Uma recomendação para uma pausa estratégica, incluindo o tipo de pausa (ex: Pomodoro, micropausa), a duração e actividades sugeridas.' // Output description in European Portuguese
        ),
      productivityTechnique: z
        .string()
        .describe(
          'Uma técnica de produtividade recomendada, como blocos de tempo, a Matriz de Eisenhower ou o método Getting Things Done (GTD).' // Output description in European Portuguese
        ),
      reasoning: z
        .string()
        .describe(
          'Uma breve explicação do motivo pelo qual a recomendação de pausa e a técnica de produtividade foram escolhidas, com base no histórico de tarefas e padrões de foco do utilizador.' // Output description in European Portuguese
        ),
    }),
  },
  prompt: `Based on the user's task history and focus patterns, provide a strategic break recommendation and a productivity technique. Your output should be in European Portuguese if the user's context implies it.

Task History: {{{taskHistory}}}

Focus Patterns: {{{focusPatterns}}}

Recommendation should contain the type of break (e.g., Pomodoro, micro-break), the duration, and suggested activities.

Also recommend a productivity technique, such as time blocking, the Eisenhower Matrix, or the Getting Things Done (GTD) method.

Include a brief explanation of why the break recommendation and productivity technique were chosen, based on the user task history and focus patterns.

Ensure that the response is valid in terms of the schema. Do not add extra fields.
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
  async (input: RecommendBreaksInput) => {
    try {
      const {output} = await prompt(input);
      if (output && output.breakRecommendation && output.productivityTechnique && output.reasoning) {
        return output;
      }
      console.warn("A saída da IA para recommendBreaksFlow estava incompleta, retornando padrão.");
      return defaultBreakRecommendation;
    } catch (error) {
      console.error("Erro em recommendBreaksFlow ao chamar o prompt:", error);
      return defaultBreakRecommendation;
    }
  }
);

