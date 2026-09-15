import { notFound } from "next/navigation";

import { buscarPlanoPorSlug } from "@/lib/planos";

import { CheckoutAssinaturaForm } from "./checkout-form";

export default async function CheckoutAssinaturaPage({
  params,
}: {
  params: Promise<{ plano: string }>;
}) {
  const { plano: planoSlug } = await params;
  const plano = buscarPlanoPorSlug(planoSlug);
  if (!plano) notFound();

  return <CheckoutAssinaturaForm plano={plano} />;
}
