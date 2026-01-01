# Coddle Consult Expert MVP

This project is a React Native (Expo) implementation of the Coddle "Consult Expert" feature MVP. It demonstrates a multi-step user flow, mock payment logic, and a simulated chat state machine.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the App**:
    ```bash
    npx expo start
    ```
    -   Press `i` to open in iOS Simulator (if on macOS).
    -   Press `a` to open in Android Emulator.
    -   Scan the QR code with Expo Go on a physical device.

## Architecture

*   **Navigation**: `react-navigation` (Native Stack) handles the flow between screens (`Intro` -> `Concern` -> `Provider` -> `Chat` -> `Completion`).
*   **State Management**: React Context (`ConsultContext`) is used to persist the user's `concern` text and `supportType` (chat vs video) across screens. This avoids prop drilling and allows easy resetting of the flow.
*   **Chat Logic**: The `ChatScreen` implements a 4-state machine to simulate a live consult:
    1.  `initial_wait`: User waits for the clinician to review text.
    2.  `unlocked`: Clinician replies, user can type a follow-up.
    3.  `second_wait`: User sends follow-up, waits for final advice.
    4.  `complete`: Final advice received, session ends.

## Design Decisions & Trade-offs

*   **Mock Functionality**: Payment and Clinician replies are mocked with `setTimeout` to simulate network/processing delays without a real backend.
*   **Styling**: Used `StyleSheet` for standard, performance-friendly React Native styling. Used a clean, flat aesthetic consistent with medical/parenting apps.
*   **Video Flow**: For the MVP, the "Video Consult" path routes to the Completion screen (simulating a confirmed booking) or could be easily extended to a "Waiting Room" screen.
*   **Component Structure**: Screens are kept self-contained. Reusable UI components (like Buttons/Cards) could be extracted further for a larger app, but are inline or minimal here for MVP speed and clarity.

## Future Improvements

*   **Real Backend**: Connect to a socket/API for real-time chat.
*   **Persistence**: Use `AsyncStorage` to save chat history if the app is closed.
*   **Validation**: Add more robust form validation and error handling.
*   **Animations**: Add `LayoutAnimation` or `Reanimated` for smoother transitions between chat states.
