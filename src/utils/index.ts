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
