'use server';
/**
 * @fileOverview A Genkit flow to generate concise and professional descriptions for invoice line items or general invoice notes.
 *
 * - adminInvoiceDescriptionGenerator - A function that handles the generation of invoice descriptions.
 * - AdminInvoiceDescriptionGeneratorInput - The input type for the adminInvoiceDescriptionGenerator function.
 * - AdminInvoiceDescriptionGeneratorOutput - The return type for the adminInvoiceDescriptionGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminInvoiceDescriptionGeneratorInputSchema = z.object({
  draftDescription: z
    .string()
    .describe('A brief draft or keywords for the invoice description.'),
});
export type AdminInvoiceDescriptionGeneratorInput = z.infer<
  typeof AdminInvoiceDescriptionGeneratorInputSchema
>;

const AdminInvoiceDescriptionGeneratorOutputSchema = z.object({
  professionalDescription: z
    .string()
    .describe('A concise and professional description for the invoice.'),
});
export type AdminInvoiceDescriptionGeneratorOutput = z.infer<
  typeof AdminInvoiceDescriptionGeneratorOutputSchema
>;

export async function adminInvoiceDescriptionGenerator(
  input: AdminInvoiceDescriptionGeneratorInput
): Promise<AdminInvoiceDescriptionGeneratorOutput> {
  return adminInvoiceDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvoiceDescriptionPrompt',
  input: {schema: AdminInvoiceDescriptionGeneratorInputSchema},
  output: {schema: AdminInvoiceDescriptionGeneratorOutputSchema},
  prompt: `You are an AI assistant specialized in creating concise and professional descriptions for invoices.

Take the following draft description or keywords and transform them into a formal, clear, and professional invoice description suitable for a business document. Ensure the description is brief but comprehensive.

Draft/Keywords: {{{draftDescription}}}

---

Professional Description:`,
});

const adminInvoiceDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'adminInvoiceDescriptionGeneratorFlow',
    inputSchema: AdminInvoiceDescriptionGeneratorInputSchema,
    outputSchema: AdminInvoiceDescriptionGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
