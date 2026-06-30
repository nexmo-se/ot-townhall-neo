// @flow
import React from "react";
import AuthService from "../../services/auth";
import User from "entities/user";
import clsx from "clsx";
import type { Role } from "entities/user";

import useStyles from "./styles";
import { useGoogleLogin } from "react-google-login";
import { useParams } from "react-router-dom";

import TextInput from "components/TextInput";

interface ISSODialog { 
  onLoggedIn: (user: User) => Promise<void>,
  role: Role
}

interface IParams { tenant: string }

function SSODialog({ onLoggedIn, role }: ISSODialog){
  const [ inputPin, setInputPin ] = React.useState<string>("");
  const { tenant } = useParams<IParams>();
  const { signIn } = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    clientId: "310951058778-k1tfu0tqkbq7qk68g412h3671ruuaf27.apps.googleusercontent.com",
    hostedDomain: "vonage.com"
  });
  const mStyles = useStyles();

  function handleLoginSuccess(response: any){
    const user = new User({
      name: response.profileObj.name,
      role
    });
    onLoggedIn(user);
  }

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const acceptedRole = [ "presenter", "participant", "moderator" ];
      if (acceptedRole.includes(role)){
        // check if PIN is correct
        await AuthService.login({
          tenant,
          role,
          pin: inputPin
        });
        signIn();
      }else alert("Wrong role");
    }catch(err){ 
      alert("Wrong PIN");
    }
  }

  return (
    <form className={mStyles.container}>
      <div
        className={clsx(
          "Vlt-card",
          "Vlt-bg-white",
          mStyles.card
        )}
      >
        <div className="Vlt-card__header">
          <h4>Welcome!</h4>
          <p>
            Please enter PIN and click 
            <code>Join</code>.&nbsp;
            After you provide a PIN, you need to log in using your 
            <code>vonage.com</code> email address.
          </p>
        </div>
        <div className="Vlt-card__content">
          <TextInput 
            type="password"
            text={inputPin}
            onChange={setInputPin}
            placeholder="Enter your pin here"
            label="PIN"
          />
        </div>
        <div 
          className={clsx(
            "Vlt-card__footer",
            "Vlt-card__footer--noborder",
            mStyles.footer
          )}
        >
          <button
            type="submit"
            className="Vlt-btn Vlt-btn--primary Vlt-btn--app"
            onClick={handleSubmit}
          >
            Join
          </button>
        </div>
      </div>
    </form>
  )
}
export default SSODialog;