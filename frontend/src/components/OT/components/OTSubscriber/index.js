import styles from "./OTSubscriber.module.css";

import lodash from "lodash";
import clsx from "clsx";
import { v4 as uuid } from "uuid";

import { useEffect, useState } from "react";
import { useSession } from "../../hooks/session";

export function OTSubscriber (props) {
  const onError = lodash(props).get("onError");
  const properties = lodash(props).get("properties");
  const stream = lodash(props).get("stream");
  const className = lodash(props).get("className");
  const useDummy = lodash(props).get("useDummy", false);
  const style = lodash(props).get("style", {});

  const [, setSubscriber] = useState();
  const [id] = useState(uuid());
  const { session } = useSession();

  useEffect(
    () => {
      setSubscriber(
        (prevSubscriber) => {
          if (!session) return prevSubscriber;
          if (prevSubscriber) return prevSubscriber;
          if (useDummy) return;

          const defaultProperties = {
            subscribeToAudio: true,
            subscribeToVideo: true,
            width: "100%",
            height: "100%",
            insertMode: "append",
            fitMode: "contain",
            style: {
              buttonDisplayMode: "off"
            }
          }

          const combinedProps = lodash(defaultProperties).merge(properties).value();
          const subscriber = session.subscribe(stream, `subscriber_${id}`, combinedProps, (err) => {
            if (err) {
              if (onError) onError(err);
              console.log(err);
            } else {
              console.log("Subscriber initialised");
            }
          });
          return subscriber;
        }
      )
    },
    [session, properties, onError, stream, id, useDummy]
  )

  return (
    <div
      id={`subscriber_${id}`}
      className={
        clsx(
          styles.main,
          className
        )
      }
      style={style}
    >
      { useDummy && (
        <video
          width="100%"
          preload="metadata"
          className={styles.dummy}
          autoPlay
        >
          <source
            src="https://d3ftwi7xooeeyo.cloudfront.net/big_buck_bunny.mp4"
            type="video/mp4"
          />
        </video>
      )}
    </div>
  )
}
