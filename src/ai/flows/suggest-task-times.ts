
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
  title: z.string().describe('O título do bloco de tempo (ex: Foco Matinal).'),
  timeRange: z.string().describe('O intervalo de tempo sugerido para este bloco (ex: 8h - 11h).'),
  description: z.string().describe('Uma breve descrição para o que este bloco de tempo é adequado.'),
});
export type TimeBlock = z.infer<typeof TimeBlockSchema>;

const SuggestTaskTimesInputSchema = z.object({
  taskType: z.string().describe('O tipo de tarefa a agendar (ex: trabalho, pessoal, estudo).'),
  focusHistory: z
    .string()
    .describe(
      'Uma string contendo o histórico de foco do usuário, detalhando momentos de alta e baixa concentração.'
    ),
  pastTaskCompletionTimes: z
    .string()
    .describe('Uma string contendo os horários de conclusão de tarefas passadas do usuário.'),
  adaptAutomatically: z
    .boolean()
    .optional()
    .describe(
      'Se verdadeiro, as sugestões serão personalizadas com base no comportamento do usuário. Se falso ou indefinido, serão fornecidas sugestões gerais de ritmo circadiano.'
    ),
});
export type SuggestTaskTimesInput = z.infer<typeof SuggestTaskTimesInputSchema>;

const SuggestTaskTimesOutputSchema = z.object({
  timeBlocks: z
    .array(TimeBlockSchema)
    .describe('Uma lista de blocos de tempo sugeridos, cada um com título, intervalo de tempo e descrição.'),
  reasoning: z.string().describe('A justificativa da IA para os horários sugeridos.'),
});
export type SuggestTaskTimesOutput = z.infer<typeof SuggestTaskTimesOutputSchema>;

const defaultTimeBlocks: TimeBlock[] = [
  {
    title: 'Foco Matinal',
    timeRange: '8h – 11h',
    description:
      'Ideal para trabalho focado e tarefas que exigem alta concentração e engajamento cognitivo.',
  },
  {
    title: 'Ritmo do Meio-dia',
    timeRange: '12h – 15h',
    description:
      'Adequado para reuniões, comunicação e trabalho colaborativo, quando os níveis de energia permanecem estáveis.',
  },
  {
    title: 'Criatividade Noturna',
    timeRange: '18h – 21h',
    description: 'Uma ótima janela para pensamento criativo, brainstorming ou tarefas reflexivas.',
  },
];

export async function suggestTaskTimes(input: SuggestTaskTimesInput): Promise<SuggestTaskTimesOutput> {
  return suggestTaskTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskTimesPrompt',
  input: { schema: SuggestTaskTimesInputSchema },
  output: { schema: SuggestTaskTimesOutputSchema },
  prompt: `You are an AI assistant that suggests ideal task times. Your output should be in Portuguese if the user's context implies it.

Based on the user's task type, focus history, past task completion times, and adaptation preference, provide three primary time blocks for productivity: "Foco Matinal", "Ritmo do Meio-dia", and "Criatividade Noturna".

Default Time Blocks (use these as a base if 'adaptAutomatically' is false or user history is insufficient, in Portuguese):
- Foco Matinal (ex: 8h – 11h): Ideal para trabalho focado e tarefas que exigem alta concentração.
- Ritmo do Meio-dia (ex: 12h – 15h): Adequado para reuniões, comunicação e trabalho colaborativo.
- Criatividade Noturna (ex: 18h – 21h): Bom para pensamento criativo, brainstorming ou tarefas reflexivas.

User Inputs:
Task Type: {{{taskType}}}
Focus History: {{{focusHistory}}}
Past Task Completion Times: {{{pastTaskCompletionTimes}}}
Adapt Automatically: {{#if adaptAutomatically}}Sim{{else}}Não (fornecer sugestões gerais baseadas em ritmos circadianos){{/if}}

If 'Adapt Automatically' is 'Yes' and user history is available, tailor the time ranges and descriptions of these three blocks to the user's specific patterns. Ensure the titles remain "Foco Matinal", "Ritmo do Meio-dia", and "Criatividade Noturna".
If 'Adapt Automatically' is 'No', or if user history is insufficient for meaningful adaptation, provide the general descriptions and typical time ranges for "Foco Matinal", "Ritmo do Meio-dia", and "Criatividade Noturna".

The output must contain exactly three time blocks in the 'timeBlocks' array, with the specified titles in Portuguese.
Also, provide an overall 'reasoning' string in Portuguese explaining your suggestions, especially if adaptations were made or why general suggestions were provided.
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
        const portugueseTitles = defaultTimeBlocks.map(block => block.title);
        const hasCorrectTitles = output.timeBlocks.every(block => 
          portugueseTitles.includes(block.title)
        );
        if (hasCorrectTitles) {
          return output;
        }
      }
    } catch (error) {
      console.error("Erro em suggestTaskTimesFlow ao chamar o prompt:", error);
    }
    
    return {
      timeBlocks: defaultTimeBlocks,
      reasoning:
        'Usando padrões gerais de produtividade. Ative "Adaptar Automaticamente" e use mais o aplicativo para sugestões personalizadas.',
    };
  }
);
