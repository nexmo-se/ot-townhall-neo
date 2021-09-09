import styles from "./PollingItem.module.css";

import React from "react";
import lodash from "lodash";
import clsx from "clsx";
import { PollingItem as Item } from "components/PollingProvider";

import TextInput from "components/TextInput";

function PollingItem (props) {
  const removeable = lodash(props).get("removeable", false);
  const onChange = lodash(props).get("onChange");
  const onRemove = lodash(props).get("onRemove");
  const item = lodash(props).get("item");
  const disabled = lodash(props).get("disabled", false);

  function handleChange (text) {
    if (!onChange) return;

    onChange(new Item({ 
      id: item.id,
      option: text, 
      count: item.count ,
      orderNumber: item.orderNumber
    }));
  }

  function handleRemove () {
    if (!onRemove) return;

    onRemove(item);
  }

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <TextInput 
          text={item.option} 
          onChange={handleChange} 
          placeholder="Option" 
          disabled={disabled}
        />
      </div>
      <div className={styles.right}>
        {(removeable && !disabled) && (
          <span 
            className={
              clsx(
                "Vlt-text-link",
                styles.pointer
              )
            }
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
