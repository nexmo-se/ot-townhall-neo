// @flow
import LM from "opentok-layout-js";
import type { Stream, Session, Publisher, Subscriber } from "@opentok/client";

export interface ILayoutManager {
  container: string;
  manager: any;
}

class LayoutManager implements ILayoutManager{
  container: string;
  manager: any;

  constructor(container:string){
    this.container = container;
  }

  init(){
    const element = document.getElementById(this.container);
    if(element) this.manager = LM(element, { 
      fixedRatio: true, 
      bigFirst: false,
      bigFixedRatio: true,
      bigAlignItems: "left"
    });
    else throw new Error("Cannot find container");
  }

  getPubSub(session: Session, stream: Stream): Publisher | Subscriber{
    if(stream.publisher) return stream.publisher;
    else {
      const [ subscriber ] = session.getSubscribersForStream(stream);
      return subscriber
    }
  }

  layout(session: Session, streams: Array<Stream>){
    streams.forEach((stream) => {
      const pubsub = this.getPubSub(session, stream);
      if(pubsub){
        const element = document.getElementById(pubsub.id);
        if(element && (stream.videoType === "screen" || stream.videoType === "custom")) element.classList.add("OT_big");
      }
    });

    if(!this.manager) this.init();
    this.manager.layout();
    console.log(`Layouting ${this.container}`)
  }
}
export default LayoutManager;