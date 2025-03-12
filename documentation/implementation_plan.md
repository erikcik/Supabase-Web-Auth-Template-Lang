**Implementation Plan for Auth-Template Project**

Below is a step‑by‑step implementation plan organized into phases. Each step includes a single action and cites the relevant document section or reference.

## Phase 1: Environment Setup

1.  **Initialize Mono Repo Structure:**

    *   Create a root directory (e.g., `/Auth-Template`) with two subdirectories: `/apps/web` for the Next.js web app and `/apps/mobile` for the Expo app.
    *   *Reference: PRD Section 1 & Tech Stack: Mono Repo Setup*

2.  **Initialize Next.js Web App:**

    *   In `/apps/web`, run `npx create-next-app@14 --typescript` to initialize a Next.js 14 project with TypeScript. (Remember: When using Next.js as the tech stack, install exactly version 14 to work well with LLM coding tools.)
    *   *Reference: Tech Stack: next_js_14*

3.  **Initialize Expo Mobile App:**

    *   In `/apps/mobile`, run `expo init --template expo-template-blank-typescript` and then update the project to use Expo SDK version 52.
    *   *Reference: Tech Stack: Expo_sdk_52*

4.  **Verify Correct Versions:**

    *   Check that the Next.js project package.json specifies Next.js 14 and the Expo project uses Expo SDK 52.
    *   *Validation: Inspect package.json files in *`/apps/web`* and *`/apps/mobile`*.*

## Phase 2: Frontend Development (Web - Next.js App)

1.  **Install Frontend Dependencies:**

    *   Install Tailwind CSS, Aceternity UI, shadcn/UI, Radix UI, and Lucide Icons in the `/apps/web` project.
    *   *Reference: Tech Stack (tailwind_css, shadcn_ui, radix_ui, lucide_icons, aceternity_ui)*

2.  **Configure Tailwind CSS:**

    *   Setup Tailwind by creating and updating `tailwind.config.js` and include required paths (e.g., `./pages/**/*.{js,ts,jsx,tsx}`, etc.).
    *   *Validation: Run *`npm run dev`* and check styles on a test page.*

3.  **Build Global Layout with Navbar:**

    *   Create a global layout component at `/apps/web/components/Layout.tsx` that includes a navbar with links for Sign In, Sign Up, and Profile.
    *   *Reference: PRD Section 3 (Authentication and Navigation)*

4.  **Develop Language Selection Modal:**

    *   Create `/apps/web/components/LanguageModal.tsx` that presents a modal for selecting between English and Turkish.
    *   *Reference: PRD Section 3 (Multilingual Support)*

5.  **Integrate Language Modal in _app.tsx:**

    *   Add the language modal into the Next.js custom App in `/apps/web/pages/_app.tsx` so it appears on initial load.
    *   *Validation: Launch the app and verify the modal appears on landing.*

6.  **Create Sign In Page:**

    *   Create the sign in page at `/apps/web/pages/auth/signin.tsx` with input fields for email and password.
    *   Include shadcn skeleton components for loading feedback.
    *   *Reference: PRD Section 3 (Authentication Flow)*

7.  **Create Sign Up Page:**

    *   Create the sign up page at `/apps/web/pages/auth/signup.tsx` with input fields for username, email, and password.
    *   Enforce password rules (minimum 8 characters and one special character).
    *   *Reference: PRD Section 4 (Password Validation & Auth Logic)*

8.  **Implement Custom Error Message Component:**

    *   Create `/apps/web/components/ErrorMessage.tsx` to display casual-tone error messages for validation, rate limiting, etc.
    *   *Reference: PRD Section 4 (Error Handling and Rate Limiting)*

9.  **Integrate OAuth Buttons and Flow:**

    *   In both Sign In and Sign Up pages, add buttons for OAuth providers (Google, GitHub, Facebook, Apple).
    *   After an OAuth sign in, redirect users to a separate prompt (or modal) which asks for a username. Create this as `/apps/web/pages/auth/oAuthUsername.tsx` or a modal component.
    *   *Reference: PRD Section 3 (OAuth Integration and Username Capture)*

