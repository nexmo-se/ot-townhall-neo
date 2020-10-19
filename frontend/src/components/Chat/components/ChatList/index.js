// @flow
import React from "react"
import useStyles from "./styles";
import useMessage from "hooks/message";
import ChatBubble from "../ChatBubble";

type IChatList = { autoScroll?: boolean }
function ChatList({ autoScroll = true }: IChatList){
  const mMessage = useMessage();
  const mStyles = useStyles();
  const list = React.useRef<any>(null);

  React.useEffect(() => {
    if(autoScroll) list.current.scrollTop = list.current.scrollHeight;
  }, [ autoScroll, mMessage.messages ]);

  return(
    <div ref={list} className={mStyles.container}>
      {mMessage.messages.map((message) => {
        if(message.isApproved){
          return (
            <ChatBubble 
              key={message.id}
              name={message.sender.name} 
              message={message.text} 
            />
          )
        }else return null;
      })}
    </div>
  )
}

export default ChatList;