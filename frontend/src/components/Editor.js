import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


function Editor(props) {
    const onChange = React.useCallback((value, viewUpdate) => {
        console.log('value:', value);
    }, []);
    return (
        <CodeMirror
            value="console.log('hello world!');"
            height="92vh"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
        />
    );

}

export default Editor;