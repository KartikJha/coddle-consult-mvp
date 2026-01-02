# Coddle Consult Expert MVP

This project is a React Native (Expo) implementation of the Coddle "Consult Expert" feature MVP. It demonstrates a multi-step user flow, mock payment logic, and a simulated chat state machine, enhanced with delightful UX patterns.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the App**:
    ```bash
    npx expo start
    ```

## Architecture & UX

*   **Global Layout**: `MainLayout` provides a consistent header (with child profile) and bottom navigation (persistent across screens).
*   **Navigation**:
    *   `react-navigation` handles the screen stack `Home` -> `Intro` -> `Concern` -> `Provider` -> `Chat` -> `Completion`.
    *   `Home` is the entry point, featuring a "Consult" FAB.
    *   `Intro` serves as the gateway to the consult flow and access to chat history.
*   **State**: `ConsultContext` persists user choices and `chatHistory`.
*   **Animations**:
    *   `Animated` API for entrance, scale, and fade effects.
    *   `LayoutAnimation` for smooth UI layout changes (error messages, input state).
*   **Haptics**: `expo-haptics` provides tactile feedback for interactions.

## Key Features

-   **Global Navigation**: Enhanced navigation with a persistent bottom bar and a custom header across the consult flow.
-   **Chat History**: View the last 5 completed chat sessions in a read-only modal (accessible from `Intro` screen).
-   **Mock Payment**: Simulated secure payment flow with locking animation and status text.
-   **Chat Simulation**: 4-state machine with realistic typing indicators and message entrance animations.
-   **Interactive UI**: Cards and buttons respond to touch with scale animations and haptics.
-   **Progress Tracking**: Visual progress bar on multi-step forms.

## Future Improvements

*   **Real Backend**: Connect to a socket/API for real-time chat.
*   **Persistence**: Use `AsyncStorage` to save chat history permanently.
*   **Dark Mode**: Add full dark mode support.
