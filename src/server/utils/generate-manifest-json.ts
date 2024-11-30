import { Site } from "@cyberbus-net/cyberbus-js-client";
import { fetchIconPng } from "./fetch-icon-png";
import { getStaticDir } from "@utils/env";
import path from "path";
import fs from "fs/promises";

type Icon = { sizes: string; src: string; type: string; purpose: string };
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
let icons: Icon[] | null = null;

function mapIcon(src: string, size: number): Icon {
  return {
    sizes: `${size}x${size}`,
    type: "image/png",
    src,
    purpose: "any maskable",
  };
}

function generateDefaultIcons() {
  return iconSizes.map(size =>
    mapIcon(`${getStaticDir()}/assets/icons/icon-${size}x${size}.png`, size),
  );
}

export default async function (site: Site) {
  if (!icons) {
    try {
      const icon = site.icon ? await fetchIconPng(site.icon) : null;

      if (icon) {
        // 修改保存路径到 public 根目录
        const iconDir = path.join(process.cwd(), "public");
        await fs.mkdir(iconDir, { recursive: true });

        icons = await Promise.all(
          iconSizes.map(async size => {
            const sharp = (await import("sharp")).default;
            const fileName = `icon-${size}x${size}.png`;
            const filePath = path.join(iconDir, fileName);

            await sharp(icon).resize(size, size).png().toFile(filePath);

            // 修改引用路径，直接从根路径引用
            return mapIcon(`/${fileName}`, size);
          }),
        );
      } else {
        icons = generateDefaultIcons();
      }
    } catch (error) {
      console.error("Error generating manifest icons:", error);
      icons = generateDefaultIcons();
    }
  }

  return {
    name: site.name,
    description: site.description ?? "A link aggregator for the fediverse",
    start_url: "/",
    scope: "/",
    display: "standalone",
    id: "/",
    background_color: "#222222",
    theme_color: "#222222",
    icons,
    shortcuts: [
      {
        name: "Search",
        short_name: "Search",
        description: "Perform a search.",
        url: "/search",
      },
      {
        name: "Communities",
        url: "/communities",
        short_name: "Communities",
        description: "Browse communities",
      },
      {
        name: "Create Post",
        url: "/create_post",
        short_name: "Create Post",
        description: "Create a post.",
      },
    ],
    related_applications: [
      {
        platform: "f-droid",
        url: "https://f-droid.org/packages/com.jerboa/",
        id: "com.jerboa",
      },
    ],
  };
}
