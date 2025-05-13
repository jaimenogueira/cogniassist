
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
    .describe('O perfil cognitivo do utilizador, ex: Modo Sénior, Modo PHDA.'), // PHDA for ADHD
  pastBehavior: z
    .string()
    .describe('O comportamento passado do utilizador relacionado com a conclusão de tarefas e foco.'),
});
export type GenerateMemoryTipsInput = z.infer<typeof GenerateMemoryTipsInputSchema>;

const GenerateMemoryTipsOutputSchema = z.object({
  memoryTips: z
    .array(z.string())
    .describe('Uma lista de dicas de memória personalizadas para o utilizador.'),
});
export type GenerateMemoryTipsOutput = z.infer<typeof GenerateMemoryTipsOutputSchema>;

const defaultMemoryTips: GenerateMemoryTipsOutput = {
    memoryTips: [
        "Divida as rotinas em secções menores e gerenciáveis.", // secções
        "Associe novas informações a coisas que já conhece.",
        "Pratique a atenção plena (mindfulness) para melhorar o foco e a codificação da memória."
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
        .describe('The user cognitive profile, e.g., Senior Mode, ADHD Mode.'), // English for LLM understanding
      pastBehavior: z
        .string()
        .describe('The user past behavior related to task completion and focus.'), // English for LLM understanding
    }),
  },
  output: {
    schema: z.object({
      memoryTips: z
        .array(z.string())
        .describe('Uma lista de dicas de memória personalizadas para o utilizador.'), // Output description in European Portuguese
    }),
  },
  prompt: `You are an AI assistant designed to provide personalized memory tips based on user cognitive profile and past behavior.

  Cognitive Profile: {{{cognitiveProfile}}}
  Past Behavior: {{{pastBehavior}}}

  Generate 3 memory tips tailored to the user. Return the tips as a numbered list. If the user's preferred language is European Portuguese, provide the tips in European Portuguese.
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
    console.warn("A saída da IA para generateMemoryTipsFlow estava incompleta ou vazia, retornando dicas padrão.");
    return defaultMemoryTips;
  } catch (error) {
    console.error("Erro em generateMemoryTipsFlow ao chamar o prompt:", error);
    return defaultMemoryTips;
  }
});

