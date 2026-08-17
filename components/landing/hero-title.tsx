import { cn } from "@/lib/utils";

type HeroTitleProps = {
  title: string;
  titleRest?: string;
  className?: string;
  restClassName?: string;
};

export function HeroTitle({
  title,
  titleRest,
  className,
  restClassName,
}: HeroTitleProps) {
  return (
    <h1 className={className}>
      <span className="title-line">{title}</span>
      {titleRest ? (
        <>
          <br />
          <span className={cn("title-line", restClassName)}>{titleRest}</span>
        </>
      ) : null}
    </h1>
  );
}
