import { processSteps } from "@/content/site";
import { Lines } from "./lines";

export function ProcessRibbon({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`process-ribbon ${compact ? "process-ribbon--compact" : ""}`}>
      {processSteps.map((step) => (
        <article className="process-step" key={step.number}>
          <div className="process-step__number">{step.number}</div>
          <div>
            <h3>{step.title}</h3>
            {!compact && <p><Lines text={step.text} /></p>}
          </div>
        </article>
      ))}
    </div>
  );
}
