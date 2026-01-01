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

*   **Navigation**: `react-navigation` handles the screen stack `Intro` -> `Concern` -> `Provider` -> `Chat` -> `Completion`.
*   **State**: `ConsultContext` persist user choices.
*   **Animations**:
    -   `Animated` API for entrance, scale, and fade effects.
    -   `LayoutAnimation` for smooth UI layout changes (error messages, input state).
*   **Haptics**: `expo-haptics` provides tactile feedback for interactions (wrapped safely for web/simulator).

## Key Features

-   **Mock Payment**: Simulated secure payment flow with locking animation and status text.
-   **Chat Simulation**: 4-state machine with realistic typing indicators and message entrance animations.
-   **Interactive UI**: Cards and buttons respond to touch with scale animations and haptics.
-   **Progress Tracking**: Visual progress bar on multi-step forms.

## Future Improvements

*   **Real Backend**: Connect to a socket/API for real-time chat.
*   **Persistence**: Use `AsyncStorage` to save chat history.
*   **Dark Mode**: Add full dark mode support.
