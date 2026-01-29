# SOFTWARE DEVELOPMENT CONTRACT

**Contract Date:** Wednesday, 21st January, 2026
**Contract Number:** IC-CONTRACT-2026-01-21

**Between:**
- **Ajibola Akelebe (DON_GENIUS)** (Developer/Contractor)
- **Zora African Market** (Client, represented by Aglo Technologies Solutions Limited)

---

## PART A: PRELIMINARY PROVISIONS

### 1. RECITALS

WHEREAS, Ajibola Akelebe (DON_GENIUS) is engaged in the business of software development and technology solutions;

WHEREAS, Zora African Market desires to engage Ajibola Akelebe (DON_GENIUS) to develop an E-commerce Aggregator Application;

WHEREAS, Aglo Technologies Solutions Limited acts as the authorized representative and agent for Zora African Market in this transaction;

WHEREAS, both parties wish to enter into this contract to define their respective rights and obligations;

NOW, THEREFORE, the parties agree as follows:

---

### 2. PARTIES

**Developer/Contractor:**
- **Name:** Ajibola Akelebe (DON_GENIUS)
- **Email:** ajiboladolapogenius@gmail.com
- **Phone:** +234 806 328 1921
- **Address:** Ibadan, Oyo State, Nigeria

**Client:**
- **Company Name:** Zora African Market
- **Project Name:** Zora African Market

**Client's Authorized Representative:**
- **Company Name:** Aglo Technologies Solutions Limited
- **Authorized Representative:** Sir Lekan
- **Email:** hello@agltechnologies.com
- **Phone:** +234 818 888 6018

**Note:** Aglo Technologies Solutions Limited acts as the authorized representative and agent for Zora African Market in all matters relating to this contract, including communications, approvals, payments, and contract execution.

---

## PART B: PROJECT SPECIFICATIONS

### 3. PROJECT SCOPE & DELIVERABLES

#### 3.1. Project Description
Ajibola Akelebe (DON_GENIUS) ("Developer" or "Contractor") agrees to develop a complete E-commerce Aggregator Application (native mobile application using React Native with Expo) for Zora African Market ("Client"), represented by Aglo Technologies Solutions Limited, connecting customers with suppliers/partners, including order management, payment processing, supplier mapping, and customer communication. The application will be optimized for mobile performance, smooth scrolling, and high-quality image handling, providing a professional retail app experience.

#### 3.2. Development Phases

| Phase | Deliverables | Duration |
| --- | --- | --- |
| **1. Design & Planning** | App designs, wireframes, database schema, architecture docs, UI/UX mockups, UI foundation setup (NativeWind + NativeWindUI) | 2 Weeks |
| **2. Core Features** | Order management, customer tracking, payment integration (Stripe, Klarna, Clearpay), credit balance, refunds, state management (Zustand + TanStack Query) | 4 Weeks |
| **3. Maps & Directory** | Google Maps integration, supplier coverage areas, geofencing, partner directory | 2 Weeks |
| **4. Communication & Reviews** | Email threading system, QR codes, reviews integration | 2 Weeks |
| **5. Shipping Automation** | Automated rate calculation, label generation, order tracking, API integration | 2 Weeks |
| **6. Mobile App & Launch** | React Native app optimization, native Android/iOS builds, app store submission, testing, deployment | 2 Weeks |

**Additional Deliverables:** Source code, technical documentation, user manuals, training (2 sessions × 2 hours), database backups.

#### 3.3. Technology Stack

| Layer | Technology | Reason |
| --- | --- | --- |
| **Frontend** | Expo (React Native) | Fastest development cycle; easy App Store submission via EAS (Expo Application Services) |
| **State Management** | Zustand + TanStack Query | Zustand for cart/auth state; TanStack Query to cache product lists from various sources |
| **Styling** | NativeWind (Tailwind) + NativeWindUI | Allows use of Tailwind skills in mobile environment; NativeWindUI provides pre-built UI components |
| **Payments** | Stripe, Klarna, Clearpay | Stripe for credit/debit cards; Klarna for buy now, pay later; Clearpay for installment payments |
| **Backend/API & Database** | Supabase | Robust API to aggregate data from different sources into single JSON schema for the app; includes PostgreSQL database, authentication, real-time capabilities, and serverless functions |
| **Maps** | Google Maps Platform API | React Native integration for supplier coverage areas |
| **Email** | Postmark | Email threading and customer communications |
| **Image Optimization** | Expo Image | Caching and optimization for high-quality product images |

