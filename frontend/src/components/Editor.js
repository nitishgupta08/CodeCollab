import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { editorLang } from '../editorLang';


function Editor({ data, loggedInUser, theme, language, dispatch }) {

    const onChange = React.useCallback((value, viewUpdate) => {
        dispatch({type: 'updateCurrentFileData',payload: value});
        console.log(viewUpdate)
    }, []);

    return (
        <CodeMirror
            readOnly={loggedInUser ? null : 'nocursor'}
            value={data ? data.fileData : ""}
            height="90vh"
            theme={theme}

            extensions={[editorLang[language].func()]}
            onChange={onChange}
        />
    );

}

export default Editor;