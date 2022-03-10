// @flow
import { makeStyles } from '@material-ui/styles';
export default makeStyles(
  () => ({
    root: {
      marginTop: 8,
      marginBottom: 4,
      backgroundColor: 'rgba(0,0,0,0.7)',
      width: 250
    },
    avatar: { marginRight: 16 },
    chat: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 200,
      color: '#fff !important'
    },
    message: {
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      color: '#fff !important'
    }
  }),
  { index: 1 }
);
