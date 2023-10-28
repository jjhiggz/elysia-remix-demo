import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return <>{isLoaded && children}</>;
};
