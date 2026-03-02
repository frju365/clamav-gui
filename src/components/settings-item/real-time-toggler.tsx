import { useSettings } from "@/context/settings";
import { Switch } from "../ui/switch";
import { useRealtimeScan } from "@/context/real-time";
import { useState } from "react";
import Popup from "../popup";
import { useTranslation } from "react-i18next";

export function RealTimeToggle(){
     const [isOpen, setIsOpen] = useState(false)
     const { settings, setSettings } = useSettings();
     const {start, stop} = useRealtimeScan()
     const handleToggle = async (enabled: boolean) => {
          if (enabled) {
               setSettings({ realTime: true });
               await start();
          } else {
               setIsOpen(true);
          }
     };
     const confirmDisable = async () => {
          setIsOpen(false);
          setSettings({ realTime: false });
          await stop();
     };
     const {t} = useTranslation("settings")
     return (
          <>
          <Switch
               checked={settings.realTime}
               onCheckedChange={handleToggle}
          />
          <Popup
               open={isOpen}
               onOpen={setIsOpen}
               title={t("advanced.real-time-scan.confirmation.title")}
               description={t("advanced.real-time-scan.confirmation.desc")}
               submitTxt={t("advanced.real-time-scan.confirmation.turn-off")}
               submitEvent={confirmDisable}
               closeText={t("advanced.real-time-scan.confirmation.cancel")}
               type="danger"
          />
          </>
     )
}