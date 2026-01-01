export type ChatPhase =
  | 'WAITING_FOR_CLINICIAN_1'
  | 'USER_FOLLOWUP'
  | 'WAITING_FOR_CLINICIAN_2'
  | 'COMPLETE';

export interface ChatMessage {
  from: 'user' | 'clinician';
  text: string;
}
