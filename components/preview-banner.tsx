export default function PreviewBanner({ slug, revision }: { slug: string, revision?: { publishedBy: string, time: string, label?: string, type?: string } }) {
  return (
    <div id="chai-preview-banner" className="sticky top-0 z-50 bg-orange-600">
      <div className="w-full py-1 px-2 mx-auto">
        <div className="flex items-center justify-between">
          {revision ? (
            <p className="text-white text-sm">
              {revision.type === "revision" ? (
                <>Revision <span className="bg-white/20 px-1 py-1 bg-blue-500 rounded">#{revision.label}</span></>
              ) : (
                <><span className="bg-white/20 px-1 rounded">{revision.type === "live" ? "Live" : "Draft"}</span> version</>
              )}
              { revision.publishedBy ? 'published by ' + revision.publishedBy : " "} at {revision.time}
            </p>
          ) : ( 
            <p className="text-white text-sm">
              You are viewing page in preview mode
            </p>
          )}

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
