// @flow
import React from "react";
import clsx from "clsx";
import validator from "validator";
import AMAAPI from "api/ama";

import useStyles from "./styles";
import { useParams } from "react-router-dom";

import User from "entities/user";
import Participant from "entities/participant";
import type { Role } from "entities/user";

import Guide from "./Guide";
import TextInput from "components/TextInput";
import Icon from "components/Icon";

interface IConvoAMADialog { 
  onLoggedIn: (user: User) => Promise<void>,
  role: Role
}

interface IParams {
  tenant: string;
}

function ConvoAMADialog({ onLoggedIn, role }: IConvoAMADialog){
  const [ firstName, setFirstName ] = React.useState<string>("");
  const [ lastName, setLastName ] = React.useState<string>("");
  const [ email, setEmail ] = React.useState<string>("");
  const [ companyName, setCompanyName ] = React.useState<string>("");
  const [ guideVisible, setGuideVisible ] = React.useState<boolean>(false);
  const { tenant } = useParams<IParams>();
  const mStyles = useStyles();

  async function handleSubmit(e){
    e.preventDefault();
    const checker = {
      fistName: !validator.isEmpty(firstName),
      lastName: !validator.isEmpty(lastName),
      email: validator.isEmail(email),
      companyName: !validator.isEmpty(companyName)
    }
    const valid = Object.keys(checker).map((key) => checker[key]);
    const isValid = !valid.includes(false);
    if(isValid){
      const participant = new Participant({
        firstName, lastName, email, companyName
      })
      await AMAAPI.create({ tenant, participant });
      const user = new User({ name: `${firstName} ${lastName}`, role })
      onLoggedIn(user);
    }else alert("Please fill all details");
  }

  function handleToggleGuide(){
    setGuideVisible((prev) => !prev);
  }

  return (
    <form className={mStyles.root} onSubmit={handleSubmit}>
      <Guide visible={guideVisible} onCloseClick={handleToggleGuide} />
      <div 
        className={clsx(
          "Vlt-card",
          "Vlt-bg-white",
          mStyles.card
        )}
      >
        <div className={mStyles.left}>
          <div className="Vlt-card__header">
            <h3>Please Provide Your Details</h3>
            <p>so we can contact you in case we do not get to answer your question later</p>
          </div>
          <div className="Vlt-card__content">
            <TextInput text={firstName} onChange={setFirstName} placeholder="Please enter your First Name"/>
            <TextInput text={lastName} onChange={setLastName} placeholder="Please enter your Last Name"/>
            <TextInput text={email} onChange={setEmail} placeholder="Please enter your Email"/>
            <TextInput text={companyName} onChange={setCompanyName} placeholder="Please enter Company Name"/>
          </div>
          <div 
            className={clsx(
              "Vlt-card__footer",
              "Vlt-card__footer--noborder",
              mStyles.footer
            )}
          >
            <small>This App is best experienced with Chrome as browser</small> <br /> <br />
            <button type="submit" className="Vlt-btn Vlt-btn--primary Vlt-btn--app" onClick={handleSubmit}>Join</button>
          </div>
        </div>
        <div className={mStyles.right}>
          <div className="Vlt-card__content">
            <Icon 
              name="Vlt-icon-voicemail-transcript" 
              className={clsx("Vlt-purple", mStyles.icon)}
            />
            <p>
              For those using remote interpretation, please follow this 
              <b onClick={handleToggleGuide} className="Vlt-purple">&nbsp;guide&nbsp;</b> 
              before joining
            </p>
            <p>
              使用音频翻译时，您可以根据此
              <b onClick={handleToggleGuide} className="Vlt-purple">用户操作指南</b>
              来开启
            </p>
            <p>원격 통역을 사용하실 참석자분은 참석전 이 &nbsp;
              <b onClick={handleToggleGuide} className="Vlt-purple">가이</b>
              드를 확인하십시오
            </p>
            <p>
              音声同時通訳をご利用される方は、参加する前にこの
              <b onClick={handleToggleGuide} className="Vlt-purple">ガイド</b>
              に従ってください。
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
export default ConvoAMADialog;