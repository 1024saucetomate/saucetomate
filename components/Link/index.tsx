"use client";

import { useRouter } from "next/navigation";

import type { LinkProps } from "@/utils/interfaces";

const Link = ({ children, href, className, ...props }: LinkProps): JSX.Element => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    const transitionElement = document.getElementById("smooth-transition-container");
    transitionElement?.classList.add("hidden");

    setTimeout(() => {
      router.push(href);
    }, 500);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
