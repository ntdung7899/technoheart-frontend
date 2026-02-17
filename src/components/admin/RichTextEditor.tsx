"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote"],
        ["link", "image"],
        ["clean"],
    ],
};

const FORMATS = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list",
    "align",
    "blockquote",
    "link", "image",
];

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={MODULES}
                formats={FORMATS}
                placeholder={placeholder}
            />
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    min-height: 200px;
                    font-size: 14px;
                    font-family: inherit;
                    border-bottom-left-radius: 1rem;
                    border-bottom-right-radius: 1rem;
                    border-color: rgb(228 228 231);
                    background: rgb(250 250 250);
                }
                .rich-text-editor .ql-toolbar {
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                    border-color: rgb(228 228 231);
                    background: white;
                }
                .rich-text-editor .ql-editor {
                    min-height: 200px;
                    color: rgb(63 63 70);
                    font-weight: 500;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: rgb(161 161 170);
                    font-style: normal;
                }
                .rich-text-editor .ql-container:focus-within {
                    border-color: hsl(var(--primary) / 0.3);
                    box-shadow: 0 0 0 4px hsl(var(--primary) / 0.1);
                }
                .rich-text-editor .ql-toolbar:has(+ .ql-container:focus-within) {
                    border-color: hsl(var(--primary) / 0.3);
                }
                .rich-text-editor .ql-editor h1 { font-size: 1.5em; font-weight: 700; }
                .rich-text-editor .ql-editor h2 { font-size: 1.25em; font-weight: 700; }
                .rich-text-editor .ql-editor h3 { font-size: 1.1em; font-weight: 600; }
                .rich-text-editor .ql-editor p { margin-bottom: 0.5em; }
                .rich-text-editor .ql-editor ul,
                .rich-text-editor .ql-editor ol { padding-left: 1.5em; }
                .rich-text-editor .ql-editor blockquote {
                    border-left: 3px solid hsl(var(--primary));
                    padding-left: 1em;
                    color: rgb(113 113 122);
                }
            `}</style>
        </div>
    );
}
