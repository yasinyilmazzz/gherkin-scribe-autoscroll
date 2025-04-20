
import { useRef, useState, useCallback } from 'react';
import { applySyntaxHighlighting } from '@/utils/gherkinHighlighter';
import { Button } from '@/components/ui/button';
import { Import } from 'lucide-react';

const KEYWORDS = ['Feature:', 'Scenario:', 'Given', 'When', 'Then', 'And', 'But'];

interface GherkinEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onImport: (content: string) => void;
  exportTestCases: () => void;
}

export const GherkinEditor = ({ 
  content, 
  onContentChange, 
  onSave, 
  onImport,
  exportTestCases 
}: GherkinEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightedContentRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, ch: 0 });

  const handleEditorInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.startsWith("Scenario: ")) {
      onContentChange("Scenario: " + text);
    } else {
      onContentChange(text);
    }
    
    const lines = text.split('\n');
    const currentLine = lines[lines.length - 1].trim();
    
    if (currentLine && !currentLine.includes(':')) {
      const matchingKeywords = KEYWORDS.filter(keyword => 
        keyword.toLowerCase().startsWith(currentLine.toLowerCase())
      );
      setSuggestions(matchingKeywords);
      setShowSuggestions(matchingKeywords.length > 0);
    } else {
      setShowSuggestions(false);
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
      return;
    }

    if (showSuggestions && e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const cursorPos = e.currentTarget.selectionStart;
        const textBeforeCursor = content.substring(0, cursorPos);
        const lastWord = textBeforeCursor.split(/\s+/).pop() || "";
        const suggestion = suggestions[0];
        
        const newContent = content.substring(0, cursorPos - lastWord.length) + 
          suggestion + 
          content.substring(cursorPos);
        
        onContentChange(newContent);
        setShowSuggestions(false);
      }
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onImport(content);
      };
      reader.readAsText(file);
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
        <Button 
          onClick={onSave}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Kaydet</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => document.getElementById('file-import')?.click()}
          className="flex items-center gap-2"
        >
          <Import className="h-4 w-4" />
          <span>İçeri Aktar</span>
        </Button>
        <input
          id="file-import"
          type="file"
          accept=".feature,.txt"
          onChange={handleFileImport}
          className="hidden"
        />

        <Button 
          variant="secondary"
          onClick={exportTestCases}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Dışa Aktar
        </Button>
      </div>

      {showSuggestions && (
        <div className="absolute top-[320px] left-4 bg-popover border border-border rounded-md shadow-md">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => {
                if (editorRef.current) {
                  const cursorPos = editorRef.current.selectionStart;
                  const textBeforeCursor = content.substring(0, cursorPos);
                  const lastWord = textBeforeCursor.split(/\s+/).pop() || "";
                  
                  const newContent = content.substring(0, cursorPos - lastWord.length) + 
                    suggestion + 
                    content.substring(cursorPos);
                  
                  onContentChange(newContent);
                  setShowSuggestions(false);
                }
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
