export type SupportedCore = 
  | "nes" | "snes" | "gb" | "gbc" | "gba" | "nds" 
  | "segaMD" | "sms" | "gg" | "psx" | "atari2600" | "dos" | "arcade";

export interface EmulatorInputEvent {
  id: string; // socket id of the controller
  type: "keydown" | "keyup" | "axis";
  key: string;
  value?: number; // for analog
}
