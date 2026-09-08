import {
  Sparkles,
  Gauge,
  Layers,
  Search,
  PenTool,
  Code2,
  Boxes,
  TrendingUp,
  Compass,
  Rocket,
  LineChart,
  ShieldCheck,
  Zap,
  Blocks,
  Cpu,
  Globe,
  Palette,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Mapa nome -> componente. Novos ícones do CMS só precisam ser adicionados aqui. */
const REGISTRY: Record<string, LucideIcon> = {
  Sparkles,
  Gauge,
  Layers,
  Search,
  PenTool,
  Code2,
  Boxes,
  TrendingUp,
  Compass,
  Rocket,
  LineChart,
  ShieldCheck,
  Zap,
  Blocks,
  Cpu,
  Globe,
  Palette,
  Workflow,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = REGISTRY[name] ?? Sparkles;
  return <Cmp className={cn("size-5", className)} aria-hidden />;
}
