import { Metadata } from "next";
import Image from "next/image";
import { getCafeContent } from "@/lib/content";
import { Locale } from "@/lib/i18n";
import { buildMetadata, buildPageTitle } from "@/lib/seo";
import { cloudinaryUrl } from "@/lib/cloudinary";
import Story from "@/components/sections/Story";
import Team from "@/components/sections/Team";

export const revalidate = 3600; // 1 hora

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cafe = process.env.NEXT_PUBLIC_CAFE_NAME || "Coffee Shop";
  const data = await getCafeContent(cafe, locale);

  const pageTitle = data?.aboutPage?.title ?? data?.nav?.about ?? "About";

  const dataWithSeo = {
    ...data,
    seo: {
      ...(data?.seo ?? {}),
      title: buildPageTitle(pageTitle, data?.site?.name ?? cafe),
      description: data?.aboutPage?.subtitle ?? data?.site?.description ?? "",
    },
  };

  return buildMetadata(
    { locale: locale, cafe: cafe, slug: "about" },
    dataWithSeo
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale; cafe: string }>;
}) {
  const { locale, cafe } = await params;
  const data = await getCafeContent(cafe, locale);
  return (
    <div className="bg-bg">
      <header className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="text-4xl font-semibold">{data.aboutPage.title}</h1>
          <p className="mt-2 opacity-90">{data.aboutPage.subtitle}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Story
          cafe={cafe}
          folder={data.site.cloudinaryFolder}
          story={data.aboutPage.story}
        />

        <div className="mt-14">
          <Team
            title={data.aboutPage.teamTitle}
            subtitle={data.aboutPage.teamSubtitle}
            team={data.aboutPage.team}
          />
        </div>

        {data.aboutPage?.bannerImage && (
          <div className="mt-14 rounded-xl2 border border-border shadow-soft overflow-hidden">
            <div className="relative h-65 md:h-90 bg-bg">
              <Image
                src={cloudinaryUrl(
                  data.site.cloudinaryFolder,
                  data.aboutPage.bannerImage
                )}
                alt="Banner"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
