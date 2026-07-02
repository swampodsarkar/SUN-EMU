import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, set, onChildAdded, onChildRemoved, onChildChanged, onDisconnect, remove } from "firebase/database";
import { db } from "./firebase";
import type { SupportedCore } from "../types";

export function useEmulatorSession() {
  const [pairCode, setPairCode] = useState<string>("");
  const [controllers, setControllers] = useState<any[]>([]);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [core, setCore] = useState<SupportedCore | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [romKey, setRomKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previousInputsRef = useRef<Record<string, Record<string, boolean>>>({});

  const incrementRomKey = useCallback(() => setRomKey(k => k + 1), []);

  const simulateKey = useCallback((key: string, type: "keydown" | "keyup") => {
    let keyCode = 0;
    switch (key) {
      case "ArrowUp": keyCode = 38; break;
      case "ArrowDown": keyCode = 40; break;
      case "ArrowLeft": keyCode = 37; break;
      case "ArrowRight": keyCode = 39; break;
      case "Enter": keyCode = 13; break;
      case "Shift": keyCode = 16; break;
      case "x": keyCode = 88; break;
      case "z": keyCode = 90; break;
      case "s": keyCode = 83; break;
      case "a": keyCode = 65; break;
      case "q": keyCode = 81; break;
      case "w": keyCode = 87; break;
    }

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'KEY_EVENT',
        eventType: type,
        key: key,
        code: key === 'Enter' ? 'Enter' : key === 'Shift' ? 'ShiftLeft' : key.includes('Arrow') ? key : 'Key' + key.toUpperCase(),
        keyCode: keyCode,
        which: keyCode
      }, '*');
    }
  }, []);

  const sendStartEmulator = useCallback(() => {
    if (isPlaying && gameUrl && core && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'START_EMULATOR',
        core: core,
        gameUrl: gameUrl
      }, '*');
    }
  }, [isPlaying, gameUrl, core]);

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
    sendStartEmulator();
  }, [sendStartEmulator, romKey]);

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
    iframeRef,
    romKey,
    incrementRomKey,
    sendStartEmulator
  };
}
