import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "@/context/settings";
import { invoke } from "@tauri-apps/api/core";

type RealtimeContextValue = {
     enabled: boolean;
     start(): Promise<void>;
     stop(): Promise<void>;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
     const { settings } = useSettings();
     const [enabled, setEnabled] = useState(settings.realTime);
     const start = async () => {
          await invoke("start_real_time_scan", { behavior: settings.behavior || "balanced" });
          await invoke("update_tray_icon",{state: "enabled"})
     };
     const stop = async () => {
          await invoke("stop_real_time_scan");
          await invoke("update_tray_icon",{state: "disabled"})
     };
     useEffect(() => {
          if(!settings.realTime){
               stop();
               setEnabled(false);
               return
          }
          start();
          setEnabled(true);
     }, [settings.realTime, settings.behavior]);
     return (
          <RealtimeContext.Provider
               value={{
                    enabled,
                    start: async () => {
                         await start();
                         setEnabled(true);
                    },
                    stop: async () => {
                         await stop();
                         setEnabled(false);
                    },
               }}
          >
               {children}
          </RealtimeContext.Provider>
     );
}

export function useRealtimeScan() {
     const ctx = useContext(RealtimeContext);
     if (!ctx) {
          throw new Error("useRealtimeContext must be used inside RealtimeProvider");
     }
     return ctx;
}