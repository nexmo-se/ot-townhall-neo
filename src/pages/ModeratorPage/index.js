// @flow
import React from "react";
import config from "config";
import clsx from "clsx";
import LayoutManager from "utils/layout-manager";
import User from "entities/user";
import CredentialAPI from "api/credential";

import useStyles from "./styles";
import useSession from "hooks/session";
import useSubscriber from "hooks/subscriber";
import usePublisher from "hooks/publisher";
import useMe from "hooks/me";

import LiveBadge from "components/LiveBadge";
import AskNameDialog from "components/AskNameDialog";
import FullPageLoading from "components/FullPageLoading";
import RaisedHandList from "components/RaisedHandList";
import ParticipantList from "components/ParticipantList";
import LiveParticipantList from "components/LiveParticipantList";
import LiveParticipantItem from "components/LiveParticipantItem";
import ShareScreenButton from "components/ShareScreenButton";
import RecordButton from "components/RecordButton";
import LayoutContainer from "components/LayoutContainer";
import ModeratorMessageTab from "components/ModeratorMessageTab";

function ModeratorPage(){
  const [ me, setMe ] = React.useState<User|void>();
  const mStyles = useStyles();
  const mSession = useSession();
  const mMe = useMe();
  const mPublisher = usePublisher("cameraContainer", true, false);
  const mScreenPublisher = usePublisher("cameraContainer");
  const mSubscriber = useSubscriber({ 
    moderator: "cameraContainer", 
    camera: "cameraContainer", 
    screen: "cameraContainer" 
  });

  function handleNameSubmit(user:User){
    setMe(user);
  }

  async function connect(){
    if(me){
      const credential = await CredentialAPI.generateCredential("moderator", me.toJSON())
      await mSession.connect(credential);
      mMe.setMe(me);
    }
  }

  async function handleShareScreenClick(){
    if(mSession.session && !mScreenPublisher.stream){
      const screenUser = new User("sharescreen", "sharescreen");
      await mScreenPublisher.publish(screenUser, { videoSource: "screen" });
    }else if(mSession.session && mScreenPublisher.stream){
      mScreenPublisher.unpublish();
    }
  }

  React.useEffect(() => {
    if(me) connect();
  }, [ me ]);

  React.useEffect(() => {
    if(mSession.session) mPublisher.publish(me);
  }, [ mSession.session ])

  React.useEffect(() => {
    if(mSession.session) mSubscriber.subscribe(mSession.streams);
  }, [ mSession.streams, mSession.session ]);

  if(!me && !mSession.session) {
    return (
      <AskNameDialog 
        pin={config.moderatorPin}
        role="moderator"
        onSubmit={handleNameSubmit}
      />
    )
  }
  else if(me && !mSession.session) return <FullPageLoading />
  else if(me && mSession.session) return (
    <div className={mStyles.container}>
      <div className={mStyles.leftPanel}>
        <div className={mStyles.chat} style={{ 
            borderBottom: "1px solid #e7ebee",
            flexBasis: "30%"
          }}
        >
          <h4 className="Vlt-center">RAISING HAND</h4>
          <RaisedHandList />
        </div>
        <div className={mStyles.chat} style={{ 
            flexBasis: "70%",
            paddingLeft: 32, 
            paddingRight: 32, 
            paddingTop: 32 
          }}
        >
          <ModeratorMessageTab />
        </div>
      </div>
      <div className={mStyles.centerPanel}>
        <div className={mStyles.chat} style={{ flexBasis: "50%", borderBottom: "1px solid #e7ebee" }}>
          <h4 className="Vlt-center">LIVE PARTICIPANTS</h4>
          <LiveParticipantList subscribers={mSubscriber.subscribers}>
            {mPublisher.publisher? (
              <LiveParticipantItem 
                user={me} 
                publisher={mPublisher.publisher} 
                additionalControls={(
                  <React.Fragment>
                    <RecordButton 
                      size={32}
                      fontSize={16}
                      style={{ marginRight: 8 }}
                    />
                    <ShareScreenButton 
                      size={32}
                      fontSize={16}
                      style={{ marginRight: 8 }}
                      onClick={handleShareScreenClick}
                      isSharing={!!mScreenPublisher.stream}
                    />
                  </React.Fragment>
                )}
                />
              ): null}
          </LiveParticipantList>
        </div>
        <div className={mStyles.chat} style={{ flexBasis: "50%", paddingTop: 32 }}>
          <h4 className="Vlt-center">PARTICIPANTS ({mSession.connections.length})</h4>
          <ParticipantList />
        </div>
      </div>
      <div className={clsx(
        mStyles.rightPanel,
        mStyles.black
      )}>
        <LayoutContainer id="cameraContainer" size="big" />
        <LiveBadge className={mStyles.liveBadge} />
      </div>
    </div>
  )
}
export default ModeratorPage;