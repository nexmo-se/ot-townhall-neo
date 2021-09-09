import lodash from "lodash";
import validator from "validator";
import { PollingItem as Item } from "components/PollingProvider";

import { usePolling } from "components/PollingProvider";
import { useEffect, useState } from "react";

import PollingItem from "../PollingItem";
import NoPollingAction from "../NoPollingAction";
import StoppedPollingAction from "../StoppedPollingAction";
import StartedPollingAction from "../StartedPollingAction";
import TextInput from "components/TextInput";

const DEFAULT_ITEMS = new Item({
  option: "",
  orderNumber: 1
})

function QuestionSection () {
  const [loading, setLoading] = useState(false);
  const [isClean, setIsClean] = useState(false);
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([DEFAULT_ITEMS]);

  const { polling, create } = usePolling();

  function handleItemChange (item) {
    setItems(
      (prev) => {
        const index = lodash.findIndex(prev, (o) => o.id === item.id);
        return [
          ...prev.slice(0, index),
          item,
          ...prev.slice(index + 1)
        ]
      }
    )
  }

  function handleItemRemove (item) {
    setItems(
      (prev) => prev.filter(
        (prevItem) => prevItem.id !== item.id
      )
    )
  }

  function handleAddItemClick () {
    setItems(
      (prev) => ([
        ...prev,
        new Item({
          options: "",
          orderNumber: prev.length + 1
        })
      ])
    )
  }

  async function handleCreateClick () {
    try {
      setLoading(true);
      await create({ title, items });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Make sure that title is not blank
  // and items are filled with value at least 1 item
  useEffect(
    () => {
      setIsClean(
        !validator.isEmpty(title) &&
        lodash(items).filter(
          (item) => !validator.isEmpty(item.option ?? "")
        ).value().length >= 1
      )
    },
    [title, items]
  )

  // Make sure if polling is available in the database
  // we will display the polling instead of empty data
  useEffect(
    () => {
      if (!polling) {
        setTitle("");
        setItems([DEFAULT_ITEMS])
      } else {
        setTitle(polling.title);
        setItems(polling.items);
      }

    },
    [polling]
  )

  return (
    <div>
      <TextInput 
        label="Title"
        text={title}
        onChange={setTitle}
        placeholder="Put your title here."
        disabled={polling !== undefined}
      />
      {
        items.map(
          (item, index) => (
            <PollingItem
              key={`polling-item_${index}`}
              item={item}
              onChange={handleItemChange}
              onRemove={handleItemRemove}
              removeable={items.length > 0 && index > 0}
              disabled={polling !== undefined}
            />
          )
        )
      }

      <NoPollingAction
        onAddItemClick={handleAddItemClick}
        onCreateClick={handleCreateClick}
        disabled={loading || !isClean}
      />

      <StoppedPollingAction />
      <StartedPollingAction />
    </div>   
  )
}

export default QuestionSection;
