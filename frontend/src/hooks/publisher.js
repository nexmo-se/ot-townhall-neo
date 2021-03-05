// @flow
import React from "react";
import OT from "@opentok/client";
import User from "entities/user";
import useSession from "hooks/session";
import { Session, Publisher } from "@opentok/client";

interface BasePublishOptions {
  session: Session;
}

interface UnpublishOptions extends BasePublishOptions {};
interface PublishOptions extends BasePublishOptions {
  user: User;
  extraData?: any;
  onAccessDenied?: (user: User) => void;
  onError?: ?(((error: any) => void) | ((error: any) => Promise<void>));
  attempt?: number;
}

interface IReturnValue {
  publish: (args: PublishOptions) => Promise<Publisher>;
  unpublish: (args: UnpublishOptions) => Promise<void>;
  publisher?: Publisher;
}

interface IPublisher{
  containerID: string;
  autoLayout?: boolean;
  name?: string;
}

function usePublisher({ containerID, autoLayout = true, name }: IPublisher): IReturnValue{
  const { addStream, removeStream } = useSession();
  const publisherRef = React.useRef<Publisher | void>();

  const streamCreatedListener = React.useCallback(
    ({ stream }) => {
      addStream({ stream });
    },
    [addStream]
  )

  const streamDestroyedListener = React.useCallback(
    ({ stream }) => {
      removeStream({ stream });
    },
    [removeStream]
  )

  const publish = React.useCallback(
    async ({ session, user, extraData, attempt = 1, onError }: PublishOptions): Promise<Publisher> => {
      console.log(`Attempting to publish in ${attempt} try`)

      if (!publisherRef.current) {
        const options = { 
          insertMode: "append",
          name: name? name: user.name,
          style: { 
            buttonDisplayMode: "off",
            nameDisplayMode: "on"
          }
        };

        const finalOptions = Object.assign({}, options, extraData);
        if (finalOptions.insertDefaultUI === false) {
          publisherRef.current = OT.initPublisher(undefined, finalOptions);
        } else {
          publisherRef.current = OT.initPublisher(containerID, finalOptions);
        }

        if (publisherRef.current) publisherRef.current.on("streamCreated", streamCreatedListener);
        if (publisherRef.current) publisherRef.current.on("streamDestroyed", streamDestroyedListener);

        const { retry, error } = await new Promise(
          (resolve, reject) => {
            session.publish(
              publisherRef.current,
              (err) => {
                if (err && attempt < 3) {
                  publisherRef.current = undefined;
                  resolve({ retry: true, error: err });
                } if (err && attempt >= 3) {
                  resolve({ retry: false, error: err });
                } else resolve({ retry: false, error: undefined });
              }
            )
          }
        )

        if (retry) {
          // Wait for 2 seconds before attempting to publish again
          await new Promise(
            (resolve) => {
              setTimeout(resolve, 2000 * attempt);
            }
          );

          await publish({
            session,
            user,
            extraData,
            onError,
            attempt: attempt + 1,
          });
        } else if (error) {
          publisherRef.current = undefined;
          
          if (onError) await onError(error);
          return undefined;
        } else {
          return publisherRef.current;
        }
      } else return publisherRef.current;
    },
    [
      containerID,
      name,
      streamCreatedListener,
      streamDestroyedListener
    ]
  );

  const unpublish =  React.useCallback(
    async ({ session }: UnpublishOptions) => {
      if (publisherRef.current) await session.unpublish(publisherRef.current);
      publisherRef.current = undefined;
    },
    []
  );

  return { 
    publisher: publisherRef.current,
    publish,
    unpublish
  }
}
export default usePublisher;