"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="not-found surface-dark">
      <div className="container-narrow">
        <p className="eyebrow">SYSTEM INTERRUPTION</p>
        <h1>Something did not resolve.</h1>
        <p>Try the route again. If the problem continues, contact hello@realization.world.</p>
        <button className="button button--primary" type="button" onClick={reset}>Try again</button>
      </div>
    </section>
  );
}
