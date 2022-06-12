import {
  EngineTypes,
  ISignClient,
  SignClientTypes,
} from "@walletconnect/types";

export interface SignServerToClientEvents {
  "sign_client:ready": () => void;
  "sign_client:pair_ok": () => void;
  "sign_client:session_proposal": (
    data: SignClientTypes.EventArguments["session_proposal"]
  ) => void;
  "sign_client:session_approve_ok": () => void;
  "sign_client:session_request": (
    data: SignClientTypes.EventArguments["session_request"]
  ) => void;
  "sign_client:session_ping": (
    data: SignClientTypes.EventArguments["session_ping"]
  ) => void;
  "sign_client:session_event": (
    data: SignClientTypes.EventArguments["session_event"]
  ) => void;
  "sign_client:session_update": (
    data: SignClientTypes.EventArguments["session_update"]
  ) => void;
  "sign_client:session_delete": (
    data: SignClientTypes.EventArguments["session_delete"]
  ) => void;
}

export interface SignClientToServerEvents {
  "sign_client:pair": (data: EngineTypes.PairParams) => void;
  "sign_client:session_approve": (data: EngineTypes.ApproveParams) => void;
  "sign_client:session_proposal": (
    data: SignClientTypes.EventArguments["session_proposal"]
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignInterServerEvents {
  "sign_client:session_proposal": (
    data: SignClientTypes.EventArguments["session_proposal"]
  ) => void;
}

export interface SignSocketData {
  signClient: ISignClient;
}