10. **Create Dedicated OTP Input Component:**

    *   Build an OTP input component using shadcn’s design (e.g., `/apps/web/components/OTPInput.tsx`) to support the 6-digit OTP for email verification.
    *   *Reference: PRD Section on Email Verification & Frontend Guidelines*

11. **Develop Protected Profile Page:**

    *   Create the profile page at `/apps/web/pages/profile.tsx` that displays the user’s email, username, and their created posts.
    *   Ensure that if no active session exists, the page prompts the user to sign in or sign up.
    *   *Reference: PRD Section 3 (Profile Page and Protected Areas)*

12. **Implement Post Management Component:**

    *   Create `/apps/web/components/PostForm.tsx` to enable CRUD operations on posts. Include fields for title and content.
    *   *Reference: PRD Section 3 (User Profile and Posts Management)*

13. **Setup Supabase Client and Automatic Token Refresh:**

    *   Create a Supabase client configuration in `/apps/web/lib/supabaseClient.ts` that initializes Supabase Auth and configures automatic token refresh on each page load.
    *   *Reference: PRD Section 4 (Session Management and Database-based Sessions)*

14. **Implement API Rate Limiting Error Handling:**

    *   In API routes (if using Next.js API routes under `/apps/web/pages/api/`), integrate middleware to check and display custom error messages (casual tone) for rate limiting scenarios.
    *   *Reference: PRD Section 4 (Rate Limiting & Login Throttling)*

## Phase 3: Frontend Development (Mobile - Expo App)

1.  **Install Mobile Dependencies:**

    *   In `/apps/mobile`, install packages for react-native-reusables and configure Nativewind for styling.
    *   *Reference: Tech Stack (react_native_reusables, nativewind)*

2.  **Configure Nativewind:**

    *   Set up the Nativewind configuration (e.g., update `tailwind.config.js`) to work with the Expo project.
    *   *Validation: Run the Expo app and check that styles are applied correctly.*

3.  **Create Bottom Tab Navigator:**

    *   Build a bottom tab navigator in `/apps/mobile/navigation/BottomTabs.tsx` with two tabs: Home and Profile.
    *   *Reference: PRD Section 3 (Authentication and Navigation for Mobile)*

4.  **Develop Mobile Sign In Screen:**

    *   Create `/apps/mobile/screens/AuthSignIn.tsx` with input fields for email and password, and include OAuth buttons.
    *   *Reference: PRD Section 3 (Authentication Flow)*

5.  **Develop Mobile Sign Up Screen:**

    *   Create `/apps/mobile/screens/AuthSignUp.tsx` with input fields for username, email, and password, enforcing the basic password rules.
    *   *Reference: PRD Section 3 (Authentication Flow)*

6.  **Integrate Language Selection Modal on Mobile:**

    *   Build a language selection modal in `/apps/mobile/components/LanguageModal.tsx` so that users choose between English and Turkish on launch.
    *   *Validation: Verify the modal appears on app startup.*

7.  **Create Mobile Profile Screen:**

    *   In `/apps/mobile/screens/Profile.tsx`, display the user’s email, username, and list of posts with options to create, edit, or delete posts.
    *   If the user is unauthenticated, prompt with Sign In/Sign Up buttons.
    *   *Reference: PRD Section 3 (Profile Page and Post Management)*

8.  **Implement OAuth Flow on Mobile:**

    *   Add OAuth sign in/up options in mobile authentication screens and ensure post-OAuth a prompt for username capture is provided.
    *   *Reference: PRD Section 3 (OAuth Integration and Username Capture)*

9.  **Create Mobile OTP Input Component:**

    *   Develop an OTP input component for email verification in `/apps/mobile/components/OTPInput.tsx`, mirroring shadcn’s design inspirations.
    *   *Reference: PRD Section on Email Verification*

