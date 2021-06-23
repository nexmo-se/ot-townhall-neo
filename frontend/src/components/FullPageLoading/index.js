import React from "react";

function FullPageLoading(){
  const styles = { 
    default: {
      display: "flex", position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
      alignItems: "center", justifyContent: "center", backgroundColor: "white",
      zIndex: 9999
    }
  }
  return(
    <div className="Vlt-bg-white" style={styles.default}>
      <div className="Vlt-spinner"/>
    </div>
  )
}

export default FullPageLoading