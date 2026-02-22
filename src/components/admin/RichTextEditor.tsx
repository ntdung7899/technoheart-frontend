"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
    toolbar: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header", "bold", "italic", "underline", "strike",
    "color", "background",
    "list",
    "blockquote", "code-block",
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
                modules={modules}
                formats={formats}
                placeholder={placeholder || "Viết nội dung bài viết ở đây..."}
            />
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    min-height: 320px;
                    font-size: 14px;
                    font-family: inherit;
                    border: none;
                    border-top: 1px solid #e4e4e7;
                }
                .rich-text-editor .ql-toolbar {
                    border: none;
                    border-bottom: 1px solid #e4e4e7;
                    background: #fafafa;
                    border-radius: 0;
                    padding: 12px;
                }
                .rich-text-editor .ql-toolbar .ql-formats {
                    margin-right: 12px;
                }
                .rich-text-editor .ql-editor {
                    padding: 24px;
                    line-height: 1.8;
                    color: #3f3f46;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #d4d4d8;
                    font-style: normal;
                }
                .rich-text-editor .ql-snow .ql-stroke {
                    stroke: #71717a;
                }
                .rich-text-editor .ql-snow .ql-fill {
                    fill: #71717a;
                }
                .rich-text-editor .ql-snow .ql-picker-label {
                    color: #71717a;
                }
                .rich-text-editor .ql-snow button:hover .ql-stroke,
                .rich-text-editor .ql-snow .ql-picker-label:hover .ql-stroke {
                    stroke: var(--color-primary, #2563eb);
                }
                .rich-text-editor .ql-snow button:hover .ql-fill,
                .rich-text-editor .ql-snow .ql-picker-label:hover .ql-fill {
                    fill: var(--color-primary, #2563eb);
                }
                .rich-text-editor .ql-snow button.ql-active .ql-stroke {
                    stroke: var(--color-primary, #2563eb);
                }
                .rich-text-editor .ql-snow button.ql-active .ql-fill {
                    fill: var(--color-primary, #2563eb);
                }
            `}</style>
        </div>
    );
}
