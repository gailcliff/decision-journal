import { FormEvent, useState } from 'react';

type JournalEntry = {
  entry_text: string;
  entry_date: string;
  review_date: string;
};

function App() {
  const [entry, setEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEntry = entry.trim();

    if (!trimmedEntry) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/journal-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry_text: trimmedEntry }),
      });

      if (!response.ok) {
        throw new Error('Unable to save the journal entry.');
      }

      const newEntry = (await response.json()) as JournalEntry;
      setJournalEntries((currentEntries) => [newEntry, ...currentEntries]);
      setEntry('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save the journal entry.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="journal-panel" aria-labelledby="page-title">
        <div className="heading-group">
          <p className="eyebrow">Decision Journal</p>
          <h1 id="page-title">Capture a decision</h1>
        </div>

        <form className="entry-form" onSubmit={handleSubmit}>
          <label htmlFor="decision-entry">Journal entry</label>
          <textarea
            id="decision-entry"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="Write what you decided, why it mattered, and what you expect to happen..."
            rows={8}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={entry.trim().length === 0 || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}

        {journalEntries.length > 0 && (
          <section className="entries-section" aria-labelledby="entries-title">
            <h2 id="entries-title">Journal entries</h2>
            <ul className="entry-list">
              {journalEntries.map((journalEntry, index) => (
                <li
                  className="journal-entry"
                  key={`${journalEntry.entry_date}-${journalEntry.review_date}-${index}`}
                >
                  <p>{journalEntry.entry_text}</p>
                  <dl>
                    <div>
                      <dt>Entry date</dt>
                      <dd>{journalEntry.entry_date}</dd>
                    </div>
                    <div>
                      <dt>Review date</dt>
                      <dd>{journalEntry.review_date}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
