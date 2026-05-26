# Sadiqon Foundation Security Specification

This document details the Zero-Trust Security Specification, Data Invariants, and the "Dirty Dozen" malicious request payloads for the Sadiqon Foundation portal Firestore configuration.

## 1. Data Invariants & Zero-Trust Policies
- **Anonymous Submissions**: Anyone can create an Application, but they must NOT be able to modify, delete, or read applications created by others.
- **Identity Integrity**: For unsigned submissions or tracking lookups, students must supply their exact Unique Student ID (`SF-...`) to track status. They can strictly only read matching documents via single `get` queries—never list or grab bulk records.
- **Admin Isolation**: Admin features (viewing lists, updating statuses, editing remarks, deleting records) are strictly restricted to authenticated administrators whose email addresses represent verified Google Sign-In records matching authorized administrators (`admins` collection check or the bootstrapped admin email `jawadforrandomsearch@gmail.com`).
- **Veracity Verification**: Role fields, student audit keys (like `needScore` and `status` at creation) cannot be set to self-verified values like `Approved` or `Verified` by the submitting client. They default to `Pending` and can only be set by authorized reviewer accounts.
- **Temporal Enforcement**: The `createdAt` timestamp must match target transaction execution time (`request.time`). Modifying `createdAt` later is completely forbidden.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following represent 12 specific JSON payloads designed to test or bypass access constraints, each resulting in a strict `PERMISSION_DENIED`:

### Payload 1: Admin Privilege Escalation (Self-Promo)
*Submitting a request targeting user profile creation or editing to make themselves an admin.*
```json
{
  "path": "/admins/attacker-uid",
  "method": "create",
  "auth": { "uid": "attacker-uid", "token": { "email": "attacker@spam.com", "email_verified": true } },
  "data": {
    "email": "attacker@spam.com",
    "role": "SuperAdmin"
  }
}
```
*Outcome*: `Permission Denied` (Only existing admins or the system can initialize administrators).

### Payload 2: Status Tampering (Self-Approve)
*A student trying to submit their application with the status preset to `Approved` to bypass the review sequence.*
```json
{
  "path": "/applications/new-app-id",
  "method": "create",
  "auth": null,
  "data": {
    "fullName": "Imposter Student",
    "cnic": "42101-1234567-9",
    "phone": "+923001234567",
    "monthlyIncome": 15000,
    "academicMarks": 85,
    "status": "Approved",
    "needScore": 95
  }
}
```
*Outcome*: `Permission Denied` (All client submissions must begin in `Pending` with matching computed client-side scores).

### Payload 3: Creation Timestamp Spooting
*A student trying to set a historic creation date to look like they applied months ago.*
```json
{
  "path": "/applications/new-app-id",
  "method": "create",
  "auth": null,
  "data": {
    "fullName": "Student Alpha",
    "cnic": "42101-1234567-9",
    "phone": "+923001234567",
    "monthlyIncome": 15000,
    "academicMarks": 85,
    "status": "Pending",
    "createdAt": "2020-01-01T00:00:00Z"
  }
}
```
*Outcome*: `Permission Denied` (The `createdAt` field must strictly match server-assigned `request.time`).

### Payload 4: Orphan Field Injection (Denial-of-Wallet)
*Injecting giant unrequested payload strings inside files or text to strain host storage allocations.*
```json
{
  "path": "/applications/sample-app-id",
  "method": "create",
  "auth": null,
  "data": {
    "fullName": "A".repeat(50000), 
    "cnic": "42101-1234567-9",
    "phone": "+923001234567",
    "schoolName": "B".repeat(50000),
    "monthlyIncome": 15000,
    "academicMarks": 85,
    "status": "Pending"
  }
}
```
*Outcome*: `Permission Denied` (Size boundaries on text prevent massive junk character ingestion).

