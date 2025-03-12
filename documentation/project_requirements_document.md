# Project Requirements Document: Auth-Template

## 1. Project Overview

The Auth-Template project is focused on creating a robust authentication system that works seamlessly on both a Next.js web app and an Expo-based mobile app using a mono repo structure. This solution will unify account management via a single Supabase database instance and follow the best practices of Supabase Auth. Core functionalities include sign in, sign up, sign out, protected pages (ensuring only authenticated users can access certain areas), and an intuitive profile page where users can manage their posts. The system will also integrate multiple OAuth providers like Google, GitHub, Facebook, and Apple. In addition, it includes essential security measures, rate limiting, multilingual support, and a dedicated user experience for both platforms.

This project is built to provide a consistent authentication and user management experience for users across web and mobile platforms. It is being developed for users who want to create and manage their accounts effectively while enjoying a smooth, neo-brutalist design with a minimalistic touch using Aceternity UI. Success will be measured by the flow’s seamlessness, the security and reliability of authentication (including support for OAuth and database-backed session management), and clear, casual error communications that help users understand any issues that arise.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   Implementation of full authentication flows for both web (Next.js) and mobile (Expo) apps.
*   Sign up, sign in, sign out, and protected pages.
*   Profile page displaying user details (email, username) and user posts.
*   Integration of OAuth providers (Google, GitHub, Facebook, Apple) with a follow-up username capture for OAuth sign ups.
*   Email verification via a 6-digit OTP with a dedicated OTP input component.
*   Rate limiting and login throttling based on IP addresses and emails (including custom limits for OTP and password resets).
*   Automatic token refresh on every site access.
*   Multilingual support for Turkish and English via a modal.
*   CRUD operations (create, update, delete) for user posts.
*   Basic password security rules (minimum 8 characters and at least one special character).

**Out-of-Scope:**

*   Any administrative user roles or advanced permissions (only standard user roles are supported).
*   Additional onboarding steps beyond the core authentication flow.
*   Advanced password strength meters or detailed user feedback during password creation.
*   Custom branding or color palette configurations beyond the use of comforting royal blue hues.
*   Extra features outside of the described authentication, profile management, and post operations.

## 3. User Flow

When a user first accesses the application, they are greeted with a neo-brutalist interface that uses soothing royal blue hues. A modal immediately prompts them to select their preferred language (English or Turkish) to ensure all content is displayed accordingly. After this initial step, users see a clearly defined navigation interface: on the web, the navbar includes sign in and sign up options, whereas the mobile app uses bottom tabs to access Home and Profile. New users can quickly register using email/password or via OAuth, and OAuth users are immediately asked to choose a username.

Once a user signs in or registers, they are automatically redirected to their profile page. This profile page displays their email, username, and any posts they have created. For users not signed in, the profile page shows clear options to sign in or sign up. Posts management (creating, updating, and deleting posts) is directly accessible on the profile page. Throughout the application, clear, casual error messages are displayed if any issues occur, such as rate limiting or invalid credentials, ensuring the user always knows what to do next.

## 4. Core Features (Bullet Points)

*   **Authentication Flow:**\
    • Sign in, sign up, and sign out for both web and mobile apps.\
    • OAuth integration with Google, GitHub, Facebook, and Apple.\
    • Post-OAuth username capture for a complete registration process.
*   **Profile Management:**\
    • A dedicated profile page displaying user email, username, and posts.\
    • Full CRUD operations for posts (create, update, delete).
*   **UI and Design:**\
    • Neo-brutalist and minimalistic design using Aceternity UI with royal blue hues.\
    • Navbar for web with sign in/up and a bottom-tab navigation for mobile.\
    • Use of shadcn skeleton components for loading feedback and dedicated OTP input component for email verification.
*   **Security Measures & Rate Limiting:**\
    • Password validation rules (minimum 8 characters and one special character).\
    • Email verification via 6-digit OTP, with expiration and throttling (5-10 attempts per hour, valid for 10-15 minutes).\
    • Login throttling (based on email and IP: 1 attempt per second per IP, progressive timeout increases).\
    • Rate limiting for all API requests (including 10 attempts limit per IP for any request).
