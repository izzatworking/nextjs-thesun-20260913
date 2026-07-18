interface AdBannerProps {
  label?: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  color?: string;
  rate?: string;
}

const colors = [
  '#2563eb', '#dc2626', '#059669', '#7c3aed', '#ca8a04',
  '#0891b2', '#be185d', '#65a30d', '#4f46e5', '#c2410c'
];

export default function AdvertisementBanner({
  label = 'Advertisement',
  desktopWidth,
  desktopHeight,
  mobileWidth,
  mobileHeight,
  color,
  rate,
}: AdBannerProps) {
  const bgColor = color || colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">{label}</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="block mx-auto max-w-fit rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
      >
        {/* Desktop */}
        <div
          className="hidden md:flex items-center justify-center relative"
          style={{ width: desktopWidth, height: desktopHeight, backgroundColor: bgColor }}
        >
          <div className="text-center px-6">
            <p className="text-white/90 text-sm font-semibold tracking-wide uppercase">{label}</p>
            <p className="text-white/60 text-xs mt-1 font-mono">
              {desktopWidth} &times; {desktopHeight}
            </p>
            {rate && (
              <p className="text-white/40 text-[10px] mt-1">{rate}</p>
            )}
          </div>
        </div>
        {/* Mobile */}
        <div
          className="md:hidden flex items-center justify-center relative"
          style={{ width: mobileWidth, height: mobileHeight, backgroundColor: bgColor }}
        >
          <div className="text-center px-4">
            <p className="text-white/90 text-xs font-semibold tracking-wide uppercase">{label}</p>
            <p className="text-white/60 text-[10px] mt-0.5 font-mono">
              {mobileWidth} &times; {mobileHeight}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
