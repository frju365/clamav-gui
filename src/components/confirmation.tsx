import { DangerZoneConfState, DesignType, HistoryConfirmationState, QuarantineConfirmationState, ScanFinishConfState, SchedulerConfState } from "@/lib/types"
import { useTranslation } from "react-i18next"
import Popup from "./popup"

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
     return (
          <Popup
               open={state!==""}
               onOpen={(open)=>onOpenChange(open ? state : "")}
               title={state==="" ? "" : t(`confirmation.${state}.title`)}
               description={state==="" ? undefined : t(`confirmation.${state}.desc`)}
               submitTxt={submitAction==="" ? undefined : t(`confirmation.actions.${submitAction}`)}
               closeText={t("confirmation.actions.cancel")}
               submitEvent={submitEvent}
               type={type}
          />
     )
}