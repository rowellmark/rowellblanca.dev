'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
  Eye,
  Undo,
  Redo,
  Sparkles,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  onOpenMediaPicker?: () => void;
  onOpenGeminiAI?: () => void;
}

export default function RichTextEditor({
  value,
  onChange,
  onOpenMediaPicker,
  onOpenGeminiAI,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Synchronize initial & external value changes into the contentEditable div when appropriate
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '<p><br></p>';
      }
    }
  }, [value, mode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === '<p><br></p>' ? '' : html);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (mode !== 'visual') return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const insertHeading = (level: string) => {
    execCommand('formatBlock', `<${level}>`);
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code snippet:');
    if (code) {
      const html = `<pre className="bg-slate-900 text-amber-300 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      execCommand('insertHTML', html);
    }
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-brand-amber transition-all">
      {/* Toolbar Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {/* Format Controls */}
          <button
            type="button"
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => insertHeading('h2')}
            title="Heading 2"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertHeading('h3')}
            title="Heading 3"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', '<p>')}
            title="Normal Paragraph"
            className="px-2 py-1 text-xs font-extrabold rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            Paragraph
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'blockquote')}
            title="Blockquote"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertCodeBlock}
            title="Code Block"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Links & Images */}
          <button
            type="button"
            onClick={insertLink}
            title="Insert Link"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {onOpenMediaPicker && (
            <button
              type="button"
              onClick={onOpenMediaPicker}
              title="Insert Image from Uploads"
              className="p-2 rounded-lg hover:bg-slate-200 text-amber-600 font-bold transition-all flex items-center gap-1"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action controls right */}
        <div className="flex items-center gap-2">
          {onOpenGeminiAI && (
            <button
              type="button"
              onClick={onOpenGeminiAI}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-900 text-xs font-black flex items-center gap-1.5 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Write with Gemini AI
            </button>
          )}

          {/* View Mode Switcher */}
          <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mode === 'visual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Visual
            </button>
            <button
              type="button"
              onClick={() => setMode('code')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mode === 'code'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 inline mr-1" />
              HTML
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[300px] p-4 sm:p-6 outline-none text-slate-800 text-sm leading-relaxed prose max-w-none focus:outline-none"
          style={{ minHeight: '320px' }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or write raw HTML code here..."
          className="w-full min-h-[320px] p-4 font-mono text-xs text-slate-800 bg-slate-950 text-emerald-400 outline-none resize-y"
        />
      )}
    </div>
  );
}
