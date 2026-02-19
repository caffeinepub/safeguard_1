import ChecklistForm from './components/ChecklistForm';

export default function App() {
  return (
    <div className="min-h-screen bg-neumorphic-base flex flex-col">
      <header className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-neumorphic-text text-center">
            SafeGuard
          </h1>
          <p className="text-sm text-neumorphic-text-muted text-center mt-2">
            Store Safety Checklist
          </p>
        </div>
      </header>
      
      <main className="flex-1 p-4 sm:p-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <ChecklistForm />
        </div>
      </main>
    </div>
  );
}