## Phase 4: Backend Development (Supabase Setup & Configuration)

1.  **Configure Supabase Project:**

    *   Set up a Supabase project to use Supabase Auth for authentication and maintain sessions using the central database instance.
    *   *Reference: PRD Section 2 & Tech Stack: supabase_auth, supabase*

2.  **Design Database Schema:**

    *   In Supabase, create tables for users and posts. The users table should include fields for id, email, username, and any session data. The posts table should include id, user_id, title, content, and timestamps.
    *   *Reference: PRD Section 3 (User Profile and Posts Management)*

3.  **Implement Server-Side Rate Limiting & Throttling:**

    *   Configure Supabase (or use Edge Functions/middleware) to enforce rate limits:

        *   Login: 1 attempt per second per IP and progressive back‑off for email-based login throttling (e.g., 1, 2, 4, 8, 15... seconds).
        *   OTP: Allow 5–10 attempts per hour per account with the OTP valid for 10–15 minutes; verification links expire after 2 hours.
        *   Apply similar rules for password reset operations.

    *   *Reference: PRD Section 4 (Rate Limiting & Security Measures) & Q&A*

## Phase 5: Integration

1.  **Centralize Supabase Client Configuration:**

    *   Create a shared Supabase client file at `/apps/common/supabaseClient.ts` (or equivalent) that both the web and mobile apps will import to ensure unified session and auth management.
    *   *Reference: PRD Section 4 (Database and Session Management)*

2.  **Connect Web App to Supabase:**

    *   In the Next.js app, update authentication calls (signup, signin, OAuth flows, etc.) to use the Supabase client, ensuring automatic token refresh on each page load.
    *   *Validation: Test authentication flows and confirm tokens are refreshed automatically.*

3.  **Connect Mobile App to Supabase:**

    *   In the Expo app, import the shared Supabase client and integrate Supabase Auth for mobile sign in, sign up, and session handling.
    *   *Validation: Run the mobile app and test authentication flows.*

4.  **Test OAuth and Username Capture Flow:**

    *   Simulate an OAuth sign in and verify that the flow correctly prompts for a username (on both web and mobile).
    *   *Validation: Manually test the OAuth process with one provider and capture the username on the subsequent screen.*

5.  **Validate Rate Limiting & Error Handling:**

    *   Simulate exceeding login, OTP, and password reset attempts to confirm custom casual error messages are displayed appropriately.
    *   *Validation: Trigger rate limits from both web and mobile and inspect error message display.*

## Phase 6: Deployment

1.  **Deploy Next.js App on Vercel:**

    *   Prepare environment variables (e.g., Supabase URL and keys) in Vercel. Deploy the Next.js app from `/apps/web` to Vercel.
    *   *Reference: PRD Section 7 (Constraints and Assumptions)*

2.  **Deploy Expo Mobile App:**

    *   Publish the Expo app as a development build ensuring the latest code is included.
    *   *Reference: PRD Section 7 (Deployment Assumptions)*

3.  **Configure CI/CD Pipelines:**

    *   Set up CI/CD (e.g., using GitHub Actions) to run tests for authentication flows and frontend presentations upon commits.
    *   *Validation: Run a pipeline build and verify tests pass.*

4.  **Perform End-to-End Testing:**

    *   Test the entire authentication flow (sign in, sign up, OAuth, token refresh, post management, rate limiting) on both the web and mobile platforms.
    *   *Validation: Use Cypress for web (if available) and manual testing for mobile.

5.  **Final Production Validation:**

    *   Verify that all sessions, UI components, error messages, and design elements (neo‑brutalist with royal blue hues and Aceternity UI) display correctly in production.
    *   *Reference: Non‑Functional Requirements (Performance, Security, Usability)*

This plan implements a fully fledged authentication logic across both Next.js (web) and Expo (mobile) apps in a mono repo, leveraging Supabase Auth and following all the detailed requirements from the PRD.
