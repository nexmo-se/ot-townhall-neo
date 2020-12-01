// @flow
import React from "react";
import User from "entities/user";

import useStyles from "./styles";
import useSession from "hooks/session";
import useMessage from "hooks/message";

import IFrame from "components/IFrame";

function RemoteSlidesPanel() {
  const [hasAccess, setHasAccess] = React.useState<boolean>(false);
  const [iframeURL, setIFrameURL] = React.useState<string>("");
  const { session } = useSession();
  const { intendedForMe, ack } = useMessage();
  const mStyles = useStyles();

  const grantSlidesAccess = React.useCallback(({ data }) => {
    const jsonData = JSON.parse(data);
    if(intendedForMe({ data: JSON.stringify(jsonData.target) })) {
      setIFrameURL(`https://slides.limhenry.xyz/${jsonData.pin}`)
      setHasAccess(true);
      ack({
        type: "slides-access",
        data: User.fromConnection(session.connection)
      });
    }
  }, [intendedForMe, ack, session])

  const revokeSlidesAccess = React.useCallback(({ data }) => {
    if(intendedForMe({ data })) {
      setHasAccess(false);
      ack({
        type: "revoke-slides-access",
        data: User.fromConnection(session.connection)
      })
    }
  }, [intendedForMe, ack, session])

  React.useEffect(() => {
    if(session) session.on("signal:slides-access", grantSlidesAccess);
    if(session) session.on("signal:revoke-slides-access", revokeSlidesAccess);
    
    return function cleanup() {
      if(session) session.off("signal:slides-access", grantSlidesAccess);
      if(session) session.off("signal:revoke-slides-access", revokeSlidesAccess);
    }
  }, [session, grantSlidesAccess, revokeSlidesAccess])
  
  return (
    <div className={mStyles.root}>
      { (hasAccess && iframeURL)? (
        <>
          <IFrame 
            src={iframeURL}
          />
          <div className={mStyles.topCover}>
            &nbsp;
          </div>
          <div className={mStyles.bottomCover}>
            &nbsp;
          </div>
        </>
      ): (
        <p>Sorry, you don't have access to this section</p>
      )}
    </div>
  ) 
}
export default RemoteSlidesPanel;