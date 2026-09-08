"use server";

import { revalidatePath } from "next/cache";
import type { LeadStatus, MessageStatus, QuoteStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

export async function setLeadStatus(form: FormData) {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const status = String(form.get("status")) as LeadStatus;
  await prisma.lead.update({ where: { id }, data: { status } });
  await logActivity({ action: "lead.status", entityType: "Lead", entityId: id, metadata: { status } });
  revalidatePath("/admin/leads");
}

export async function addLeadNote(form: FormData) {
  const user = await requireRole("EDITOR");
  const leadId = String(form.get("leadId"));
  const body = String(form.get("body") ?? "").trim();
  if (!body) return;
  await prisma.leadNote.create({
    data: { leadId, body, authorName: user.name ?? user.email ?? "admin" },
  });
  await logActivity({ action: "lead.note", entityType: "Lead", entityId: leadId });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLead(form: FormData) {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const value = form.get("value") ? Math.round(Number(form.get("value")) * 100) : null;
  await prisma.lead.update({
    where: { id },
    data: {
      name: String(form.get("name") ?? ""),
      email: (String(form.get("email") ?? "") || null) as string | null,
      phone: (String(form.get("phone") ?? "") || null) as string | null,
      company: (String(form.get("company") ?? "") || null) as string | null,
      ownerName: (String(form.get("ownerName") ?? "") || null) as string | null,
      value,
    },
  });
  await logActivity({ action: "lead.update", entityType: "Lead", entityId: id });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
}

export async function setMessageStatus(form: FormData) {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const status = String(form.get("status")) as MessageStatus;
  await prisma.message.update({ where: { id }, data: { status } });
  revalidatePath("/admin/mensagens");
}

export async function setQuoteStatus(form: FormData) {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const status = String(form.get("status")) as QuoteStatus;
  await prisma.quote.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orcamentos");
}

/** Converte um orçamento em lead do CRM. */
export async function quoteToLead(form: FormData) {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) return;
  const lead = await prisma.lead.create({
    data: {
      name: quote.name,
      email: quote.email,
      phone: quote.phone ?? quote.whatsapp,
      company: quote.company,
      source: "orçamento",
      status: "NEW",
    },
  });
  await prisma.quote.update({ where: { id }, data: { leadId: lead.id, status: "REVIEWING" } });
  await logActivity({ action: "quote.to_lead", entityType: "Quote", entityId: id });
  revalidatePath("/admin/orcamentos");
  revalidatePath("/admin/leads");
}
