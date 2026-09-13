# Student Voice — Backend

FastAPI backend for the Student Voice complaint portal. Handles email domain verification (OTP), session tokens, and routes complaints directly to the Principal's inbox via email — with no database and no persistent storage of student identity or complaint data.

## Tech Stack

- FastAPI
- Pydantic (request validation)
- smtplib (Gmail SMTP for email delivery - Simple Mail Transfer Protocol)
- python-dotenv (environment variable management)

## Project Structure

```
app/
  main.py              # FastAPI app entry point, CORS config, route registration
  routes/
    auth.py             # /auth/request-otp, /auth/verify-otp
    complaints.py        # /complaints/submit
  schemas/
    auther.py           # Email & OTP request validation (Pydantic models)
    complaint.py         # Complaint request validation
  services/
    otp.py               # OTP generation, in-memory storage, verification
    session.py            # Short-lived, single-use session tokens
    email_service.py      # Sends OTP email + complaint email via Gmail SMTP
```

## Setup

### 1. Create and activate a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the backend root:

```
SENDER_EMAIL=yourcommonaddress@gmail.com 
SENDER_PASSWORD=your_16_character_app_password for that commonmailID
RECEIVER_EMAIL=principal@krce.ac.in
```

> `SENDER_PASSWORD` must be a Gmail **App Password**, not your regular Gmail password. Generate one from Google Account → Security → 2-Step Verification → App Passwords (requires 2-Step Verification enabled).

**Never commit `.env` to version control.** Make sure it's listed in `.gitignore`.

### 4. Run the server

```bash
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`. Confirm it's live at `http://localhost:8000/health`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/request-otp` | Sends a 6-digit OTP to a given `@krce.ac.in` email |
| POST | `/auth/verify-otp` | Verifies the OTP; returns a short-lived session token |
| POST | `/complaints/submit` | Submits a complaint (requires valid `X-Session-Token` header) |

## Design Notes

- **No database.** OTPs and session tokens live only in server memory for the duration needed, then expire or are deleted.
- **OTPs expire in 5 minutes** and are never returned in API responses — only delivered via email.
- **Session tokens are single-use** and expire in 15 minutes, issued only after successful OTP verification.
- **Complaint submissions carry no identity data** — the `ComplaintRequest` schema has no email field, so the Principal's copy cannot be traced back to a specific student.
- Email domain is validated server-side (`@krce.ac.in` only) via a Pydantic field validator.

## Generating `requirements.txt`

If you install new packages during development, regenerate it with:

```bash
pip freeze > requirements.txt
```

## Known Limitations

- In-memory storage means OTPs/sessions are lost if the server process restarts — acceptable for this use case since OTPs are meant to be short-lived anyway.
- No rate limiting on `/auth/request-otp` yet — a per-email cooldown would be a reasonable future addition.
- Deployment requires updating `allow_origins` in `main.py` to the deployed frontend's real URL (currently set to `http://localhost:5173` for local development).
