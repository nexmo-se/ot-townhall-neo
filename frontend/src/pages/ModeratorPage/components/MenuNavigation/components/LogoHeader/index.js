import VonageWordmarkWhite from "@vonagevolta/volta2/images/logos/Vonage-wordmark--white.svg";
import VonageLettermarkWhite from "@vonagevolta/volta2/images/logos/Vonage-lettermark--white.svg";
import VoltaIcon from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

function LogoHeader () {
  return (
    <>
      <div className="Vlt-sidenav__block Vlt-sidenav__block--logo">
        <div className="Vlt-sidenav__logo">
          <img
            className="Vlt-sidenav__elem--full"
            src={VonageWordmarkWhite}
            alt="Vonage Logo"
            width="109px"
          />
          <img
            className="Vlt-sidenav__elem--collapsed"
            src={VonageLettermarkWhite}
            alt="Vonage Logo"
          />
        </div>
        <div id="Vlt-sidenav-collapse-trigger" className="Vlt-sidenav__collapse">
          <svg className="Vlt-sidenav__collapse__close">
            <use xlinkHref={`${VoltaIcon}#Vlt-icon-chevron-left`}/>
          </svg>
          <svg className="Vlt-sidenav__collapse__open">
          <use xlinkHref={`${VoltaIcon}#Vlt-icon-menu-full`}/>
          </svg>
        </div>
      </div>
      <div className="Vlt-sidenav__block"></div>
    </>
  )
}

export default LogoHeader;
