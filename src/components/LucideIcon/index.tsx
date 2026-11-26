import React, { Suspense, lazy, useEffect, useState } from "react";
import type { IconName } from "lucide-react/dynamic";

import { loadLucideCatalog, toLucideKebab } from "../../utils/lucideIcons";

const DynamicIcon = lazy(() =>
  import("lucide-react/dynamic").then((mod) => ({
    default: mod.DynamicIcon,
  }))
);

interface LucideIconProps {
  name?: string | null;
  size?: number;
  color?: string;
}

const LucideIcon: React.FC<LucideIconProps> = ({
  name,
  size = 24,
  color = "currentColor",
}) => {
  const [resolved, setResolved] = useState<IconName | null>(null);

  useEffect(() => {
    let active = true;
    const kebab = toLucideKebab(name);

    if (!kebab) {
      setResolved(null);
      return;
    }

    loadLucideCatalog()
      .then(({ known }) => {
        if (!active) {
          return;
        }

        setResolved(known.has(kebab) ? (kebab as IconName) : null);
      })
      .catch(() => {
        if (active) {
          setResolved(null);
        }
      });

    return () => {
      active = false;
    };
  }, [name]);

  if (!resolved) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <span
          style={{ width: size, height: size, display: "inline-block" }}
          aria-hidden
        />
      }
    >
      <DynamicIcon name={resolved} size={size} color={color} />
    </Suspense>
  );
};

export default LucideIcon;