*   **Session and Database Management:**\
    • Sessions maintained via Supabase database with automatic token refresh every time a user accesses the site.\
    • Unified session management across both Next.js and Expo apps.
*   **Multilingual Support:**\
    • Supports English and Turkish with language selection presented via a modal.
*   **Error Handling:**\
    • Custom, casually toned error messages to inform users about failed attempts or limits reached (for sign in, OTP requests, or password resets).

## 5. Tech Stack & Tools

*   **Frontend (Web):**\
    • Next.js 14\
    • TypeScript\
    • Tailwind CSS\
    • Shadcn/UI components (including skeleton components and OTP input)\
    • Radix UI\
    • Lucide Icons\
    • Aceternity UI
*   **Mobile (Expo):**\
    • Expo SDK version 52\
    • React Native Reusables for common components\
    • Nativewind for styling
*   **Backend & Authentication:**\
    • Supabase Auth for authentication logic\
    • Supabase for the database and session management
*   **Additional Tools & Integrations:**\
    • Cursor (Advanced IDE for AI-powered coding and real-time suggestions)\
    • Claude 3.7 Sonnet (Anthropic's intelligent model for reasoning and code assistance)

## 6. Non-Functional Requirements

*   **Performance:**\
    • Fast load times with responsive design on both web and mobile platforms.\
    • Use of skeleton components to provide instant feedback while data is loading.
*   **Security:**\
    • Compliance with best practices for authentication and session management including rate limiting and token refresh mechanisms.\
    • Protection against brute-force attacks using progressive login throttling and IP rate limiting.
*   **Usability:**\
    • Casual and clear error messages to guide users during failures (e.g., when rate limits are reached or incorrect credentials are entered).\
    • Smooth and intuitive navigation with consistent UI across platforms.
*   **Compliance:**\
    • Basic compliance with modern web security standards and user data privacy practices.
*   **Scalability:**\
    • Designed to efficiently handle simultaneous authentication requests from both the web and mobile client.

## 7. Constraints & Assumptions

*   The project assumes the basic setup for Next.js and Expo apps is already present in the codebase, with the Expo app published as a development build and the Next.js app deployed on Vercel.
*   The authentication system is built to work with the mono repo structure and a single Supabase database instance.
*   Automatic token refresh will occur every time a user accesses the site, ensuring sessions are not stale.
*   API rate limiting and throttling are enforced as described, relying on the availability and configuration of Supabase Auth features.
*   Only standard user roles are supported; no administrative or special permissions will be implemented beyond basic user functionality.
*   The design will adhere strictly to the neo-brutalist style with comforting royal blue hues and minimalism as spotlighted in the project requirements.

## 8. Known Issues & Potential Pitfalls

*   **Integration Across Platforms:**\
    • Synchronizing authentication logic between Next.js and Expo apps can lead to edge-case issues in session management.\
    • Mitigation: Rigorously test session transitions and automatic token refreshes on both platforms.
*   **Rate Limiting & Throttling:**\
    • Complex throttling rules (based on IP and email) may result in legitimate users being temporarily blocked if they happen to trigger limits.\
    • Mitigation: Implement clear, casual error messages and consider user feedback for rate limit warnings.
*   **OAuth Flows:**\
    • Ensuring a smooth transition from OAuth sign in to username capture might introduce race conditions or UI lags.\
    • Mitigation: Use dedicated components with proper state management and test across all supported OAuth providers.
*   **Multilingual Support:**\
    • Managing translations and ensuring consistency across the app can be challenging, especially with dynamic error messages.\
    • Mitigation: Maintain a central repository for translations and enforce a consistent style guide.
*   **User Experience Consistency:**\
    • Maintaining design consistency between the web and mobile platforms using different UI libraries (Aceternity UI and Nativewind) might lead to mismatches.\
    • Mitigation: Create shared design tokens and guidelines to standardize the user interface across platforms.

This document provides a clear reference for all future technical documents and should help guide the AI model through every aspect of implementation with no room for ambiguity.
