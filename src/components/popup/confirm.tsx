import { DangerZoneConfState, DesignType, HistoryConfirmationState, QuarantineConfirmationState, ScanFinishConfState, SchedulerConfState } from "@/lib/types"
import { useTranslation } from "react-i18next"
import Popup from "@/components/popup"

type ConfirmationType = "" | HistoryConfirmationState | QuarantineConfirmationState | DangerZoneConfState | ScanFinishConfState | SchedulerConfState

interface ConfirmationMessageProps{
     state: ConfirmationType
     submitAction: "" | "clear" | "delete" | "restore" | DangerZoneConfState | SchedulerConfState
     submitEvent?: () => void
     type?: DesignType
     onOpenChange: (state: ConfirmationType) => void
}

export default function ConfirmationMessage({
     state,
     submitAction,
     submitEvent,
     type="default",
     onOpenChange
}: ConfirmationMessageProps){
     const {t} = useTranslation("confirmation")
     if (state==="") return null
     return (
          <Popup
               open
               onOpen={(open)=>onOpenChange(open ? state : "")}
               title={t(`${state}.title`)}
               description={t(`${state}.desc`)}
               submitTxt={submitAction==="" ? undefined : t(`actions.${submitAction}`)}
               closeText={t("actions.cancel")}
               submitEvent={submitEvent}
               type={type}
          />
     )
}