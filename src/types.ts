export type SupportedCore = 
  | "nes" | "snes" | "n64" | "gb" | "gbc" | "gba" | "nds" 
  | "sms" | "segaMD" | "gg" | "segacd" | "32x" | "saturn" 
  | "psx" | "atari2600" | "atari5200" | "atari7800" | "lynx" | "jaguar" 
  | "neogeo" | "ngp" | "ngpc" | "pce" | "pcecd" 
  | "wswan" | "wsc" | "vb" | "coleco" | "msx" | "dos" | "arcade" | "fba";

export interface EmulatorInputEvent {
  id: string; // socket id of the controller
  type: "keydown" | "keyup" | "axis";
  key: string;
  value?: number; // for analog
}

export interface ControllerState {
  connected: boolean;
  buttons: Record<string, boolean>;
  axes: number[];
}

