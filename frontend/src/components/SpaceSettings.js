import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {CustomInput} from "../reuseable";
import {editorThemes} from "../editorThemes";

function SpaceSettings({theme, dispatch}) {
    return (
        <FormControl sx={{ minWidth: 80}}>
            <InputLabel>Theme</InputLabel>
            <Select
                value={theme}
                onChange={(e) => dispatch({type:'updateEditorTheme', payload:e.target.value})}
                autoWidth
                label="Theme"
                input={<CustomInput />}
                sx={{height: '4vh'}}

            >
                {editorThemes.map((theme, id) => {
                    return <MenuItem value={theme.value} key={id}>{theme.name}</MenuItem>
                })}
            </Select>
        </FormControl>
    );
}

export default SpaceSettings;