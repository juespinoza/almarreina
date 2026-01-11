import "../globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { getCafeContent, getCafeTheme } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; cafe: string }>;
}): Promise<Metadata> {
  const { locale, cafe } = await params;
  const data = await getCafeContent(cafe, locale);
  return buildMetadata({ locale, cafe }, data);
}

function cssVarsFromTheme(theme: any) {
  const to = (arr: number[]) => arr.join(" ");
  return `
    :root{
      --bg:${to(theme.light.bg)};
      --surface:${to(theme.light.surface)};
      --text:${to(theme.light.text)};
      --muted:${to(theme.light.muted)};
      --primary:${to(theme.light.primary)};
      --primary2:${to(theme.light.primary2)};
      --border:${to(theme.light.border)};
      --font-display:${theme.fonts.display}, ui-serif, Georgia, serif;
      --font-body:${
        theme.fonts.body
      }, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    .dark{
      --bg:${to(theme.dark.bg)};
      --surface:${to(theme.dark.surface)};
      --text:${to(theme.dark.text)};
      --muted:${to(theme.dark.muted)};
      --primary:${to(theme.dark.primary)};
      --primary2:${to(theme.dark.primary2)};
      --border:${to(theme.dark.border)};
    }
  `;
}

export default async function CafeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const cafe = process.env.NEXT_PUBLIC_CAFE_NAME || "Coffee Shop";
  const data = await getCafeContent(cafe, locale);
  const theme = await getCafeTheme(cafe);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVarsFromTheme(theme) }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <GoogleAnalytics />
          <Header
            locale={locale}
            cafe={cafe}
            nav={data.nav}
            siteName={data.site.name}
          />
          <main className="min-h-[60vh]">{children}</main>
          <Footer locale={locale} cafe={cafe} data={data} />
        </ThemeProvider>
      </body>
    </html>
  );
}
