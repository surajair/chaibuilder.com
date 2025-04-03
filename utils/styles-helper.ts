import {
  ChaiFont,
  ChaiFontViaSrc,
  getRegisteredFont,
} from "@chaibuilder/sdk/runtime";
import fs from "fs/promises";
import { compact, filter, has, map, uniqBy } from "lodash";
import path from "path";
import postcss from "postcss";

async function findTailwindCssFile(): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    const chunksDir = path.join(process.cwd(), ".next/static/chunks");
    try {
      const files = await fs.readdir(chunksDir);
      // Find all CSS files that match the pattern
      const tailwindCssFiles = files.filter((file) =>
        file.match(/^app_\(public\)_globals.*\.css$/)
      );

      if (tailwindCssFiles.length > 0) {
        // Use the first matching file
        return path.join(chunksDir, tailwindCssFiles[0]);
      }
    } catch (error) {
      // Handle case where directory doesn't exist or can't be read
      console.warn("Could not read .next/static/chunks directory:", error);
    }
  }
  // Use absolute path for production to work on Vercel
  return path.resolve("./public/chaistyles.css");
}

export async function filterDuplicateStyles(
  newStyles: string
): Promise<string> {
  try {
    const tailwindCssPath = await findTailwindCssFile();
    const tailwindCss = await fs.readFile(tailwindCssPath, "utf-8");

    const tailwindRoot = postcss.parse(tailwindCss);
    const newStylesRoot = postcss.parse(newStyles);

    const tailwindSelectors = new Set<string>();
    tailwindRoot.walkRules((rule) => {
      tailwindSelectors.add(rule.selector);
    });

    newStylesRoot.walkRules((rule) => {
      if (tailwindSelectors.has(rule.selector)) {
        rule.remove();
      }
    });

    return newStylesRoot.toString();
  } catch (error) {
    console.error("Error filtering styles:", error);
    return newStyles;
  }
}

export const getChaiCommonStyles = async () => {
  const tailwindCssPath = await findTailwindCssFile();
  const tailwindCss = await fs.readFile(tailwindCssPath, "utf-8");
  return tailwindCss;
};

/** TODO: Move to @chaibuilder/sdk/render */
export const getThemeCustomFontFace = (fonts: string[]) => {
  const fontdefintions = filter(
    compact(map(fonts, getRegisteredFont)),
    (font: ChaiFont) => has(font, "src")
  );
  return getThemeCustomFontFaceStyle(fontdefintions as ChaiFontViaSrc[]);
};

export const getThemeCustomFontFaceStyle = (fonts: ChaiFontViaSrc[]) => {
  if (!fonts || fonts.length === 0) return "";

  return uniqBy(fonts, "family")
    .map((font: ChaiFontViaSrc) =>
      font.src
        .map(
          (source) => `@font-face {
        font-family: "${font.family}";
        src: url("${source.url}") format("${source.format}");
        font-display: swap;
        ${source.fontWeight ? `font-weight: ${source.fontWeight};` : ""}
        ${source.fontStyle ? `font-style: ${source.fontStyle};` : ""}
        ${source.fontStretch ? `font-stretch: ${source.fontStretch};` : ""}
      }`
        )
        .join("\n")
    )
    .join("\n");
};

export const getFontHref = (fonts: string[]): string[] => {
  const fontdefintions = filter(
    uniqBy(compact(map(fonts, getRegisteredFont)), "family"),
    (font: ChaiFont) => has(font, "url")
  );
  if (fontdefintions.length === 0) return [];
  return map(fontdefintions, "url") as string[];
};
