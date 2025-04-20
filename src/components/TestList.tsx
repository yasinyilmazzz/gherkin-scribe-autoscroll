
interface Test {
  id: string;
  title: string;
  content: string;
}

interface TestListProps {
  tests: Test[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (content: string) => void;
}

export const TestList = ({ tests, onEdit, onDelete, onSelect }: TestListProps) => {
  return (
    <div className="grid gap-4 overflow-y-auto max-h-[calc(100vh-600px)]">
      {tests.length === 0 ? (
        <div className="text-muted-foreground text-center p-5">
          Henüz kaydedilmiş test senaryosu yok.
        </div>
      ) : (
        tests.map(test => (
          <div key={test.id} className="border border-border rounded-lg bg-card">
            <div className="flex justify-between items-center p-4">
              <div 
                className="font-semibold cursor-pointer flex-grow"
                onClick={() => onSelect(test.content)}
              >
                {test.title}
              </div>
              <div className="flex gap-1">
                <button 
                  className="p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(test.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button 
                  className="p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => onDelete(test.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

