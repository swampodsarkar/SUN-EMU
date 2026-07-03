import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, set, onChildAdded, onChildRemoved, onChildChanged, onDisconnect, remove, update } from "firebase/database";
import { db } from "./firebase";
import type { SupportedCore } from "../types";

export function useEmulatorSession() {
  const [pairCode, setPairCode] = useState<string>("");
  const [controllers, setControllers] = useState<any[]>([]);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [core, setCore] = useState<SupportedCore | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previousInputsRef = useRef<Record<string, Record<string, boolean>>>({});

  const simulateKey = useCallback((key: string, type: "keydown" | "keyup") => {
    const KEY_MAP: Record<string, { keyCode: number; code: string; key: string }> = {
      "ArrowUp": { keyCode: 38, code: "ArrowUp", key: "ArrowUp" },
      "ArrowDown": { keyCode: 40, code: "ArrowDown", key: "ArrowDown" },
      "ArrowLeft": { keyCode: 37, code: "ArrowLeft", key: "ArrowLeft" },
      "ArrowRight": { keyCode: 39, code: "ArrowRight", key: "ArrowRight" },
      "Enter": { keyCode: 13, code: "Enter", key: "Enter" },
      "Shift": { keyCode: 16, code: "ShiftLeft", key: "Shift" },
      "x": { keyCode: 88, code: "KeyX", key: "x" },
      "z": { keyCode: 90, code: "KeyZ", key: "z" },
      "s": { keyCode: 83, code: "KeyS", key: "s" },
      "a": { keyCode: 65, code: "KeyA", key: "a" },
      "q": { keyCode: 81, code: "KeyQ", key: "q" },
      "w": { keyCode: 87, code: "KeyW", key: "w" },
      "e": { keyCode: 69, code: "KeyE", key: "e" },
      "r": { keyCode: 82, code: "KeyR", key: "r" },
      "t": { keyCode: 84, code: "KeyT", key: "t" },
      "y": { keyCode: 89, code: "KeyY", key: "y" },
      "p": { keyCode: 80, code: "KeyP", key: "p" },
      "Escape": { keyCode: 27, code: "Escape", key: "Escape" },
      "f2": { keyCode: 113, code: "F2", key: "F2" },
      "f4": { keyCode: 115, code: "F4", key: "F4" },
      "f": { keyCode: 70, code: "KeyF", key: "f" },
      "h": { keyCode: 72, code: "KeyH", key: "h" },
      "i": { keyCode: 73, code: "KeyI", key: "i" },
      "g": { keyCode: 71, code: "KeyG", key: "g" },
      "k": { keyCode: 75, code: "KeyK", key: "k" },
      "m": { keyCode: 77, code: "KeyM", key: "m" },
      "o": { keyCode: 79, code: "KeyO", key: "o" },
      "u": { keyCode: 85, code: "KeyU", key: "u" },
      "v": { keyCode: 86, code: "KeyV", key: "v" },
      "c": { keyCode: 67, code: "KeyC", key: "c" }
    };

    const mapped = KEY_MAP[key] || {
      keyCode: key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0,
      code: key.length === 1 ? 'Key' + key.toUpperCase() : key,
      key: key
    };

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'KEY_EVENT',
        eventType: type,
        key: mapped.key,
        code: mapped.code,
        keyCode: mapped.keyCode,
        which: mapped.keyCode
      }, '*');
    }
  }, []);

  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPairCode(code);

    const sessionRef = ref(db, `sessions/${code}`);
    onDisconnect(sessionRef).remove();

    set(sessionRef, {
      createdAt: Date.now(),
      hostAlive: true
    }).catch(err => {
      console.error("Firebase rule error?", err);
    });

    const controllersRef = ref(db, `sessions/${code}/controllers`);

    const handleControllerAdded = (snapshot: any) => {
      const controllerId = snapshot.key;
      const data = snapshot.val();
      setControllers((prev) => [...prev, { id: controllerId, playerSlot: data.slot }]);
      previousInputsRef.current[controllerId] = data.inputs || {};
    };

    const handleControllerRemoved = (snapshot: any) => {
      const controllerId = snapshot.key;
      setControllers((prev) => prev.filter((c) => c.id !== controllerId));
      delete previousInputsRef.current[controllerId];
    };

    const handleControllerChanged = (snapshot: any) => {
      const controllerId = snapshot.key;
      const data = snapshot.val();
      const currentInputs = data.inputs || {};
      const previousInputs = previousInputsRef.current[controllerId] || {};

      Object.keys(currentInputs).forEach((key) => {
        if (currentInputs[key] && !previousInputs[key]) {
          simulateKey(key, "keydown");
        } else if (!currentInputs[key] && previousInputs[key]) {
          simulateKey(key, "keyup");
        }
      });

      Object.keys(previousInputs).forEach((key) => {
        if (previousInputs[key] && currentInputs[key] === undefined) {
          simulateKey(key, "keyup");
        }
      });

      previousInputsRef.current[controllerId] = currentInputs;
    };

    const unsubscribeAdded = onChildAdded(controllersRef, handleControllerAdded);
    const unsubscribeRemoved = onChildRemoved(controllersRef, handleControllerRemoved);
    const unsubscribeChanged = onChildChanged(controllersRef, handleControllerChanged);

    return () => {
      remove(sessionRef);
    };
  }, [simulateKey]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'EMULATOR_READY') {
        if (isPlaying && gameUrl && core && iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'START_EMULATOR',
            core: core,
            gameUrl: gameUrl
          }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPlaying, gameUrl, core]);

  useEffect(() => {
    if (!pairCode) return;
    const sessionRef = ref(db, `sessions/${pairCode}`);
    update(sessionRef, {
      core: core || null,
      gameName: gameName || "",
      isPlaying: isPlaying
    }).catch(err => {
      console.error("Failed to sync emulator state with Firebase:", err);
    });
  }, [pairCode, core, gameName, isPlaying]);

  return {
    pairCode,
    controllers,
    gameUrl,
    setGameUrl,
    core,
    setCore,
    gameName,
    setGameName,
    isPlaying,
    setIsPlaying,
    iframeRef
  };
}
