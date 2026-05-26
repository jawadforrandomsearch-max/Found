# Sadiqon Foundation Financial Aid Portal 🇵🇰

A modern, highly polished, fully responsive full-stack web application designed for the **Sadiqon Foundation**, a registered charitable welfare trust helping underprivileged students financially across Pakistan.

The portal incorporates direct **Firebase integration** (Firestore DB and Authentication), an automated, mathematically objective **Poverty Verification System**, real-time **Registrar CRUD controls**, dynamic **SVG verification chart suites**, detailed **file reviewers**, and complete **dual-locale (English + Urdu)** translation flows.

---

## 🛠️ Technology Stack
- **Frontend Core**: React 19 + TypeScript + Vite (Single Page Application architecture for high-speed local reactivity).
- **Styling**: Tailwind CSS v4 (Emerald green & pristine white brand layouts, glassmorphic accents, complete Light and Dark theme toggles).
- **Animations**: `motion` (elegant, micro-staggered list entrances and seamless overlay state transitions).
- **Database Backend**: Google Firebase Firestore (secure, real-time snapshot listener sync).
- **Authentication**: Firebase Auth (Real Google Sign-In for evaluators + Sandbox guest reviewer preview toggles).
- **Local Persistence**: Client storage and session-caches.

---

## 📁 Project Architecture & File Structure

```text
/
├── .env.example                  # Environment configuration blueprint
├── .gitignore                    # Local ignore declarations
├── firebase-applet-config.json   # Live Firebase client authentication credentials
├── firebase-blueprint.json       # Intermediate JSON representation schema (WHAT & WHERE DB)
├── firestore.rules               # Zero-Trust, Attribute-Based Access Control security rules
├── index.html                    # Single-view DOM anchor
├── metadata.json                 # AI Studio sandbox app credentials
├── package.json                  # Dependencies configuration manifests
├── README.md                     # Deep technical instruction manual (This document)
├── security_spec.md              # Penetration tests & "Dirty Dozen" malicious payload catalog
├── tsconfig.json                 # Enterprise compiler specifications
├── vite.config.ts                # Vite execution compiler plugins
└── src/
    ├── App.tsx                   # Central router, multi-language togglers, dark-mode trackers
    ├── firebase.ts               # Authenticated Firebase client initialize with error filters
    ├── index.css                 # Main global tailwind imports & font configurations
    ├── main.tsx                  # Root instantiation entry point
    ├── translations.ts           # Dual language dictionary assets (100% English & Urdu match)
    ├── types.ts                  # Shared TypeScript models and application type mappings
    ├── components/               # Specialized visual rendering files
    │   ├── AdminPanel.tsx        # Search registries, filters, SVG charts, and statuses modifier
    │   ├── DonationSection.tsx   # Sponsoring boxes, custom contributions, simulated invoices
    │   ├── HeroSection.tsx       # Core charity statements, trust badges, impact statistics
    │   ├── StudentForm.tsx       # Academic & financial multi-field collectors, Base64 scanners
    │   └── TrackingSection.tsx   # Secure individual Student ID status queries
    └── utils/
        └── povertyScorer.ts      # Automated mathematical prioritizer score logic calculator
```

---

## 🔑 Environment Variables Setup (`.env.example`)

To connect external API clients or manage development environments, configure local parameters securely:

```env
# GEMINI_API_KEY: Required for other background AI processes.
# Loaded automatically by standard AI Studio runner workflows.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The hosting end-point for Sadiqon Foundation.
APP_URL="https://sadiqonfoundation.org"
```

---

## 📊 Poverty Verification Logic Scoring Matrix

To prevent cognitive bias, the **Sadiqon Poverty Engine** calculates a dynamic score from 0 to 100:
1. **Income Levels (Max 40 Pts)**: Under 15,000 PKR gets `40 pts`, decreasing sequentially up to 60,000 PKR.
2. **Orphan Welfare (Max 25 Pts)**: Father deceased grants an automatic `25 pts` boost.
3. **Physical Disability (Max 15 Pts)**: Special abilities support grants an automatic `15 pts` modifier.
4. **Member Earning Density (Max 12 Pts)**: Families with a singular low-wage earner and large counts of children get up to `12 pts`.
5. **Academic High-achiever (Max 8 Pts)**: Marks &ge; 90% grant an extra `8 pts` to prioritize academic scholarships.

---

## 🚀 How to Run Locally

### 1. Install Node Dependencies
Ensure local engines match package declarations and run installation:
```bash
npm install
```

### 2. Initiate Dev Server Focus
Compile and execute using Vite runner hooks:
```bash
npm run dev
```
The application will boot on port **3000** locally and is viewable under `http://localhost:3000`.

---

## ☁️ Firebase Deployment Checklist (Hosting + Live Firestore)

Securely deploy Sadiqon's production-ready portal directly using the **Firebase CLI**:

### Step 1: Install Firebase Global Tools
```bash
npm install -g firebase-tools
```

### Step 2: Sign In & Bind Google Console
Ensure your console credentials match the Google Project:
```bash
firebase login
```

### Step 3: Link Project Workspace
Associate your local directory matching the active Project ID (`big-unison-497102-h7`):
```bash
firebase use --add big-unison-497102-h7
```

### Step 4: Compiling Assets
Execute optimized, production-grade minifiers to output statically inside `/dist`:
```bash
npm run build
```

### Step 5: Setting Up Deployment Directories
Initialize hosting configurations to target the compiled static assets directory:
```bash
firebase init hosting
```
- *What directory do you wish to target?* Specify **`dist`**.
- *Configure as a single-page app (rewrite all urls to /index.html)?* Choose **`Yes`**.

### Step 6: Deploy Rules & Hosting
Deploy Sadiqon's hardened Zero-Trust database restrictions and compiled layouts:
```bash
firebase deploy --only firestore:rules,hosting
```

---

## 🔒 Security Best-Practices In Sadiqon
1. **Single-Doc Queries**: Any guest can execute a `get` query targeting single document paths matching their **Tracking ID**. Bulk queries or standard collections scanning (`list` / `query`) are strictly forbidden to minimize data scanning.
2. **Hardened Fields**: Fields declaring submission timings (`createdAt`) or core identifiers remain immutable and require server synchronized time validations.
3. **Spam Mitigation**: Mandatory validations on file bounds restrict uploads to under 2MB.
