import React from 'react';
import { TextField, Typography } from '@mui/material';
import theme from '../../theme';

const CustomInput = ({ id, label, placeholder, type = 'text', inputSx = {}, ...props }) => {
  return (
    <>
      <Typography
        htmlFor={id}
        component="label"
        sx={{
          fontSize: '24px',
          fontWeight: 300,
          lineHeight: '36px',
          textAlign: 'left',
          marginBottom: '8px',
        }}
      >
        {label}
      </Typography>
      <TextField
        required
        id={id}
        type={type}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.colors.inputBackground,
            borderRadius: '27px',
            height: '50px',
            border: '0px',
            boxShadow: '0px 4px 4px 0px #00000040',
            ...inputSx['& .MuiOutlinedInput-root'], // Merge custom styles
          },
          '& .MuiInputBase-input::placeholder': {
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: 275,
            lineHeight: '24px',
            textAlign: 'left',
            color: theme.colors.black,
            ...inputSx['& .MuiInputBase-input::placeholder'], // Merge custom styles
          },
          ...inputSx // Merge any additional custom styles
        }}
        {...props}
      />
    </>
  );
};

export default CustomInput;
