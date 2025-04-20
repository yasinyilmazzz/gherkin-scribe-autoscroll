
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { GherkinEditor } from "@/components/GherkinEditor";
import { TestList } from "@/components/TestList";
import { useTestCases } from "@/hooks/useTestCases";
import { applySyntaxHighlighting } from "@/utils/gherkinHighlighter";
import { toast } from "sonner";

const Index = () => {
  const [editorContent, setEditorContent] = useState("Scenario: ");
  const {
    savedTests,
    editingId,
    selectedTest,
    setSelectedTest,
    saveTestCase,
    editTestCase,
    deleteTestCase,
    exportTestCases,
    importTestCase
  } = useTestCases();

  const handleSave = () => {
    saveTestCase(editorContent);
    setEditorContent("Scenario: ");
  };

  const handleEdit = (id: string) => {
    const content = editTestCase(id);
    setEditorContent(content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    const shouldClearEditor = deleteTestCase(id);
    if (shouldClearEditor) {
      setEditorContent("Scenario: ");
    }
  };

  const handleImport = (content: string) => {
    try {
      if (content.trim()) {
        importTestCase(content);
        toast("Başarılı", {
          description: "Test senaryosu içeri aktarıldı."
        });
      }
    } catch (error) {
      toast("Hata", {
        description: "Test senaryosu içeri aktarılamadı."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <h1 className="text-2xl font-bold mb-6">Cucumber Gherkin Test Case Editor</h1>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-4">
            <GherkinEditor
              content={editorContent}
              onContentChange={setEditorContent}
              onSave={handleSave}
              onImport={handleImport}
            />
            
            <h2 className="text-xl font-semibold mb-4">Kaydedilmiş Test Senaryoları</h2>
            <TestList
              tests={savedTests}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={setSelectedTest}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-4">
            <div className="w-full h-full border border-border rounded-lg bg-background p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {selectedTest ? (
                  <div dangerouslySetInnerHTML={{ __html: applySyntaxHighlighting(selectedTest) }} />
                ) : (
                  <div className="text-muted-foreground text-center">
                    Görüntülemek için bir test senaryosu seçin
                  </div>
                )}
              </pre>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <footer className="mt-10 pt-5 text-center text-muted-foreground text-sm border-t border-border">
        Created by yasin yilmaz @2025
      </footer>
    </div>
  );
};

export default Index;
