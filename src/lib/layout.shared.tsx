import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src={"/icon-black.svg"} className="w-8 h-8" />
          <span className="font-bold">vibetake docs</span>
        </>
      ),
    },
    links: [],
  };
}
