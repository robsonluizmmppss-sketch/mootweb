import { redirect } from "next/navigation";

// "Portfólio" no menu = curadoria dos projetos.
export default function PortfolioRedirect() {
  redirect("/admin/projetos");
}
