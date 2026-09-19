import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BLOG_POSTS } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      siteName: SITE_NAME,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <header className="mx-auto max-w-3xl px-4 pb-10 pt-14">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          <span className="text-neon-cyan">{post.category}</span>
          <span>·</span>
          <span>{post.readTime}</span>
          <span>·</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 font-mono text-base leading-relaxed text-ink-dim">
          {post.description}
        </p>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-20">
        {post.sections.map((section, i) => (
          <div key={i} className="mb-8">
            {section.heading && (
              <h2 className="mb-3 font-sans text-2xl font-bold text-ink">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((p, j) => (
              <p
                key={j}
                className="mb-4 font-mono text-sm leading-relaxed text-ink-dim"
              >
                {p}
              </p>
            ))}
          </div>
        ))}

        <div className="mt-12 border-t border-surface-border pt-6">
          <Link
            href="/blog"
            className="font-mono text-xs text-neon-cyan transition-colors hover:text-neon-cyan/70"
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    </article>
  );
}
