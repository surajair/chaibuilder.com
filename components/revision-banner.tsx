import { startCase } from "lodash";

export default function RevisionBanner({
  type,
  label,
  time,
}: {
  type: string;
  label: string;
  time: string;
}) {
  return (
    <div id="chai-preview-banner" className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 to-pink-600">
      <div className="w-full py-2 px-4 mx-auto">
        <div className="flex items-center justify-start gap-2">
          <p className="text-white font-medium">{startCase(type)}</p>
          {label && <span className="bg-white/20 px-2 py-1 rounded text-white text-xs">#{label}</span>}
          {time && <span className="text-white/80 text-xs italic"> published at {new Date(time).toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}
