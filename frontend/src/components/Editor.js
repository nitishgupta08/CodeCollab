import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { editorLang } from '../editorLang';


function Editor({ data, setChangeData, loggedInUser, etheme, langIndex }) {
    const onChange = React.useCallback((value, viewUpdate) => {
        setChangeData(value);
    }, []);

    return (
        <CodeMirror
            readOnly={loggedInUser ? null : 'nocursor'}
            value={data ? data.fileData : ""}
            height="88.5vh"
            theme={etheme}

            extensions={[editorLang[langIndex].func()]}
            onChange={onChange}
        />
    );

}

export default Editor;