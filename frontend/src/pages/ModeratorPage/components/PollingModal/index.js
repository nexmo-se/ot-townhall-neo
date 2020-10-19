// @flow
import React from "react";
import EPollingItem from "entities/polling-item";
import FetchHelper from "helper/fetch";
import clsx from "clsx";
import lodash from "lodash";

import useStyles from "./styles";
import usePolling from "hooks/polling";

import PollingItem from "../PollingItem";
import TextInput from "components/TextInput";

interface IPollingModal{ 
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function PollingModal({ open = false, onClose, onSuccess }: IPollingModal){
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ title, setTitle ] = React.useState<string>("");
  const [ items, setItems ] = React.useState<EPollingItem[]>([
    new EPollingItem({ option: "", orderNumber: 1 })
  ]);
  const { create: createPolling } = usePolling();
  const mStyles = useStyles();
  const modalRef = React.useRef();

  function handleItemChange(item: EPollingItem){
    setItems((prev) => {
      const index = lodash.findIndex(prev, (o) => o.id === item.id); 
      return [
        ...prev.slice(0, index),
        item,
        ...prev.slice(index + 1)
      ]
    })
  }

  function handleItemRemove(item: EPollingItem){
    setItems((prev) => prev.filter((prevItem) => prevItem.id !== item.id))
  }

  function handleAddClick(){
    setItems((prev) => [ ...prev, new EPollingItem({ option: "", orderNumber: prev.length + 1 })])
  }

  async function handleCreateClick(){
    await FetchHelper.fetch(createPolling, setLoading, { title, items });
    if(modalRef.current) {
      modalRef.current.dismiss();
      onClose();
      if(onSuccess) onSuccess();
    }
    modalRef.current = undefined;
  }

  React.useEffect(() => {
    if(open) {
      if(!modalRef.current) modalRef.current = window.Volta.modal.create("create-polling-modal");
      modalRef.current.open();
    }else if(!open) {
      if(modalRef.current) {
        modalRef.current.dismiss();
        onClose();
      }
      modalRef.current = undefined;
    }
  }, [ open, onClose ])

  return (
    <div 
      id="create-polling-modal" 
      className="Vlt-modal"
      data-disable-esc
      data-disable-click
    >
      <div className="Vlt-modal__panel">
        <div className="Vlt-modal__header">
          <h4>Create polling</h4>
          <div className="Vlt-modal__dismiss"></div>
        </div>
        <div className="Vlt-modal__content">
          <TextInput 
            label="Title"
            text={title}
            onChange={setTitle}
            placeholder="" 
          />
          {items.map((item, index) => (
            <PollingItem 
              key={item.id}
              item={item} 
              onChange={handleItemChange}
              onRemove={handleItemRemove}
              removeable={items.length > 0 && index > 0} 
            />
          ))}
          <span 
            className={clsx("Vlt-text-link", mStyles.pointer)}
            onClick={handleAddClick}
          >
            Add Item
          </span>
        </div>
        <div className="Vlt-modal__footer">
          <button 
            className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary Vlt-modal__cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
            onClick={handleCreateClick}
            disabled={loading}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
export default PollingModal;