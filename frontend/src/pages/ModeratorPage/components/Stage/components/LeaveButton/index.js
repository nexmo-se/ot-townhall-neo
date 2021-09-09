import OtherControl from "../OtherControl";

import Tooltip from "components/Tooltip";

function LeaveButton () {

  return (
    <Tooltip title="Leave Room">
      <OtherControl
        iconName="Vlt-icon-phone-down-full"
        iconColor="red"
        title="Leave"
      />
    </Tooltip>
  )
}

export default LeaveButton;