### Payload 5: Unauthenticated Collection Harvesting (List Scrape)
*An unauthenticated user attempting flat queries of student database arrays to harvest PII.*
```json
{
  "path": "/applications",
  "method": "list",
  "auth": null,
  "data": {}
}
```
*Outcome*: `Permission Denied` (Only recognized verified administrators are allowed index list reads).

### Payload 6: Non-Admin Identity Spoofing (Modifying Other Student's App)
*An attacker with arbitrary token attempting to swap ID reference on student file.*
```json
{
  "path": "/applications/student-beta-id",
  "method": "update",
  "auth": { "uid": "random-scrapper", "token": { "email": "scrapper@bad.com", "email_verified": true } },
  "data": {
    "fullName": "Compromised Name"
  }
}
```
*Outcome*: `Permission Denied` (Updates require admin privilege authentication; basic users cannot overwrite application records).

### Payload 7: ID Poisoning Attack
*Injecting garbage document IDs including control characters, slashes, or script tags.*
```json
{
  "path": "/applications/../admins/another-attacker-uid",
  "method": "create",
  "auth": null,
  "data": {
    "fullName": "Poison Agent",
    "cnic": "42101-1234567-9"
  }
}
```
*Outcome*: `Permission Denied` (Path matching structure rejects directory traversal and ensures ID validation patterns match standard formats).

### Payload 8: Immutable Field Overwrite
*An attacker attempting to update immutable student record fields after application is in revision.*
```json
{
  "path": "/applications/app-id",
  "method": "update",
  "auth": { "uid": "reviewer-uid", "token": { "email": "reviewer@foundation.com", "email_verified": true } },
  "data": {
    "id": "altered-doc-id",
    "studentId": "SF-ALTERED"
  }
}
```
*Outcome*: `Permission Denied` (Primary index columns like ID keys are permanent and cannot be altered during modification operations).

### Payload 9: Empty/Malformed Field Ingestion
*Attempting to add records without required fields to trigger schema crashing.*
```json
{
  "path": "/applications/app-id",
  "method": "create",
  "auth": null,
  "data": {
    "fullName": "Incomplete Student Record"
  }
}
```
*Outcome*: `Permission Denied` (Validation blocks fields missing mandatory items like CNIC, school, and academic records).

### Payload 10: Value Poisoning (Invalid Type/Underflow Range)
*Entering negative numbers for monetary distributions to disrupt ledger parameters.*
```json
{
  "path": "/applications/app-id",
  "method": "create",
  "auth": null,
  "data": {
    "fullName": "Student Gamma",
    "cnic": "42101-1234567-9",
    "phone": "+923001234567",
    "schoolName": "Standard High",
    "monthlyIncome": -100000, 
    "academicMarks": 999
  }
}
```
*Outcome*: `Permission Denied` (Numeric checks ensure bounds validation).

### Payload 11: Bypassing Verified Email Claim
*An attacker logging in with Google but with an unverified email address trying to view applications.*
```json
{
  "path": "/applications",
  "method": "list",
  "auth": { "uid": "unverified-uid", "token": { "email": "jawadforrandomsearch@gmail.com", "email_verified": false } },
  "data": {}
}
```
*Outcome*: `Permission Denied` (Rules strictly verify `email_verified == true`).

### Payload 12: Terminal State Bypass
*An attacker attempting to revert an application that was marked as Rejected or Approved back to Verified or Pending to re-trigger loops.*
```json
{
  "path": "/applications/existing-approved-id",
  "method": "update",
  "auth": { "uid": "contributor-uid", "token": { "email": "reviewer@foundation.com", "email_verified": true } },
  "data": {
    "status": "Pending"
  }
}
```
*Outcome*: `Permission Denied` (State transition restrictions lock terminal states from ordinary reviewer updates unless override logic is applied).

---

## 3. Test Runner Definition
The following represents the structure of the Firestore rules validator that verifies all security invariants.
The official `firestore.rules` will implement matching validations.
