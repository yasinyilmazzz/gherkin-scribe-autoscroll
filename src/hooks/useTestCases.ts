import { useState, useEffect } from 'react';
import { toast } from "sonner";

interface TestCase {
  id: string;
  title: string;
  content: string;
}

export const useTestCases = () => {
  const [savedTests, setSavedTests] = useState<TestCase[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  useEffect(() => {
    const storedTests = localStorage.getItem('gherkinTests');
    if (storedTests) {
      setSavedTests(JSON.parse(storedTests));
    }
  }, []);

  const saveTestCase = (content: string) => {
    if (!content.trim()) {
      toast("Hata", {
        description: "Boş test senaryosu kaydedilemez."
      });
      return;
    }

    const scenarioMatch = content.match(/Scenario:\s*(.+)$/m);
    const title = scenarioMatch ? scenarioMatch[1].trim() : 'İsimsiz Senaryo';

    if (editingId) {
      const updatedTests = savedTests.map(test =>
        test.id === editingId ? { ...test, title, content } : test
      );
      setSavedTests(updatedTests);
      localStorage.setItem('gherkinTests', JSON.stringify(updatedTests));
      setEditingId(null);
    } else {
      const newTest = {
        id: Date.now().toString(),
        title,
        content
      };
      const newTests = [...savedTests, newTest];
      setSavedTests(newTests);
      localStorage.setItem('gherkinTests', JSON.stringify(newTests));
    }

    toast("Başarılı", {
      description: "Test senaryosu kaydedildi."
    });
  };

  const editTestCase = (id: string) => {
    const testToEdit = savedTests.find(test => test.id === id);
    if (testToEdit) {
      setEditingId(id);
      return testToEdit.content;
    }
    return '';
  };

  const deleteTestCase = (id: string) => {
    if (window.confirm('Bu test senaryosunu silmek istediğinize emin misiniz?')) {
      const newTests = savedTests.filter(test => test.id !== id);
      setSavedTests(newTests);
      localStorage.setItem('gherkinTests', JSON.stringify(newTests));
      toast("Başarılı", {
        description: "Test senaryosu silindi."
      });

      if (editingId === id) {
        setEditingId(null);
        return true;
      }
    }
    return false;
  };

  const exportTestCases = () => {
    if (savedTests.length === 0) {
      toast("Hata", {
        description: "Dışa aktarılacak test senaryosu yok."
      });
      return;
    }

    const exportContent = savedTests.map(test => test.content).join('\n\n');
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'gherkin_test_cases.feature';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Başarılı", {
      description: "Test senaryoları dışa aktarıldı."
    });
  };

  const importTestCase = (content: string) => {
    const scenarios = content.split(/\n\n(?=Scenario:)/);
    
    scenarios.forEach(scenario => {
      if (scenario.trim()) {
        const scenarioMatch = scenario.match(/Scenario:\s*(.+)$/m);
        const title = scenarioMatch ? scenarioMatch[1].trim() : 'İsimsiz Senaryo';
        
        const newTest = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title,
          content: scenario.trim()
        };
        
        savedTests.push(newTest);
      }
    });
    
    localStorage.setItem('gherkinTests', JSON.stringify(savedTests));
    setSavedTests([...savedTests]);
  };

  const extractSavedSteps = () => {
    const steps: string[] = [];
    savedTests.forEach(test => {
      const lines = test.content.split('\n');
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('Given ') || 
            trimmedLine.startsWith('When ') || 
            trimmedLine.startsWith('Then ') || 
            trimmedLine.startsWith('And ') || 
            trimmedLine.startsWith('But ')) {
          if (!steps.includes(trimmedLine)) {
            steps.push(trimmedLine);
          }
        }
      });
    });
    return steps;
  };

  return {
    savedTests,
    editingId,
    selectedTest,
    setSelectedTest,
    saveTestCase,
    editTestCase,
    deleteTestCase,
    exportTestCases,
    importTestCase,
    extractSavedSteps
  };
};
