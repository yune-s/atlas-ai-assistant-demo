# AI Assistant for Moroccan Training Centers

A simple MVP chatbot demo for training centers in Morocco. It answers common student questions from a local knowledge base, detects pricing/registration intent, collects leads, and saves them to Google Sheets when configured. If Google Sheets is not configured, it saves leads to `data/leads.json` so the demo still works locally.

## Features

- Next.js, TypeScript, Tailwind CSS
- Landing page with a clear problem/solution pitch
- WhatsApp-style chatbot page at `/chat`
- Local JSON knowledge base at `data/knowledge-base.json`
- Lead collection form for pricing and registration requests
- Google Sheets lead storage through an API route
- Local JSON fallback lead storage
- Simple admin dashboard at `/admin`
- OpenAI-powered replies when `OPENAI_API_KEY` is configured
- Local deterministic replies when OpenAI is not configured

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required for AI replies:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Required for Google Sheets lead storage:

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your_google_sheet_id
```

Optional:

```bash
OPENAI_MODEL=gpt-4o-mini
GOOGLE_SHEETS_SHEET_NAME=Leads
```

## Run Locally

```bash
npm run dev
```

Open:

- Landing page: `http://localhost:3000`
- Chat demo: `http://localhost:3000/chat`
- Admin dashboard: `http://localhost:3000/admin`

## Build

```bash
npm run build
```

Then run the production server:

```bash
npm run start
```

## Manual Tests

Use the chat demo at `http://localhost:3000/chat` and verify:

- Test A: `Bonjour` should return a friendly greeting.
- Test B: `Quels sont les cours disponibles ?` should list all available courses.
- Test C: `Python` should return course information without showing the lead form.
- Test D: `prix` should explain that prices depend on the course and show the lead form.
- Test E: `فين كاين المركز؟` should return the center location.
- Test F: `شنو كاين من تكوينات؟` should list courses in Arabic/Darija.
- Test G: `بغيت نسجل` should return the registration message and show the lead form.
- Test H: `واش كاين online؟` should return the online-course options answer.
- Test I: `Do you teach cooking?` should fall back to a human advisor.
- Test J: `Web Development` should return course information without immediately transferring to a human.

## Google Sheets Setup

1. Create a Google Sheet.
2. Rename the first tab to `Leads`, or set `GOOGLE_SHEETS_SHEET_NAME` to your tab name.
3. Add headers in row 1:

```text
Full name | Phone number | Course | City | Original message | Date/time
```

4. Create a Google Cloud project.
5. Enable the Google Sheets API.
6. Create a service account.
7. Create a JSON key for the service account.
8. Copy `client_email` into `GOOGLE_SHEETS_CLIENT_EMAIL`.
9. Copy `private_key` into `GOOGLE_SHEETS_PRIVATE_KEY`.
10. Share the Google Sheet with the service account email as an editor.
11. Copy the spreadsheet ID from the Google Sheet URL into `GOOGLE_SHEETS_SPREADSHEET_ID`.

When these variables are missing, leads are saved locally in `data/leads.json`.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables in Vercel Project Settings.
4. Deploy.

For production lead storage on Vercel, configure Google Sheets. The local JSON fallback is intended for local demos because serverless file storage is temporary.

## Knowledge Base

Edit `data/knowledge-base.json` to customize the demo center:

- Center name
- City and location
- Courses
- Languages
- Opening hours
- Registration instructions
- Phone number
- Pricing policy

The assistant is instructed to use only this knowledge base. For unknown or complex questions, it transfers the request to a human advisor.

## Project Structure

```text
app/
  api/chat/route.ts        AI response API
  api/leads/route.ts       Lead save API
  admin/page.tsx           Local fallback dashboard
  chat/page.tsx            Chatbot page
components/
  ChatWidget.tsx           WhatsApp-style chat UI and lead form
data/
  knowledge-base.json      Local demo knowledge base
  leads.json               Local fallback lead storage
lib/
  openai.ts                OpenAI prompt and fallback behavior
  google-sheets.ts         Google Sheets integration
  lead-storage.ts          Google Sheets/local JSON save logic
```
