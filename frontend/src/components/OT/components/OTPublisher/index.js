import styles from "./OTPublisher.module.css";

import OT from "@opentok/client";
import lodash from "lodash";
import clsx from "clsx";
import { forwardRef } from "react";
import { v4 as uuid } from "uuid";

import { useSession } from "../../hooks/session";
import { useImperativeHandle, useEffect, useState } from "react";
import { useRef } from "react";

export const OTPublisher = forwardRef(
  (props, ref) => {
    const className = lodash(props).get("className");
    const properties = lodash(props).get("properties");
    const onError = lodash(props).get("onError");
    const useDummy = lodash(props).get("useDummy", false);
    const style = lodash(props).get("style", {});

    const [, setPublished] = useState(false);
    const [publisher, setPublisher] = useState();
    const [id] = useState(uuid());
    const { session } = useSession();

    const prevProperties = useRef();

    useImperativeHandle(
      ref,
      () => ({
        getPublisher: () => publisher
      }),
      [publisher]
    )
    
    useEffect(
      () => {
        setPublisher(
          (prevPublisher) => {
            if (!session) return prevPublisher;
            if (prevPublisher) return prevPublisher; // It means we already publish the publish;
            if (useDummy) return; // We don't want to init when I am using dummy

            const defaultProperties = {
              publishAudio: true,
              publishVideo: true,
              width: "100%",
              height: "100%",
              insertMode: "append",
              fitMode: "contain",
              style: {
                buttonDisplayMode: "off"
              }
            };

            const combinedProps = lodash(defaultProperties).merge(properties).value();
            const publisher = OT.initPublisher(`publisher_${id}`, combinedProps, (err) => {
              if (err) {
                if (onError) onError(err);
                console.log(err);
              } else {
                console.log("Publisher initialised");
              }
            });
            return publisher;
          }
        )
      },
      [session, properties, onError, id, useDummy]
    );

    /**
     * This will fire when the publisher is there and properties changes
     */
    useEffect(
      () => {
        if (!publisher) return;
        if (useDummy) return;

        const shouldUpdate = (key, defaultValue) => {
          if (!prevProperties.current) return false;

          const previousValue = lodash(prevProperties.current).get(key, defaultValue);
          const currentValue = lodash(properties).get(key, defaultValue);
          // console.log("Should update", key, "is", previousValue !== currentValue)
          return previousValue !== currentValue;
        }

        if (shouldUpdate("videoSource", undefined)) {
          // I need to republish by destroying the publisher
          // and creating a new publisher here
        }

        if (shouldUpdate("publishAudio", true)) {
          const value = lodash(properties).get("publishAudio", true);
          publisher.publishAudio(value);
        }

        if (shouldUpdate("publishVideo", true)) {
          const value = lodash(properties).get("publishVideo", true);
          publisher.publishVideo(value)
        }
      },
      [properties, publisher, useDummy]
    )

    /**
     * This will keep updating the prevProperties so we can use it if 
     * properties is getting updated.
     */
    useEffect(
      () => {
        prevProperties.current = properties;
      }
    )

    useEffect(
      () => {
        console.log("Publishing");
        setPublished(
          (prevPublished) => {
            if (!session) return false;
            if (!publisher) return false;
            if (prevPublished) return prevPublished;
            if (useDummy) return true;

            session.publish(publisher, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Publisher published");
              }
            });
            return true;
          }
        )
      },
      [session, publisher, useDummy]
    )
    
    return (
      <div
        id={`publisher_${id}`}
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
    );
  }
)