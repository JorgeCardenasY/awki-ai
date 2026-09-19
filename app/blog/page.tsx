import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Edge AI, LoRaWAN y Logística",
  description:
    "Artículos técnicos sobre Edge AI, reconocimiento de patentes (ALPR), LoRaWAN, privacidad (Ley 21.719) y trazabilidad logística en rutas sin cobertura.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <PageHeader
        kicker="[ BLOG TÉCNICO ]"
        title={
          <>
            Notas de <span className="text-neon-cyan">ingeniería</span>.
          </>
        }
        description="Artículos sobre la tecnología detrás de la trazabilidad logística en zonas sin cobertura: Edge AI, LoRaWAN, privacidad y casos de uso."
      />

      <div className="mx-auto max-w-4xl px-4 pb-20">
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="panel clip-corner group block p-6 transition-colors hover:bg-surface-raised"
            >
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
              <h2 className="mt-3 font-sans text-xl font-bold text-ink transition-colors group-hover:text-neon-cyan sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 font-mono text-sm leading-relaxed text-ink-dim">
                {post.description}
              </p>
              <span className="mt-3 inline-block font-mono text-xs text-neon-cyan">
                Leer artículo ▸
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
