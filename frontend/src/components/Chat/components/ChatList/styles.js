import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  container: {
    display: "flex", 
    flexDirection: "column", 
    overflowY: "scroll",
    width: "100%", 
    flex: 1, 
    paddingTop: 16, 
    paddingBottom: 16
  }
}), { index: 1 })