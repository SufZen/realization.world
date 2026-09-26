import Image from "next/image";

type EditorialMediaProps = {
  src: string;
  alt: string;
  label: string;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function EditorialMedia({ src, alt, label, caption, priority = false, className = "" }: EditorialMediaProps) {
  return (
    <figure className={`editorial-media ${className}`.trim()}>
      <div className="editorial-media__image">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 760px) 100vw, (max-width: 1120px) 90vw, 50vw"
        />
        <span className="editorial-media__label">{label}</span>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
