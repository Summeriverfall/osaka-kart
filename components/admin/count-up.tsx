"use client";

import { useEffect, useState } from "react";
import { formatYenShort } from "@/lib/format";

type CountUpProps = {
  value: number;
  yen?: boolean;
};

export function CountUp({ value, yen }: CountUpProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{yen ? formatYenShort(current) : current.toLocaleString("en-US")}</>;
}
