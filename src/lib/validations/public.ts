import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().optional().or(z.literal("")),
  body: z.string().min(10, "Conte um pouco mais (mín. 10 caracteres)"),
  // honeypot anti-spam
  company_website: z.string().max(0).optional(),
});

export const quoteSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  company: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  projectType: z.string().min(1, "Selecione o tipo de projeto"),
  deadline: z.string().optional().or(z.literal("")),
  budgetRange: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Descreva o projeto (mín. 10 caracteres)"),
  fileUrls: z.string().optional(), // JSON array de URLs já enviadas
  company_website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
