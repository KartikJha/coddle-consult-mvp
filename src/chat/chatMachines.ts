import { ChatMessage, ChatPhase } from './chatTypes';

export interface ChatState {
  phase: ChatPhase;
  messages: ChatMessage[];
}

export type ChatEvent =
  | { type: 'CLINICIAN_REPLY_1'; text: string }
  | { type: 'USER_FOLLOWUP_SENT'; text: string }
  | { type: 'CLINICIAN_REPLY_2'; text: string }
  | { type: 'RESET' };

export const initialChatState = (initialMessage: string): ChatState => ({
  phase: 'WAITING_FOR_CLINICIAN_1',
  messages: [{ from: 'user', text: initialMessage }],
});

export function chatReducer(state: ChatState, event: ChatEvent): ChatState {
  switch (event.type) {
    case 'CLINICIAN_REPLY_1':
      return {
        phase: 'USER_FOLLOWUP',
        messages: [...state.messages, { from: 'clinician', text: event.text }],
      };

    case 'USER_FOLLOWUP_SENT':
      return {
        phase: 'WAITING_FOR_CLINICIAN_2',
        messages: [...state.messages, { from: 'user', text: event.text }],
      };

    case 'CLINICIAN_REPLY_2':
      return {
        phase: 'COMPLETE',
        messages: [...state.messages, { from: 'clinician', text: event.text }],
      };

    case 'RESET':
      return state;

    default:
      return state;
  }
}
