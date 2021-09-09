import styles from "./LayoutContainer.module.css";

import LayoutManager from "./utils/layout-manager";
import clsx from "clsx";
import lodash from "lodash";

import useSession from "hooks/session";
import { useRef, useEffect } from "react";

function LayoutContainer (props) {
  const id = lodash(props).get("id");
  const size = lodash(props).get("size", "big");
  const hidden = lodash(props).get("hidden", false);
  const children = lodash(props).get("children");

  const { streams, session } = useSession();
  const containerRef = useRef();
  const layoutRef = useRef();

  /**
   * Listen for additional child added to the container
   */
  useEffect(
    () => {
      layoutRef.current = new LayoutManager(id);

      const observer = new MutationObserver(
        (mutationList) => {
          for (const mutation of mutationList) {
            if (mutation.type === "childList") {
              layoutRef.current.layout(session, streams);
            }
          }
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current, { childList: true });
      }

    },
    [id, session, streams]
  );

  useEffect(
    () => {
      if (layoutRef.current) layoutRef.current.layout(session, streams)
    },
    [session, streams, size]
  );

  /**
   * A listener for resize. When resize, the layout container needs to adapt the layour
   */
  useEffect(
    () => {
      window.addEventListener("resize", lodash.debounce(
        () => {
          if (layoutRef.current) layoutRef.current.layout(session, streams);
        }, 150)
      )
    },
    [session, streams]
  )

  return (
    <div 
      id={id} 
      ref={containerRef}
      className={
        clsx({
          [styles.container]: true,
          [styles.black]: true,
          [styles.big]: size === "big",
          [styles.hidden]: hidden,
          [styles.screen]: size === "screen"
        }
      )}
    >
      {children}
    </div>
  );
}
export default LayoutContainer;