"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { motion } from 'framer-motion';
import { Sparkles, Save, Trash2, History } from 'lucide-react';

interface JournalEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isSaving: boolean;
}

export function JournalEditor({ 
  content, 
  onChange, 
  onSave, 
  onAnalyze, 
  isAnalyzing, 
  isSaving 
}: JournalEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ 
        placeholder: "Tell your story in English... How was your day? What's on your mind?" 
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px]',
      },
    },
  });

  if (!editor) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <Save size={16} className={isSaving ? "animate-pulse" : ""} />
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all"
          >
            <History size={16} />
            History
          </button>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
        >
          <Sparkles size={16} className={isAnalyzing ? "animate-spin" : ""} />
          {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
        </button>
      </div>

      <div className="glass rounded-[2rem] p-1 overflow-hidden border border-white/10">
        <div className="bg-[#050505] rounded-[1.8rem] p-8 md:p-12">
          <EditorContent 
            editor={editor} 
            className="prose prose-invert prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed max-w-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
