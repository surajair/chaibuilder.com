import Image from "next/image";

export const Logo = () => (
  <div className="rounded-lg">
    <a
      className="flex-none flex rounded text-xl items-center font-semibold focus:outline-none focus:opacity-80"
      aria-label="Chai Builder"
      href="https://www.chaibuilder.com">
      <Image
        src={"https://ucarecdn.com/fbfc3b05-cb73-4e99-92a2-3a367b7c36cd/"}
        alt=""
        loading="lazy"
        width="30"
        height="30"
        decoding="async"
        data-nimg="1"
        className="w-8 h-8 text-primary-400 dark:text-primary-300 rounded"
      />
    </a>
  </div>
);
