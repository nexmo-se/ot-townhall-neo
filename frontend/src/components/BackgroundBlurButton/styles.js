// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles({
  hangup: ({ size, fontSize }) => ({
    width: size,
    height: size, 
    borderRadius: "50%", 
    cursor: "pointer",
    fontSize: fontSize, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center"
  })
}, { index: 1 });