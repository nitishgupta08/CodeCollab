import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { editorLang } from '../editorLang';
import {EditorView, basicSetup} from "codemirror"

function Editor({ data, loggedInUser, theme, language, dispatch, socketRef }) {

    const onChange = React.useCallback((value, viewUpdate) => {
        dispatch({type: 'updateCurrentFileData',payload: value});
        console.log(viewUpdate.transactions[0].annotations[0].value)
    }, []);


    return (

        <CodeMirror
            readOnly={loggedInUser ? null : 'nocursor'}
            value={data ? data.fileData : ""}
            height="94vh"
            theme={theme}

            extensions={[editorLang[language].func()]}
            onChange={onChange}
        />
    );

}

export default Editor;