// @flow
import { makeStyles } from '@material-ui/styles';
export default makeStyles(
  () => ({
    container: {
      flexBasis: '20%',
      zIndex: 0
    },
    screenContainer: {
      '& > .OT_subscriber': {
        width: '100% !important',
        height: '100% !important'
      }
    },
    cameraContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      display: 'flex',
      width: 200,
      flexDirection: 'column',
      zIndex: 5,
      '& > *': {
        width: '128px !important',
        height: '128px !important',
        borderRadius: '50%',
        margin: '15px',
        border: '4px solid #d6219c'
      }
    },

    black: { backgroundColor: 'black' },
    big: { flexBasis: '100%' },
    screen: { flexBasis: '80%' },
    hidden: { display: 'none' }
  }),
  { index: 1 }
);
