import { useCallback, useRef } from "react";

/**
 * Wrapper for `new IntersectionObserver(callback, options)`
 *
 * [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 *
 * note: this is the simplest I could make it. options are static (not part of dependency array of callback)
 *
 * ### Example
 *
 * ```ts
 * const ref = useIntersectionObserver<HTMLDivElement>(([entry]) => {
 *   if (!!entry?.isIntersecting) {
 *     //do something
 *   }
 * });
 * ```
 */
export function useIntersectionObserverCallback<T extends Element>(
  callback: IntersectionObserverCallback,
  deps: Array<string | number | boolean | undefined>,
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
