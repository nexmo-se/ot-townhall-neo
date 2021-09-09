import { usePolling } from "components/PollingProvider";
import { useEffect, useState } from "react";

function PollingBadge () {
  const [color, setColor] = useState("red");
  const [label, setLabel] = useState("Stopped");
  const { polling } = usePolling();

  useEffect(
    () => {
      if (!polling) {
        setColor("blue");
        setLabel("No Polling");
      } else if (polling.status === "pending") {
        setColor("red");
        setLabel("Stopped");
      } else {
        setColor("green");
        setLabel("Started");
      }
    },
    [polling]
  )

  return (
    <span className={`Vlt-badge Vlt-badge--${color}`}>
      {label}
    </span>
  )
}

export default PollingBadge;
