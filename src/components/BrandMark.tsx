type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className="brand-mark" aria-label="Response-Able Solutions">
      <img
        className="brand-mark__image"
        src={`${import.meta.env?.VITE_BASE_URL}brand/ras-mark.jpg`}
        alt=""
        width="56"
        height="56"
      />
      {!compact && (
        <span className="brand-mark__copy">
          <strong>Response-Able</strong>
          <span>Solutions Ltd.</span>
        </span>
      )}
    </span>
  );
}
