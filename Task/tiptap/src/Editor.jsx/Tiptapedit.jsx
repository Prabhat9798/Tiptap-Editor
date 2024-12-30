// Install dependencies: npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-table axios

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import axios from 'axios';

const TiptapEditor = () => {
  const [charCount, setCharCount] = useState(0);
  const [previousText, setPreviousText] = useState('');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '<p>Hello, <strong>Sugar</strong>! Welcome to the Tiptap editor.</p>',
    onUpdate: ({ editor }) => {
      setCharCount(editor.getHTML().replace(/<[^>]*>/g, '').length);
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt('Enter the URL');
    if (url) {
      const trimmedUrl = url.trim();
      setPreviousText(editor.getHTML());
      editor.chain().focus().clearContent().setLink({ href: trimmedUrl }).insertContent(trimmedUrl).run();
    }
  };

  const removeLink = () => {
    if (previousText) {
      editor.commands.setContent(previousText);
      setPreviousText('');
    }
  };

  const addImage = () => {
    const url = prompt('Enter the image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const saveContent = async () => {
    const content = editor.getHTML();
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;
    const plainText = tempElement.innerText; // Extract plain text
  
    try {
      await navigator.clipboard.writeText(plainText);
      alert('Content copied to clipboard successfully!');
    } catch (error) {
      console.error('Error copying content to clipboard:', error);
      alert('Failed to copy content to clipboard. Please try again.');
    }
  };
  
  return (
    <div>
      <header style={{
        textAlign: 'center',
        padding: '20px 0',
        backgroundColor: '#f4f4f4',
        borderBottom: '2px solid #ddd',
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '2.5rem',
          color: '#333',
        }}>TIPTAP Editor</h1>
      </header>
      <div className="menu-bar">
        <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()}>
          Underline
        </button>
        <button onClick={addLink}>Add Link</button>
        <button onClick={removeLink} disabled={!previousText}>
          Remove Link
        </button>
        <button onClick={addImage}>Add Image</button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
          Add Table
        </button>
        <button onClick={saveContent}>Save Content</button>
      </div>
      <EditorContent editor={editor} className="editor" />
      <div className="char-count">Character Count: {charCount}</div>
      <style jsx>{`
        .menu-bar {
          margin-bottom: 10px;
        }
        .menu-bar button {
          margin-right: 5px;
        }
        .editor {
          border: 1px solid #ccc;
          padding: 10px;
          min-height: 150px;
        }
        .char-count {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