**App Store Submission:** Via EAS (Expo Application Services) for Google Play Store & Apple App Store

**Note:** This is a mobile-only application optimized for native mobile performance, smooth scrolling, and professional retail app experience. The tech stack is chosen for fastest development cycle and optimal mobile performance.

---

### 4. PROJECT TIMELINE

**Duration:** 14 weeks from contract execution

**Key Milestones:**
- Week 2: Design approval
- Week 6: Core features demo
- Week 10: Maps & communication demo
- Week 12: Beta testing
- Week 14: App store submission
- Week 16-17: Launch (subject to app store approval)

**Delays:** Client-caused delays extend timeline. App store approval (1-2 weeks) is beyond Developer's control.

---

## PART C: FINANCIAL TERMS

### 5. PRICING & PAYMENT

#### 5.1. Total Project Cost
**₦2,500,000** (Two Million Five Hundred Thousand Naira) - inclusive of all development, design, testing, and app store submission.

#### 5.2. Payment Schedule

| Payment | Percentage | Amount (₦) | Trigger | Timeline |
| --- | --- | --- | --- | --- |
| **1st Payment** | 25% | ₦625,000 | Contract execution | Upon signing |
| **2nd Payment** | 15% | ₦375,000 | Design approval & Phase 1 completion | Week 2 |
| **3rd Payment** | 25% | ₦625,000 | Core features complete (Phase 2) | Week 6 |
| **4th Payment** | 20% | ₦500,000 | Testing complete & Phase 5 completion | Week 12 |
| **5th Payment** | 15% | ₦375,000 | Final launch (app store live) | Week 16-17 |

**Total:** 100% = ₦2,500,000

#### 5.3. Payment Details
**Bank:** Provident Bank
**Account Name:** Ajibola Akelebe
**Account Number:** 6506606845

**Payment Method:** Bank transfer to the account specified above.

**Late Payments:**
- Payments overdue by more than 7 days will incur a late fee of 5% per month.
- Developer reserves the right to suspend work if payments are overdue by more than 14 days.
- Work will resume upon receipt of overdue payment plus late fees.

**Note:** Payments may be made by Zora African Market directly or through Aglo Technologies Solutions Limited as their authorized representative.

#### 5.4. Cost Inclusions & Exclusions

**Included in ₦2,500,000:**
- All development tools, software, and frameworks (React Native, Expo, EAS, Zustand, TanStack Query, NativeWind, NativeWindUI, development tools)
- Development/staging hosting during project period (Supabase database and backend services)
- API usage costs during development and testing
- App store registration fees (Google Play $25, Apple $99)
- Development account setup and configuration (Expo/EAS, app store accounts)

**Client Pays Separately (After Launch):**
- Production database & backend hosting (~$25-40/mo via Supabase)
- Email services (~$15/mo via Postmark)
- Google Maps API (pay-as-you-go, free tier available)
- Payment gateway transaction fees (per transaction - Stripe/Klarna/Clearpay)
- Expo services (optional, free tier available for OTA updates)

**Note:** Monthly operational costs commence only after app launch. All development costs are included in the project fee. Mobile apps don't require web hosting, reducing operational costs compared to web applications.

---

## PART D: OBLIGATIONS & RESPONSIBILITIES

### 6. CLIENT RESPONSIBILITIES

#### 6.1. Required Materials & Access
- Payment gateway accounts (Stripe, Klarna, Clearpay) with API keys - Week 2
- Shipping provider account access - Week 6
- Google Maps API key - Week 4
- Postmark account - Week 8
- Review system API access - Week 8
- App store developer accounts (Google Play, Apple) - Week 8
- Logo files (PNG/SVG), brand colors, fonts - Week 1
- Partner store information - Week 4

#### 6.2. Approvals
- Design approvals: 2-3 days after presentation
- Content review: Within agreed timelines
- Beta testing participation: Week 12-13
- App store listing approval

**Note:** Delays in materials/approvals extend timeline accordingly.

---

### 7. DEVELOPER RESPONSIBILITIES

