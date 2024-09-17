// src/theme.js
const theme = {
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
      },
    colors: {
      //primary: '#8BD1CF',
      primary: '#ea1d15',
      secondary: '#74C6C0',
      white: '#FFFFFF',
      black: '#000000',
      inputBackground: 'white',
      buttonBackground: 'white',
      buttonHoverBackground: '#ea1d15',
      overlay: 'rgba(116, 198, 192, 0.8)',
      mediumGreen:'#12bf6a',
      lightGreen:'#acf9d6',
      gray:'#dce4e7'
    },
  };
  
  export default theme;


/*import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
typography: {
    HeadingText: {
      fontSize: '40px',
      fontWeight: 600 ,
      lineHeight: '60px',
      textAlign: 'left',
    },
},
    // Add more custom typography variants if needed
palette: {
    background: {
        default: '#81CECC'//sea-blue
    },
    primary: {
        main: '#000000' //black
    },
    text: {
        primary: '#000000',//black
        secondary: '#FFFFFF',//white
    },
},
});

export default theme;
*/

