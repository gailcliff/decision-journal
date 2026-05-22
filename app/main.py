from datetime import date, timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Decision Journal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JournalEntryRequest(BaseModel):
    entry_text: str


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "service": "decision-journal"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}


@app.post("/journal-entry")
def read_journal_entry(journal_entry: JournalEntryRequest) -> dict[str, str]:
    entry_date = date.today()
    review_date = entry_date + timedelta(days=7)

    return {
        "entry_text": journal_entry.entry_text,
        "entry_date": entry_date.isoformat(),
        "review_date": review_date.isoformat(),
    }
