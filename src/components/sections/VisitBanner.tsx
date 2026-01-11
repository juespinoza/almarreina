import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

export default function VisitBanner({
  cafe,
  visit,
  googleMapsUrl,
}: {
  cafe: string;
  visit: { title: string; text: string; button: string };
  googleMapsUrl: string;
}) {
  return (
    <section className="rounded-sm border border-border bg-surface shadow-soft p-8 text-center">
      <h2 className="text-3xl md:text-4xl">{visit.title}</h2>
      <p className="mt-2 text-sm text-muted">{visit.text}</p>

      <div className="mt-6 flex justify-center">
        <Link
          href={googleMapsUrl}
          target="_blank"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white text-sm font-semibold
                     hover:bg-primary/90 hover:translate-y-px transition shadow-soft"
          onClick={() =>
            trackEvent("cta_click", {
              location: "home",
              action: "how_to_arrive",
            })
          }
        >
          {visit.button}
        </Link>
      </div>
    </section>
  );
}
