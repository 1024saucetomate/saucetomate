"use client";

import { useRouter } from "next/navigation";

export default function Link({ children, href, ...props }: Readonly<{ children: React.ReactNode; href: string }>) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("smooth-transition-container")?.classList.add("hidden");
    setTimeout(() => {
      router.push(href);
    }, 500);
  }
  return (
    <a href={href} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
