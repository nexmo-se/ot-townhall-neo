// @flow
import React from "react";
import User from "entities/user";
import type { Role } from "entities/user";

import TextInput from "components/TextInput";

interface IAskNameDialog {
  pin: string;
  onSubmit: (user: User) => Promise<void>;
  role: Role;
  disabled?: boolean;
}

function AskNameDialog({ disabled = false, role, pin, onSubmit }: IAskNameDialog){
  const [ text, setText ] = React.useState<string>("");
  const [ inputPin, setInputPin ] = React.useState<string>("");

  const styles = {
    container: {
      width: "100%", height: "100%", display: "flex",
      alignItems: "center", justifyContent: "center"
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!text) alert("Please enter your name")
    else if(onSubmit && inputPin === pin) {
      const user = new User({ name: text, role });
      onSubmit(user);
    }else if(inputPin !== pin) alert("Wrong PIN");
  }

  return (
    <form style={styles.container}>
      <div className="Vlt-card Vlt-bg-white" style={{ maxWidth: 500 }}>
        <div className="Vlt-card__header">
          <h3>Tell Me Your Name</h3>
        </div>
        <div className="Vlt-card__content">
          <TextInput 
            disabled={disabled}
            text={text} 
            onChange={setText} 
            placeholder="Please enter your name"
          />
          <TextInput 
            disabled={disabled}
            type="password" 
            text={inputPin} 
            onChange={setInputPin} 
            placeholder="PIN"
          />
        </div>
        <div className="Vlt-card__footer Vlt-card__footer--noborder">
          <button 
            type="submit" 
            className="Vlt-btn Vlt-btn--primary Vlt-btn--app" 
            onClick={handleSubmit}
            disabled={disabled}
          >
            Join
          </button>
        </div>
      </div>
    </form>
  )
}
export default AskNameDialog;