// @flow
import React from "react"
import useMessage from "hooks/message";

import ChatBubble from "components/ChatBubble";

type ChatListProps = { autoScroll?: boolean }
function ChatList({ autoScroll = true }:ChatListProps){
  const mMessage = useMessage();
  const list = React.useRef<any>(null);

  const styles = {
    container: {
      display: "flex", flexDirection: "column", overflowY: "scroll",
      width: "100%", flex: 1, paddingTop: 16, paddingBottom: 16
    }
  }

  React.useEffect(() => {
    if(autoScroll) list.current.scrollTop = list.current.scrollHeight;
  }, [ autoScroll, mMessage.messages ]);

  return(
    <div ref={list} style={styles.container}>
      {mMessage.messages.map((message) => {
        if(message.isApproved){
          return <ChatBubble name={message.sender.name} message={message.text} />
        }else return null;
      })}
    </div>
  )
}

export default ChatList;