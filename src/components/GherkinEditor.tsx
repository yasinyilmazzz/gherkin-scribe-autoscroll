
import { useRef, useState } from 'react';
import { applySyntaxHighlighting } from '@/utils/gherkinHighlighter';

interface GherkinEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

export const GherkinEditor = ({ content, onContentChange, onSave }: GherkinEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightedContentRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsItems, setSuggestionsItems] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, ch: 0 });

  const handleEditorInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.startsWith("Scenario: ")) {
      onContentChange("Scenario: " + text);
    } else {
      onContentChange(text);
    }
    
    if (highlightedContentRef.current) {
      highlightedContentRef.current.innerHTML = applySyntaxHighlighting(text);
      
      if (e.target.scrollHeight > e.target.clientHeight) {
        e.target.scrollTop = e.target.scrollHeight;
        highlightedContentRef.current.scrollTop = highlightedContentRef.current.scrollHeight;
      }
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const cursorPosition = e.currentTarget.selectionStart;
    const isAtStart = cursorPosition <= 10;
    
    if (isAtStart && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
    }
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightedContentRef.current) {
      highlightedContentRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="relative">
      <div className="w-full h-[300px] border border-border rounded-lg bg-background relative mb-4">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleEditorInput}
          onKeyDown={handleEditorKeyDown}
          onScroll={handleEditorScroll}
          className="w-full h-full font-mono text-sm resize-none border-none bg-transparent absolute top-0 left-0 p-4 text-transparent caret-foreground z-[2] whitespace-pre-wrap"
        />
        <div
          ref={highlightedContentRef}
          className="w-full h-full font-mono text-sm whitespace-pre-wrap overflow-y-auto p-4 pointer-events-none"
          dangerouslySetInnerHTML={{ __html: applySyntaxHighlighting(content) }}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Kaydet</span>
        </button>
      </div>
    </div>
  );
};

