"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";

import { saveSettings, type SettingsState } from "@/server/actions/settings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */

const initial: SettingsState = { ok: false, message: "" };

function Field({
  name,
  label,
  value,
  type = "text",
  placeholder,
  help,
  textarea,
  error,
}: {
  name: string;
  label: string;
  value: any;
  type?: string;
  placeholder?: string;
  help?: string;
  textarea?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {textarea ? (
        <Textarea id={name} name={name} defaultValue={value ?? ""} rows={3} placeholder={placeholder} />
      ) : (
        <Input id={name} name={name} type={type} defaultValue={value ?? ""} placeholder={placeholder} />
      )}
      {help && <p className="text-xs text-muted-foreground/70">{help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: any }) {
  const [state, action, pending] = useActionState(saveSettings, initial);
  const s = settings ?? {};

  React.useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={action}>
      <Tabs defaultValue="identidade">
        <TabsList className="flex-wrap">
          <TabsTrigger value="identidade">Identidade</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="redes">Redes</TabsTrigger>
          <TabsTrigger value="rodape">Rodapé</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <div className="card-premium mt-4 rounded-2xl p-6">
          <TabsContent value="identidade" className="mt-0 grid gap-5 sm:grid-cols-2">
            <Field name="brandName" label="Nome da marca" value={s.brandName ?? "MootWeb"} error={state.errors?.brandName} />
            <Field name="tagline" label="Tagline" value={s.tagline} error={state.errors?.tagline} />
            <Field name="logoLightUrl" label="Logo (tema claro)" value={s.logoLightUrl} placeholder="/brand/... ou https://" />
            <Field name="logoDarkUrl" label="Logo (tema escuro)" value={s.logoDarkUrl} placeholder="/brand/... ou https://" />
            <Field name="faviconUrl" label="Favicon" value={s.faviconUrl} />
            <Field name="ogImageUrl" label="Imagem Open Graph" value={s.ogImageUrl} />
          </TabsContent>

          <TabsContent value="contato" className="mt-0 grid gap-5 sm:grid-cols-2">
            <Field name="email" label="E-mail" value={s.email} type="email" />
            <Field name="phone" label="Telefone" value={s.phone} />
            <Field name="whatsapp" label="WhatsApp" value={s.whatsapp} />
            <Field name="addressLine" label="Endereço" value={s.addressLine} />
            <Field name="city" label="Cidade" value={s.city} />
            <Field name="state" label="Estado" value={s.state} />
            <Field name="country" label="País" value={s.country ?? "Brasil"} />
            <Field name="mapEmbedUrl" label="URL do mapa (embed)" value={s.mapEmbedUrl} />
          </TabsContent>

          <TabsContent value="redes" className="mt-0 grid gap-5 sm:grid-cols-2">
            <Field name="instagramUrl" label="Instagram" value={s.instagramUrl} />
            <Field name="linkedinUrl" label="LinkedIn" value={s.linkedinUrl} />
            <Field name="githubUrl" label="GitHub" value={s.githubUrl} />
            <Field name="twitterUrl" label="X / Twitter" value={s.twitterUrl} />
            <Field name="youtubeUrl" label="YouTube" value={s.youtubeUrl} />
            <Field name="behanceUrl" label="Behance" value={s.behanceUrl} />
            <Field name="dribbbleUrl" label="Dribbble" value={s.dribbbleUrl} />
          </TabsContent>

          <TabsContent value="rodape" className="mt-0 grid gap-5 sm:grid-cols-2">
            <Field name="footerHeadline" label="Headline do rodapé" value={s.footerHeadline} />
            <Field name="footerCopyright" label="Copyright" value={s.footerCopyright} help="Use {year} para o ano atual." />
            <div className="sm:col-span-2">
              <Field name="footerText" label="Texto do rodapé" value={s.footerText} textarea />
            </div>
          </TabsContent>

          <TabsContent value="aparencia" className="mt-0 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="themeMode">Tema padrão</Label>
              <select
                id="themeMode"
                name="themeMode"
                defaultValue={s.themeMode ?? "dark"}
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm"
              >
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            <Field name="accentColor" label="Cor de destaque (hex)" value={s.accentColor ?? "#2563EB"} />
            <Field name="radius" label="Raio das bordas (rem)" value={s.radius ?? 0.9} type="number" />
            <div className="flex flex-col gap-3 pt-1">
              <span className="flex items-center gap-3 text-sm">
                <Switch name="enableParallax" defaultChecked={s.enableParallax ?? true} /> Parallax no fundo
              </span>
              <span className="flex items-center gap-3 text-sm">
                <Switch name="enableGridBg" defaultChecked={s.enableGridBg ?? true} /> Grid tecnológico
              </span>
              <span className="flex items-center gap-3 text-sm">
                <Switch name="maintenanceMode" defaultChecked={s.maintenanceMode ?? false} /> Modo manutenção
              </span>
            </div>
            <div className="sm:col-span-2">
              <Field name="maintenanceText" label="Mensagem de manutenção" value={s.maintenanceText} textarea />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 grid gap-5 sm:grid-cols-2">
            <Field name="gaId" label="Google Analytics (G-...)" value={s.gaId} />
            <Field name="gtmId" label="Google Tag Manager (GTM-...)" value={s.gtmId} />
            <Field name="fbPixelId" label="Facebook Pixel ID" value={s.fbPixelId} />
            <Field name="googleAdsId" label="Google Ads ID (AW-...)" value={s.googleAdsId} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-6">
        <Button type="submit" variant="gradient" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}
