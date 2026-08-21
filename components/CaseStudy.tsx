import Link from "next/link";
import { CASE_STUDY } from "@/lib/data";

type CaseStudyItem = {
  slug: string;
  title: string;
  description: string | null;
  category: string;
  tags: string[];
  published_at: string | null;
  posterUrl: string;
  posterUrlOptimized: (width: number, quality?: number) => string;
};

type RelatedItem = {
  slug: string;
  title: string;
  category: string;
  posterUrlOptimized: (width: number, quality?: number) => string;
};

export default function CaseStudy({
  item,
  categoryLabel,
  related,
}: {
  item: CaseStudyItem;
  categoryLabel: string;
  related: RelatedItem[];
}) {
  const published = item.published_at
    ? new Date(item.published_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section className="case">
      <div className="case-inner">
        <Link href="/#work" className="case-back">
          {CASE_STUDY.back}
        </Link>

        <span className="section-eyebrow">{categoryLabel}</span>
        <h1 className="case-title">{item.title}</h1>
        {item.description && <p className="case-desc">{item.description}</p>}

        {item.tags.length > 0 && (
          <div className="case-tags">
            {item.tags.map((tag) => (
              <span key={tag} className="case-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="peel-frame case-poster">
          <img
            src={item.posterUrlOptimized(1600)}
            alt={`${item.title} — campaign frame`}
          />
        </div>

        <div className="case-meta">
          <span>
            {CASE_STUDY.categoryLabel}: {categoryLabel}
          </span>
          {published && (
            <span>
              {CASE_STUDY.publishedLabel}: {published}
            </span>
          )}
        </div>

        {related.length > 0 && (
          <>
            <h2 className="case-related-title">{CASE_STUDY.related}</h2>
            <div className="work-grid case-related-grid">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/work/${rel.slug}`}
                  className="work-item"
                  aria-label={`${rel.title} case study`}
                >
                  <figure>
                    <div className="peel-frame">
                      <img
                        src={rel.posterUrlOptimized(800)}
                        alt={`Work frame — ${rel.title}`}
                        loading="lazy"
                      />
                    </div>
                    <figcaption>{rel.title}</figcaption>
                  </figure>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
