import NoVideoAvatar from "assets/img/avatar.png";
import styles from "./Stage.module.css";

import { useSession } from "components/OT";
import { useMe } from "components/MeProvider";
import { useAudioVideo } from "components/AudioVideoProvider";

import RoomControlProvider from "./components/RoomControlProvider";
import ShareButton from "./components/ShareButton";
import RecordButton from "./components/RecordButton";
import RoomControlButton from "./components/RoomControlButton";
import LeaveButton from "./components/LeaveButton";
import RoomBadge from "./components/RoomBadge";
import StreamStage from "components/StreamStage";
import { MediaControl } from "components/AudioVideoProvider";
import { OTPublisher, OTSubscriber } from "components/OT";

function Stage () {
  const { me } = useMe();
  const { streams } = useSession();
  const { hasAudio, hasVideo } = useAudioVideo();

  return (
    <RoomControlProvider>
      <div className={styles.main}>
        <div className={styles.videoContainer}>
          <RoomBadge />
          <StreamStage layout="default" empty>
            <StreamStage.Participants>
              <OTPublisher
                properties={{
                  publishAudio: hasAudio,
                  publishVideo: hasVideo,
                  name: me.name,
                  style: {
                    backgroundImageURI: NoVideoAvatar,
                    nameDisplayMode: "on"
                  }
                }}
              />
              {
                streams.map(
                  (stream) => (
                    <OTSubscriber
                      key={stream.streamId}
                      properties={{
                        style: {
                          backgroundImageURI: NoVideoAvatar,
                          nameDisplayMode: "on"
                        }
                      }}
                      stream={stream}
                    />
                  )
                )
              }
            </StreamStage.Participants>
            <StreamStage.Dominant>
              <OTPublisher useDummy />
            </StreamStage.Dominant>
          </StreamStage>
        </div>
        <div className={styles.controls}>
          <div className={styles.left}>
            <ShareButton />
            <div className={styles.margin}>&nbsp;</div>
            <RecordButton />
          </div>
          <div className={styles.middle}>
            <MediaControl.AudioButton />
            <MediaControl.VideoButton />
          </div>
          <div className={styles.right}>
            <RoomControlButton />
            <div className={styles.margin}>&nbsp;</div>
            <LeaveButton />
          </div>
        </div>
      </div>
    </RoomControlProvider>
  )
}

export default Stage;
