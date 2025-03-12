import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Template",
  description: "Cross-platform authentication template with Supabase",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode; params: { locale: string } 
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  return (
      <div className={inter.className}>
          <Layout>
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
          </Layout>
        <Toaster />
      </div>
  );
}
