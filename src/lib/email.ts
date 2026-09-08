/**
 * Envio de e-mail.
 * Dev: registra no console (sem SMTP configurado).
 * Prod: plugue aqui um provedor (Resend, SES, Nodemailer...) usando as
 * variáveis SMTP_* do .env.
 */
interface MailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: MailInput) {
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

  if (!hasSmtp) {
    console.log("\n📧  [email:dev] — SMTP não configurado, apenas log");
    console.log(`    para:     ${to}`);
    console.log(`    assunto:  ${subject}`);
    console.log(`    texto:    ${text ?? stripHtml(html)}\n`);
    return { delivered: false as const, preview: true as const };
  }

  // TODO(prod): implementar transporte real (nodemailer/Resend/SES).
  console.warn("[email] SMTP configurado mas transporte não implementado.");
  return { delivered: false as const, preview: false as const };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function renderPasswordResetEmail(link: string, brand = "MootWeb") {
  return {
    subject: `${brand} — redefinição de senha`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6">
        <h2>Redefinir senha</h2>
        <p>Você solicitou a redefinição da sua senha no painel ${brand}.</p>
        <p><a href="${link}" style="background:#2563EB;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Criar nova senha</a></p>
        <p style="color:#64748b;font-size:13px">Se não foi você, ignore este e-mail. O link expira em 1 hora.</p>
      </div>`,
    text: `Redefinir senha: ${link} (expira em 1 hora)`,
  };
}

export function renderLeadNotificationEmail(payload: {
  kind: "quote" | "message";
  name: string;
  email: string;
  summary: string;
  adminUrl: string;
  brand?: string;
}) {
  const label = payload.kind === "quote" ? "orçamento" : "mensagem";
  return {
    subject: `${payload.brand ?? "MootWeb"} — novo ${label} de ${payload.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6">
        <h2>Novo ${label}</h2>
        <p><strong>Nome:</strong> ${payload.name}<br/>
        <strong>E-mail:</strong> ${payload.email}</p>
        <p>${payload.summary}</p>
        <p><a href="${payload.adminUrl}">Abrir no painel</a></p>
      </div>`,
    text: `Novo ${label} de ${payload.name} (${payload.email}). ${payload.summary} — ${payload.adminUrl}`,
  };
}
