import { useCallback, useEffect, useState, type ReactPortal } from "react";
import ReactDOM from "react-dom";

type MyPortal =
  | {
      render: ({ children }: { children: React.ReactNode }) => ReactPortal;
      remove: () => boolean;
    }
  | { render: () => void; remove: () => void };

export const usePortal = (el: HTMLDivElement) => {
  const [portal, setPortal] = useState<MyPortal>({
    render: () => null,
    remove: () => null,
  });

  const createPortal = useCallback((el: HTMLDivElement) => {
    const render = ({ children }: { children: React.ReactNode }) => ReactDOM.createPortal(children, el);
    const remove = () => ReactDOM.unmountComponentAtNode(el);
    return { render, remove };
  }, []);

  useEffect(() => {
    if (el) portal.remove();

    const newPortal = createPortal(el);
    setPortal(newPortal);
    return () => {
      //cleanup
      newPortal.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el, createPortal]);

  return portal.render;
};
