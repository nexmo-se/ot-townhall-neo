import React from "react";
import Button from "components/Button"

function Banner(props){
  const { text, hasButton, buttonText, onClick, onClose } = props;


  function handleClick (e) {
    e.preventDefault();
    if(onClick) onClick();
  }


  return (
    <div style={{backgroundColor: "orange", padding: "0px 8px", zIndex: "10"}}>
      <p className="Vlt-white" style={{ display: "inline-block", paddingRight: "8px", margin: 0 }}>{text}</p>
      {hasButton?   <button 
        className="Vlt-btn Vlt-btn--app Vlt-btn--link"
        onClick={handleClick}
      >
        {buttonText}
      </button>
      : null}
      <button onClick={onClose} style={{all:"unset", position:"absolute", top: "16px", right: "16px", fontSize: "24px", color: "white", filter: "drop-shadow(rgb(0, 0, 0, 0.35) 4px 4px 4px)"}}>x</button>
    </div>
  )
}

export default Banner;