// @flow
import React from "react";
import LayoutManager from "utils/layout-manager";
import clsx from "clsx";
import lodash from "lodash";

import useStyles from "./styles";
import useSession from "hooks/session";

interface ILayoutContainer { 
  id: string; 
  size: "big" | "small" | "screen";
  hidden?: boolean;
  children?: any;
}

function LayoutContainer({ id, size = "big", hidden, children }: ILayoutContainer){
  const { streams, session } = useSession();
  const mStyles = useStyles();
  const containerRef = React.useRef();
  const layoutRef = React.useRef<any>();

  React.useEffect(() => {
    layoutRef.current = new LayoutManager(id);
    const observer = new MutationObserver((mutationList => {
      for(const mutation of mutationList){
        if(mutation.type === "childList") layoutRef.current.layout(session, streams);
      }
    }));
    if(containerRef.current) observer.observe(containerRef.current, { childList: true });
  }, [id, session, streams]);

  React.useEffect(() => {
    if(layoutRef.current) layoutRef.current.layout(session, streams)
  }, [session, streams, size]);

  React.useEffect(() => {
    window.addEventListener("resize", lodash.debounce(() => {
      if(layoutRef.current) layoutRef.current.layout(session, streams);
    }, 150))
  } , [session, streams])

  return (
    <div 
      id={id} 
      ref={containerRef}
      className={clsx({
        [mStyles.container]: true,
        [mStyles.black]: true,
        [mStyles.big]: size === "big",
        [mStyles.hidden]: hidden,
        [mStyles.screen]: size === "screen"
      })}
    >
      {children}
    </div>
  );
}
export default LayoutContainer;