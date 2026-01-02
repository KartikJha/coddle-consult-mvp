Coddle Consult MVP - Development & Design Journey
Summary: A chronological overview of the design decisions and features that shaped the MVP.

1. Foundation & Scaffolding
Architecture: Established the core screen stack (
Intro
 -> 
Concern
 -> 
Provider
 -> 
Chat
 -> 
Completion
) immediately to define the full user journey.
Goal: Rapidly scaffold the flow without getting bogged down in details initially.
2. Core Experience & Polish
Component Design: Modularized the UI early on.
UX Decision: Prioritized Haptics (expo-haptics) and Visual Progress tracking nearly immediately.
Reasoning: To make the app feel "alive" and premium from the very first interactive build.
3. Brand Integration & Main App Simulation
Primary Motivator: The decision to pivot the UX was driven by the ease of integration into the existing Coddle app.
Visual Identity: Aligned color scheme (Navy/Salmon/Cream) with the main app screenshots provided.
UX Strategy: Created a simulated "Main App" environment (Home with FAB & Bottom Nav) rather than an isolated flow.
Benefit: This allows the MVP code to be dropped into the main codebase with minimal friction, as it already respects the parent app's navigation patterns and aesthetic.
4. Global Layout Architecture
Refactor: Moved away from individual, screen-specific headers.
Design Decision: Implemented a Global 
MainLayout
 wrapper.
Result: The Header (with Child Profile) and Bottom Navigation remain persistent and stable while the content area transitions. This mimics a high-quality native tabbed experience.
5. Advanced Logic & Refinement
Logic Upgrade: "Book Video" up-sell in Chat now utilizes Context Reuse. It navigates to Step 2 (Provider) with the initial concern preserved but the support type upgraded, minimizing user effort.
Feature: Chat History. Added read-only access to past chats to increase feature value.
Final Polish:
Moved "History" access to the 
IntroScreen
 (establishing it as the "Consult Gateway").
Cleaned up layout spacing and positioned the "Get Started" button for better accessibility.
