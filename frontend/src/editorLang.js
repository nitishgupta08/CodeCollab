import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { java } from "@codemirror/lang-java"
import { json } from "@codemirror/lang-json"
import { sql } from "@codemirror/lang-sql"

const editorLang = [
    { name: 'Javascript', func: javascript, index: 0 },
    { name: 'C++', func: cpp, index: 1 },
    { name: 'Python', func: python, index: 2 },
    { name: 'Java', func: java, index: 3 },
    { name: 'JSON', func: json, index: 4 },
    { name: 'SQL', func: sql, index: 5 },
]

export { editorLang }