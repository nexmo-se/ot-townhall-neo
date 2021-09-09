import { useSession } from "../../hooks/session"

import { OTSubscriber } from "../OTSubscriber";

/**
 * 
 * @param param0 `{ className }` will be applied to all OTSubscriber component
 * @returns 
 */
export function OTSubscribers ({ className }) {
  const { streams } = useSession();

  return (
    <>
      {
        streams.map(
          (stream) => (
            <OTSubscriber
              key={stream.streamId}
              stream={stream}
              className={className}
            />
          )
        )
      }
    </>
  )
}