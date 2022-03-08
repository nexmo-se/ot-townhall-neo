import React from 'react';

function VonageLogoSpinning(props) {
  const { style } = props;

  const styles = {
    default: {
      display: 'flex',
      flexDirection: 'column',
      height: 128,
      width: 128
    }
    /* logo: {
      background: `url(${process.env.PUBLIC_URL}/assets/images/vonage.png)`,
      backgroundPosition: "center", backgroundSize: "contain", height: 50, width: 100,
      backgroundRepeat: "no-repeat"
    } */
  };

  return (
    <div style={{ ...styles.default, ...style }}>
      <video
        src={`${process.env.PUBLIC_URL}/assets/02b_Symbol_loop_w.mp4`}
        autoPlay={true}
        loop={true}
        width={128}
        height={128}
      />
    </div>
  );
}
export default VonageLogoSpinning;
