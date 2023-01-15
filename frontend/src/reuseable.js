import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
            color: "black"
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },

    '& .MuiInputBase-input': {
        borderRadius: 2,
        backgroundColor: '#fcfcfb',
        fontSize: 16,
        padding: '10px 12px',
        color: "black",
        '&:hover': {
            border: "none"
        },
    }
});

export { CustomTextField };