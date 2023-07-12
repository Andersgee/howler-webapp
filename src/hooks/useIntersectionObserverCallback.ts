import { useCallback, useRef } from "react";

/**
 * hook for `new IntersectionObserver(callback, options)`
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
 *
 * ### Example
 *
 * ```ts
 * const ref = useIntersectionObserver<HTMLDivElement>(([entry]) => {
 *   const isIntersecting = !!entry?.isIntersecting;
 *   if (isIntersecting && someDependency === "hello") {
 *     //do something
 *   }
 * }, [someDependency]);
 * ```
 */
export function useIntersectionObserverCallback<T extends Element>(
  callback: IntersectionObserverCallback,
  deps: Array<string | number | boolean | undefined | null | Array<any>>,
  options?: IntersectionObserverInit
) {
  const observer = useRef<IntersectionObserver | null>(null);

  //see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  return useCallback((element: T) => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    if (element !== null) {
      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(element);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
