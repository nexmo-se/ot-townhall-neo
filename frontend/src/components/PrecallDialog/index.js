// @flow
// This will not create a new session.
// However, a new publisher will be there
import AvatarImage from "assets/img/avatar.png";

import React from "react";
import OT from "@opentok/client";
import clsx from "clsx";
import { Publisher } from "@opentok/client";

import useStyles from "./styles";
import useUser from "hooks/me";
import useMessage from "hooks/message";
import { useEffect, useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";
import Icon from "components/Icon";
import Switch from "components/Switch";

interface PrecallDialogProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  onApprove: (value: Publisher) => void;
}

function PrecallDialog ({ visible, setVisible, onApprove }: PrecallDialogProps) {
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [hasMic, setHasMic] = useState<boolean>(true);
  const [publisher, setPublisher] = useState<Publisher | void>();
  const { me } = useUser();
  const { rejectGoLive } = useMessage();
  const mStyles = useStyles();

  function handleRejectClick () {
    if (!me) return;

    // Inform moderator that you reject the request
    rejectGoLive({ user: me });

    // close the dialog
    setVisible(false);
  }

  function handleApproveClick () {
    if (onApprove) {
      onApprove({
        hasAudio: hasMic,
        hasVideo: hasCamera,
        publisher
      });
    }
    setVisible(false);
  }

  function handleSwitchClick () {
    if (!publisher) return;
    publisher.cycleVideo();
  }

  useEffect(
    () => {
      if (!visible) return;
      
      const publisher = OT.initPublisher("precall-publisher", {
        insertMode: "append",
        name: "Precall",
        style: {
          buttonDisplayMode: "off",
          nameDisplayMode: "on",
          backgroundImageURI: AvatarImage
        }
      });
      setPublisher(publisher);
    },
    [visible]
  );

  useEffect(
    () => {
      if (!publisher) return;

      publisher.publishVideo(hasCamera);
    },
    [hasCamera, publisher]
  );

  useEffect(
    () => {
      if (!publisher) return;

      publisher.publishAudio(hasMic);
    },
    [hasMic, publisher]
  );

  useEffect(
    () => {
      if (!publisher) return;

      if (!visible) {
        publisher.destroy()
        setPublisher(undefined);
      }
    },
    [publisher, visible]
  )


  return (
    <Modal
      id="precall-dialog"
      open={visible}
      large
    >
      <Modal.Header>
        <h3>The moderator has invited you to Go Live</h3>
      </Modal.Header>
      <Modal.Content>
        <div className={mStyles.wrapper}>
          <div className={mStyles.container}>
            <div
              id="precall-publisher"
              className={mStyles.marginRight}
            />
            <div style={{ width: "100%", marginTop: 16 }}>
              <div className={mStyles.item}>
                <div className={mStyles.subItem}>
                  <Icon
                    name="Vlt-icon-video-active-full"
                    className={mStyles.marginRight}
                  />
                  <p>Camera</p>
                </div>
                <div className={mStyles.subItem}>
                  <button
                    className={
                      clsx(
                        "Vlt-btn Vlt-btn--app Vlt-btn--primary Vlt-btn--outline",
                        mStyles.marginRight
                      )
                    }
                    onClick={handleSwitchClick}
                  >
                    Switch
                  </button>
                  <Switch
                    value={hasCamera}
                    setValue={setHasCamera}
                  />
                </div>
              </div>
              <hr />
              <div className={mStyles.item}>
                <div className={mStyles.subItem}>
                  <Icon
                    name="Vlt-icon-microphone-full"
                    className={mStyles.marginRight}
                  />
                  <p>Microphone</p>
                </div>
                <Switch
                  value={hasMic}
                  setValue={setHasMic}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        {(me && me.role === "participant") ?
        <Button
          text="Decline"
          className="Vlt-btn--tertiary"
          onClick={handleRejectClick}
        /> : null}
        <Button
          text={(me && me.role === "participant") ? "Join Live" : "Join"}
          onClick={handleApproveClick}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default PrecallDialog;
