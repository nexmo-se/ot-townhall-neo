export type AcceptedRole = "participant" | "moderator" | "presenter";
export interface Role {
  loginType: "default" | "ama" | "sso";
  pin: string;
  raiseHand?: boolean;
}

export interface Tabs {
  questions: boolean;
  participants: boolean;
  polling: boolean;
  chat: boolean;
}

export type State = {
  status: "open" | "locked"
}