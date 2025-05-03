export default function PreviewBanner({ slug }: { slug: string }) {
  return (
    <div
      id="chai-preview-banner"
      className="sticky top-0 z-50 bg-primary"
      style={{ backgroundColor: "#ea580c" }}>
      <div className="w-full py-1 px-2 mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-white text-sm">
            You are viewing page in preview mode
          </p>

          <div className="ps-3 ms-auto">
            <a
              href={`/chai/api/preview?disable=true&slug=${slug}`}
              type="button"
              className="flex text-xs items-center rounded-lg p-1 text-white bg-white/30 px-2 focus:outline-none focus:bg-white/10"
              data-hs-remove-element="#chai-preview-banner">
              <span>Exit Preview Mode</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
