// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  root: { 
    display: "flex",
    alignItems: "flex-start",
    paddingBottom: 16,
    paddingTop: 16,
    borderBottom: "1px solid #E6E6E6"
  },
  voteContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    marginRight: 8,
    borderRadius: 16,
    border: "1px solid #E6E6E6",
    padding: 8
  },
  detailContainer: { 
    display: "flex",
    flexDirection: "column"
  }
}), { index: 1 })