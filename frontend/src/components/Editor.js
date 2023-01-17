import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


function Editor({ data, setChangeData }) {
    const onChange = React.useCallback((value, viewUpdate) => {
        setChangeData(value);
        // console.log(value);
    }, []);

    return (
        <CodeMirror
            value={data ? data.fileData : ""}
            height="90vh"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
        />
    );

}

export default Editor;