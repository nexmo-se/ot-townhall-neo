// @flow
import React from "react";
import EPollingItem from "entities/polling-item";
import clsx from "clsx";

import useStyles from "./styles";
import TextInput from "components/TextInput";

function PollingItem({ removeable = false, onChange, onRemove, item }){
  const mStyles = useStyles();

  function handleChange(text){
    onChange(new EPollingItem({ 
      id: item.id,
      option: text, 
      count: item.count ,
      orderNumber: item.orderNumber
    }));
  }

  function handleRemove(){
    onRemove(item);
  }

  return (
    <div className={clsx("Vlt-grid", mStyles.root)}>
      <div className="Vlt-col Vlt-col--2of3">
        <TextInput 
          text={item.option} 
          onChange={handleChange} 
          placeholder="Option" 
        />
      </div>
      <div className="Vlt-col Vlt-col--1of3">
        {removeable && (
          <span 
            className={clsx("Vlt-text-link", mStyles.pointer)}
            onClick={handleRemove}
          >
            Remove
          </span>
        )}
      </div>
    </div>
  )
}
export default PollingItem;