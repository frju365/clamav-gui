import { Button } from "@/components/ui/button";
import { openUrl } from "@tauri-apps/plugin-opener";
import { MarkdownToJSX } from "markdown-to-jsx";

export const COMPONENTS: MarkdownToJSX.Overrides = {
     h1: { props: { className: "scroll-m-40 border-b pb-2 text-3xl font-semibold tracking-tight mt-0! mb-2!" } },
     h2: { props: { className: "scroll-m-40 border-b pb-2 text-2xl font-semibold tracking-tight mt-0! mb-2!" } },
     h3: { props: { className: "scroll-m-40 text-xl font-semibold tracking-tight mt-0! mb-2!", } },
     h4: { props: { className: "scroll-m-40 text-lg font-semibold tracking-tight mt-0! mb-2!", } },
     p: { props: { className: "leading-7" } },
     a: (props: React.ComponentProps<"a">) => (
          <Button variant="link" className="cursor-pointer px-0.5 py-0 whitespace-normal inline-block text-sm md:text-base break-all" onClick={()=>props.href ? openUrl(props.href) : {}}>
               {props.children}
          </Button>
     ),
     small: { props: { className: "text-sm font-medium leading-none" } },
}