"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendEmail, renderLeadNotificationEmail } from "@/lib/email";
import { contactSchema, quoteSchema } from "@/lib/validations/public";
import { absoluteUrl } from "@/lib/utils";

export interface FormState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

function zerr(e: z.ZodError) {
  const o: Record<string, string> = {};
  for (const i of e.issues) o[i.path.join(".")] = i.message;
  return o;
}

async function clientMeta() {
  try {
    const h = await headers();
    return {
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      ua: h.get("user-agent") ?? null,
    };
  } catch {
    return { ip: null, ua: null };
  }
}

/** Formulário de contato → Message + Lead + e-mail. */
export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zerr(parsed.error) };
  }
  if (parsed.data.company_website) {
    // honeypot preenchido = bot
    return { ok: true, message: "Recebido!" };
  }

  const { name, email, phone, subject, body } = parsed.data;

  try {
    await prisma.message.create({
      data: { name, email, phone: phone || null, subject: subject || null, body },
    });
    await prisma.lead.create({
      data: { name, email, phone: phone || null, source: "contato", status: "NEW" },
    });

    const mail = renderLeadNotificationEmail({
      kind: "message",
      name,
      email,
      summary: (subject ? `${subject} — ` : "") + body.slice(0, 200),
      adminUrl: absoluteUrl("/admin/mensagens"),
    });
    await sendEmail({ to: process.env.SMTP_FROM || "contato@mootweb.online", ...mail });
  } catch (err) {
    console.error("[submitContact]", err);
    return { ok: false, message: "Não foi possível enviar agora. Tente novamente." };
  }

  return { ok: true, message: "Mensagem enviada! Retornamos em breve." };
}

/** Formulário de orçamento → Quote (+ arquivos) + Lead + e-mail. */
export async function submitQuote(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = quoteSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zerr(parsed.error) };
  }
  if (parsed.data.company_website) return { ok: true, message: "Recebido!" };

  const d = parsed.data;
  let fileUrls: { url: string; name: string; size: number; mimeType: string }[] = [];
  try {
    fileUrls = d.fileUrls ? JSON.parse(d.fileUrls) : [];
  } catch {
    fileUrls = [];
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: d.name,
        email: d.email,
        phone: d.phone || d.whatsapp || null,
        company: d.company || null,
        source: "orçamento",
        status: "NEW",
      },
    });

    await prisma.quote.create({
      data: {
        name: d.name,
        company: d.company || null,
        email: d.email,
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,
        city: d.city || null,
        state: d.state || null,
        projectType: d.projectType,
        deadline: d.deadline || null,
        budgetRange: d.budgetRange || null,
        message: d.message,
        leadId: lead.id,
        files: {
          create: fileUrls.map((f) => ({
            url: f.url,
            name: f.name,
            size: f.size ?? 0,
            mimeType: f.mimeType ?? "application/octet-stream",
          })),
        },
      },
    });

    const mail = renderLeadNotificationEmail({
      kind: "quote",
      name: d.name,
      email: d.email,
      summary: `${d.projectType} · ${d.budgetRange ?? "orçamento a definir"} · prazo ${d.deadline ?? "-"}`,
      adminUrl: absoluteUrl("/admin/orcamentos"),
    });
    await sendEmail({ to: process.env.SMTP_FROM || "contato@mootweb.online", ...mail });
  } catch (err) {
    console.error("[submitQuote]", err);
    return { ok: false, message: "Não foi possível enviar agora. Tente novamente." };
  }

  await clientMeta();
  return { ok: true, message: "Briefing recebido! Em até 1 dia útil devolvemos uma proposta." };
}
