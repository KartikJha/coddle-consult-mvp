# Coddle Consult Expert MVP

A React Native (Expo) MVP demonstrating the "Consult Expert" feature for Coddle. This project showcases a seamless user flow, polished UX/UI, and a simulated expert consultation experience.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the App**:
    ```bash
    npx expo start
    ```

## Architecture Decisions

The architecture was chosen to balance speed of development with a premium, "native" feel that mimics the main Coddle application.

*   **Global Layout Pattern (`MainLayout`)**:
    *   **Decision**: Wrap all consult screens in a persistent layout component rather than using individual headers.
    *   **Why**: To simulate the stability of a tabbed application where the header and bottom navigation remain static while content changes. This simplifies integration into the main app later.
*   **Context-Based State (`ConsultContext`)**:
    *   **Decision**: Use React Context for state management (`concern`, `supportType`, `history`).
    *   **Why**: Redux or MobX would be overkill for this MVP. Context provides sufficient global access for the consult flow and effortless data passing between the Chat and Provider screens.
*   **Intro Screen as Gateway**:
    *   **Decision**: Use an `IntroScreen` as the hub for both starting new consults and viewing history.
    *   **Why**: It segregates the consult flow from the main "Home" feed, providing a dedicated landing space for the feature.

## Trade-offs & technical constraints

*   **In-Memory Persistence**:
    *   **Trade-off**: Chat history is stored in React State (memory).
    *   **Impact**: Refreshing the app clears history.
    *   **Reason**: sufficient for MVP demonstration without setting up `AsyncStorage` or a database.
*   **Mocked Backend**:
    *   **Trade-off**: Chat responses and payments are simulated with `setTimeout`.
    *   **Impact**: No real network requests are made.
    *   **Reason**: fast front-end iteration; dependent on backend availability.
*   **UI-Driven Navigation**:
    *   **Trade-off**: The "Home" screen is a simulation.
    *   **Impact**: The bottom navigation tabs (except "AI Assistant") are visual placeholders.
    *   **Reason**: focus strictly on the Consult flow user journey.

## What I'd Build Next

1.  **Real-Time Chat Integration**: Replace the state machine with a WebSocket/Socket.io connection to the real Coddle backend.
2.  **Persistent Storage**: Implement `AsyncStorage` or `SQLite` to cache chat history locally so it survives app restarts.
3.  **Deep Linking**: Support deep links (e.g., `coddle://consult/video`) to open the app directly to specific consult types.
4.  **Dark Mode Support**: Extend the `theme/colors.ts` system to support a system-wide dark theme.
