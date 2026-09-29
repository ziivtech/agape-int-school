function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/** Portrait, or tasteful initials when there's no photo yet. */
export default function AlumniAvatar({
  name,
  photoUrl,
  className = "",
  textClass = "text-2xl",
}: {
  name: string;
  photoUrl: string;
  className?: string;
  textClass?: string;
}) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name} loading="lazy" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-[#EFE9F1] font-serif text-[#6C0798]/70 ${textClass} ${className}`} aria-hidden="true">
      {initials(name)}
    </div>
  );
}
