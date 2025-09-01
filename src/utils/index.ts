// Proxy for Tailwind Classes
export const twc = (classNames: any) => {
  return new Proxy(classNames, {
    get(target, prop) {
      const value = target[prop];
      if (value && typeof value === "object" && "DEFAULT" in value) {
        return new Proxy(value, {
          get(obj, innerProp) {
            if (
              innerProp === Symbol.toPrimitive ||
              innerProp === "toString" ||
              innerProp === "valueOf"
            ) {
              return () => obj.DEFAULT;
            }
            if (innerProp === "DEFAULT") return obj.DEFAULT;
            return obj[innerProp];
          },
        });
      }
      return value;
    },
  });
};

// Utility function for throttling
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func(...args);
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  }) as T;
};
