// @flow
import React from "react";
import User from "entities/user";
import AuthService from "../../services/auth";
import type { Role } from "entities/user";

import useStyles from "./styles";
import { useParams, useLocation } from "react-router-dom";

import TextInput from "components/TextInput";

interface URLParameters {
  tenant: string
}

interface AskNameDialogProps {
  onLoggedIn: (user: User) => Promise<void>;
  role: Role;
  disabled?: boolean;
}

function AskNameDialog ({ disabled = false, role, onLoggedIn }: AskNameDialogProps) {
  const [text, setText] = React.useState<string>("");
  const [inputPin, setInputPin] = React.useState<string>("");
  const { tenant } = useParams<URLParameters>();
  const location = useLocation();
  const mStyles = useStyles();

  const login = React.useCallback(
    async (text, inputPin) => {
      if (!text) {
        alert("Please enter your name");
      } else {
        try{
          const acceptedRole = [ "presenter", "participant", "moderator" ];
          if (acceptedRole.includes(role)){
            await AuthService.login({
              tenant,
              role,
              pin: inputPin
            });
            const user = new User({ name: text, role });
            onLoggedIn(user);
          }else alert("Wrong role");
        }catch(err){ 
          alert("Wrong PIN");
        }
      }
    },
    []
  )

  async function handleSubmit (e: any) {
    e.preventDefault();
    await login(text, inputPin);
  }

  // By pass log in screen by using QueryString
  // If no name is provided, use `Anonymous User` as default
  React.useEffect(
    () => {
      const query = new URLSearchParams(location.search);
      const name = query.get("name");
      const pin = query.get("pin");
      
      if (!name && !pin) return;
      if (!name && pin) {
        login("Anonymous User", pin)
      } else if (name && pin) {
        login(name, pin);
      } else {
        setText(name ?? "");
        setInputPin(pin ?? "")
      }
    },
    [location.search]
  )

  return (
    <form className={mStyles.container}>
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