- Develop according to industry best practices
- Ensure PCI DSS and GDPR compliance
- Provide weekly progress updates
- Respond to inquiries within 48 hours (business days)
- Conduct milestone demonstrations
- Provide 3-month warranty support post-launch
- Response times: Critical (4hrs), Important (24hrs), Normal (48hrs)

---

## PART E: INTELLECTUAL PROPERTY & WARRANTIES

### 8. INTELLECTUAL PROPERTY RIGHTS

**Ownership Transfer:** Upon receipt of final payment, all custom-developed code, designs, and documentation transfer to Zora African Market (Client).

**Third-Party Components:** Remain subject to their licenses. Client responsible for maintaining third-party service licenses.

**Portfolio Rights:** Developer (Ajibola Akelebe) may use Project for portfolio/marketing with Zora African Market's written approval.

---

### 9. WARRANTIES & SUPPORT

#### 9.1. Warranty Period
**3 months** from launch date. Includes: bug fixes, security updates, technical support, minor adjustments to delivered features.

#### 9.2. Warranty Exclusions
Warranty does not cover: Client modifications, hosting issues, third-party service problems, unauthorized features, misuse.

#### 9.3. Post-Warranty Support
- **Basic:** ₦100,000/month
- **Standard:** ₦200,000/month
- **Enterprise:** ₦350,000/month

---

## PART F: CONTRACT MANAGEMENT

### 10. CHANGE MANAGEMENT

Scope changes require written agreement. Additional features quoted separately and may affect timeline/cost. Changes documented via Change Order.

---

### 11. CONFIDENTIALITY

Both parties maintain confidentiality of business information, technical specs, customer data, and financial information for **3 years** after project completion/termination.

---

### 12. TERMINATION

**By Client:** 14 days written notice + payment for completed work (prorated).

**By Developer:** If Client payment overdue >30 days, material breach, or 14 days written notice.

**Effect:** Deliver completed work, pay for completed work, confidentiality continues, return/destroy confidential information.

---

## PART G: LEGAL PROVISIONS

### 13. LIMITATION OF LIABILITY

Developer's total liability capped at contract value (₦2,500,000). Excludes indirect, consequential, or incidental damages; loss of profits/revenue/data; third-party service issues; Client-caused problems.

---

### 14. DISPUTE RESOLUTION

Disputes resolved through good faith negotiation, then mediation before legal action.

---

### 15. FORCE MAJEURE

Neither party liable for delays/failures due to: natural disasters, war/terrorism, government actions, internet/telecom failures, third-party outages.

---

### 16. GENERAL PROVISIONS

- **Parties:** This contract is between Ajibola Akelebe (DON_GENIUS) (Developer) and Zora African Market (Client). References to "Developer" mean Ajibola Akelebe (DON_GENIUS), and references to "Client" mean Zora African Market.
- **Client Representation:** Aglo Technologies Solutions Limited acts as the authorized representative and agent for Zora African Market in this transaction. All communications, approvals, and payments may be made through Aglo Technologies Solutions Limited on behalf of Zora African Market.
- **Entire Agreement:** This contract + PRD Version 2.0 (dated 21st January, 2026) constitute entire agreement.
- **Amendments:** Must be in writing and signed by Developer and Client (or their authorized representative).
- **Severability:** Invalid provisions don't affect remaining terms.
- **Assignment:** Requires written consent from other party.
- **Notices:** In writing via email to addresses specified above. Notices to Client may be sent to Aglo Technologies Solutions Limited as Client's representative.

---

## PART H: SIGNATURES

### DEVELOPER

**Signature:** _________________________

**Name:** Ajibola Akelebe (DON_GENIUS)

**Date:** Wednesday, 21st January, 2026

**Email:** ajiboladolapogenius@gmail.com

**Phone:** +234 806 328 1921

---

### CLIENT

**Client:** Zora African Market
**Represented By:** Aglo Technologies Solutions Limited

**Signature:** _________________________

**Name:** Sir Lekan

**Title:** Authorized Representative

**Company:** Aglo Technologies Solutions Limited

**Date:** Wednesday, 21st January, 2026

**Email:** hello@agltechnologies.com

**Phone:** +234 818 888 6018

---

**Contract Prepared By:** Ajibola Akelebe (DON_GENIUS)
**Date:** Wednesday, 21st January, 2026
**Version:** 1.0
