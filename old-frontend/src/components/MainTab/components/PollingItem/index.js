// @flow
import React from "react";
import EPollingItem from "entities/polling-item";
import useStyles from "./styles";
import clsx from "clsx";

import Button from "components/Button";

interface IPollingItem { 
  item: EPollingItem;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (item: EPollingItem) => void;
};

function PollingItem({ item, selected = false, disabled = false, onClick }: IPollingItem){
  const mStyles = useStyles();

  function handleClick(){
    if(onClick && !selected) onClick(item);
  }

  return (
    <div>
      <Button 
        onClick={handleClick}
        disabled={selected? false: disabled}
        className={clsx({
          "Vlt-btn--tertiary": !selected,
          [mStyles.button]: true,
          "Vlt-btn--primary": selected
        })}
        text={item.option}
      />
    </div>
  )
}
export default PollingItem;