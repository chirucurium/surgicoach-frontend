import { makeStyles } from '@mui/styles';

const useMainStyles = makeStyles((theme) => ({
  header: {
    width: '100%',
    height: '60px',
    backgroundColor:theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  headerText: {
  color: theme.palette.primary.main,
    marginLeft: '60px',
    ...theme.typography.HeadingText,
   // fontFamily: 'Poppins, sans-serif', // Apply Poppins font // Apply styles from theme
   // ...styles.headerText, // Apply styles from styles object
  },

}));

export default useMainStyles;