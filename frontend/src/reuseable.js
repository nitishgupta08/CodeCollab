import { styled } from "@mui/material/styles";
import { TextField, Tooltip, Tabs, Tab } from "@mui/material";
import { tooltipClasses } from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';

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

const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.secondary,
        fontSize: 16,
        padding: 13,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: theme.palette.primary.main,
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#181b66',
        color: '#EAE8EE',
        minWidth: 220,
        fontSize: 15,
        p:1,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#181b66',
    },
}));

const OpenStyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        display: 'none'
    },
    '& .MuiTabs-scrollButtons': {
        color: '#00E5B5',
    }

});

const OpenStyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        padding: 0,
        paddingLeft: 10,
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: 'black',
            backgroundColor: '#00E5B5',
            borderRadius: 5,
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
    }),
);

const DataStyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        display: 'none'
    },
    '& .MuiTabs-scrollButtons': {
        color: '#00E5B5',
    }
});

const DataStyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#EAE8EE',
            backgroundColor: '#181b66',
            borderRadius: 5,
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
    }),
);

export { CustomTextField, CustomInput, HtmlTooltip, OpenStyledTabs, OpenStyledTab, DataStyledTabs, DataStyledTab };