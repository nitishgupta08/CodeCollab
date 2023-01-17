import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


function Editor({ data }) {
    const onChange = React.useCallback((value, viewUpdate) => {
        console.log('value:', value);
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