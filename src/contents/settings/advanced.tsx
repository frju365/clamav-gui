import { SCAN_SETTINGS } from "@/lib/constants/settings/scan-options";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/settings";
import { DEFAULT_BACKEND_SETTINGS, DEFAULT_SETTINGS, FILE_SCAN_WHITELIST, MAX_LONG_LINES_CHOICES, SCAN_OPTION_ICON } from "@/lib/constants/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Braces, FlaskConical, RotateCcw, Scale, ScrollText, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { BehaviorMode } from "@/lib/types/enums";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanProfile } from "@/hooks/use-scan-profile";
import { SettingsProps } from "@/lib/types/props";
import { RealTimeToggle } from "@/components/settings-item/real-time-toggler";
import LoadingButton from "@/components/loading-button";
import { IDangerZoneState } from "@/lib/types/states";
import { INITIAL_DANGER_ZONE_STATE } from "@/lib/constants/states";
import Popup from "@/components/popup";
import { toast } from "sonner";
import { store } from "@/lib/store";
import SettingsOption from "@/components/settings-item/settings-option";
import { useTranslation } from "react-i18next";
import { BackendSettings, ScanOptionKeys } from "@/lib/types/settings";
import { ObjectEntries } from "@/lib/helpers";
import { ChoiceOption } from "@/components/settings-item/scan-option";
import { ActionType } from "@/lib/types";
import { isDescKey } from "@/lib/helpers/scan";
import FolderPathFormLoader from "@/components/loaders/path-form";
import FolderPathForm from "@/components/settings-item/path-form";
import { useBackendSettings } from "@/hooks/use-settings";

export default function AdvancedSettings({scanProfile}: SettingsProps){
     const {settings, setSettings} = useSettings();
     const { values, setValue, isLoading } = useScanProfile(scanProfile);
     const [isPending, startTransition] = useTransition();
     const [dangerZoneState, setDangerZoneState] = useState<IDangerZoneState>(INITIAL_DANGER_ZONE_STATE);

     const [isFetching, startFetching] = useTransition()
     const {getSettingsByKey,setSettingsbyKey} = useBackendSettings()
     const [paths, setPaths] = useState<BackendSettings["monitoringPaths"]>(DEFAULT_BACKEND_SETTINGS.monitoringPaths);
     const {t: messageTxt} = useTranslation("messages")
     useEffect(()=>{
          startFetching(async()=>{
               try {
                    const stored = await getSettingsByKey("monitoringPaths")
                    setPaths(val=>!stored ? val : stored)
               } catch (err){
                    toast.error(messageTxt("fetch-error.realtime-paths"),{
                         description: String(err)
                    });
               }
          })
     },[])
     const updatePaths = async(value: BackendSettings["monitoringPaths"]) => {
          await setSettingsbyKey("monitoringPaths",value);
          setPaths(value)
     }
     const monitoringPaths = useMemo(()=>!paths ? DEFAULT_BACKEND_SETTINGS.monitoringPaths: paths,[paths]);
     const handlePathAction = async (value: string, action: "add" | "remove") => {
          if(value.trim()==="") return;
          const mainArr = !paths ? DEFAULT_BACKEND_SETTINGS.monitoringPaths : paths
          const newArr = action==="add" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          await updatePaths(newArr);
     }
     const updateState = (overrides: Partial<IDangerZoneState>) => setDangerZoneState(prev=>({...prev,...overrides}));
     const visibleOptions = useMemo(()=>{
          const options = ObjectEntries(SCAN_SETTINGS).filter(([_,option])=>option.group==="advanced");
          return scanProfile === "file" ? options.filter(([k])=>FILE_SCAN_WHITELIST.includes(k as ScanOptionKeys)) : options;
     },[scanProfile])
     const handleDangerZoneAction = (type: ActionType) => {
          if (isPending) return;
          updateState({
               isOpenDelete: false,
               isOpenRestore: false
          });
          startTransition(async()=>{
               try {
                    if(type==="restore"){
                         await store.reset();
                    } else {
                         await store.clear();
                    }
                    setSettings(DEFAULT_SETTINGS);
                    toast.success(messageTxt(`${type}-settings.success`));
               } catch(err){
                    toast.error(messageTxt(`${type}-settings.error`,{
                         description: String(err)
                    }));
               }
          })
     }
     const {t: scanTxt} = useTranslation("scan-settings")
     const {t} = useTranslation("settings")
     return (
          <>
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Braces}
                    title={t("advanced.title")}
                    className="space-y-4"
                    description={t("advanced.desc")}
               >
                    <SettingsOption
                         title={t("advanced.dev-mode.title")}
                         description={t("advanced.dev-mode.desc")}
                    >
                         <Switch
                              defaultChecked={settings.developerMode || DEFAULT_SETTINGS.developerMode}
                              checked={settings.developerMode}
                              onCheckedChange={checked=>setSettings({developerMode: checked})}
                         />
                    </SettingsOption>
                    <SettingsOption
                         title={t("advanced.real-time-scan.title")}
                         description={t("advanced.real-time-scan.desc")}
                    >
                         <RealTimeToggle/>
                    </SettingsOption>
                    <SettingsOption
                         title={t("advanced.behavior.title")}
                         description={t("advanced.behavior.desc")}
                    >
                         <Select
                              defaultValue={settings.behavior || DEFAULT_SETTINGS.behavior}
                              value={settings.behavior}
                              onValueChange={value=>setSettings({behavior: value as BehaviorMode})}
                         >
                              <SelectTrigger>
                                   <SelectValue placeholder={t("advanced.behavior.title")}/>
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="balanced">
                                        <Scale/>
                                        {t("advanced.behavior.choices.balanced")}
                                   </SelectItem>
                                   <SelectItem value="safe">
                                        <ShieldCheck/>
                                        {t("advanced.behavior.choices.safe")}
                                   </SelectItem>
                                   <SelectItem value="strict">
                                        <ShieldAlert/>
                                        {t("advanced.behavior.choices.strict")}
                                   </SelectItem>
                                   <SelectItem value="expert">
                                        <FlaskConical/>
                                        {t("advanced.behavior.choices.expert")}
                                   </SelectItem>
                              </SelectContent>
                         </Select>
                    </SettingsOption>
               </SettingsItem>
               <SettingsItem
                    Icon={ScrollText}
                    title={t("logs.title")}
                    className="space-y-4"
               >
                    <SettingsOption
                         title={t("logs.auto-scroll.title")}
                         description={t("logs.auto-scroll.desc")}
                    >
                         <Switch
                              defaultChecked={settings.autoScrollText || DEFAULT_SETTINGS.autoScrollText}
                              checked={settings.autoScrollText}
                              onCheckedChange={autoScrollText=>setSettings({autoScrollText})}
                         />
                    </SettingsOption>
                    <SettingsOption
                         title={t("logs.max-lines.title")}
                         description={t("logs.max-lines.desc")}
                    >
                         <Select
                              defaultValue={String(settings.maxLogLines || DEFAULT_SETTINGS.maxLogLines)}
                              onValueChange={lines=>setSettings({maxLogLines: parseInt(lines)})}
                         >
                              <SelectTrigger>
                                   <SelectValue placeholder={t("logs.max-lines.placeholder")}/>
                              </SelectTrigger>
                              <SelectContent>
                                   {MAX_LONG_LINES_CHOICES.map(choice=>(
                                        <SelectItem key={choice} value={choice.toString()}>
                                             {t("logs.max-lines.lines",{
                                                  lines: choice
                                             })}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </SettingsOption>
               </SettingsItem>
               <SettingsItem
                    Icon={SCAN_OPTION_ICON.advanced}
                    title={scanTxt("option-group.advanced")}
                    className="space-y-4"
                    description={t("scan.advanced-desc")}
               >
                    {visibleOptions.map(([key,option])=>{
                         return (
                              <SettingsOption
                                   key={key}
                                   title={scanTxt(`labels.${key}`)}
                                   description={option.flag}
                                   tooltip={isDescKey(key) ? scanTxt(`descriptions.${key}`) : undefined}
                              >
                                   {option.value.kind==="yes-no" ? (
                                        isLoading ? (
                                             <Skeleton className="w-8 h-[18px]"/>
                                        ): (
                                             <Switch
                                                  checked={(values[key] ?? option.value.default) as boolean}
                                                  onCheckedChange={checked => setValue(key, checked)}
                                             />
                                        )
                                   ) : option.value.kind==="choice" ? (
                                        isLoading ? (
                                             <Skeleton className="h-9 w-32"/>
                                        ) : (
                                             <ChoiceOption
                                                  value={String(values[key] ?? option.value.default)}
                                                  onValueChange={val=>setValue(key, typeof option.value.default === "number" ? Number(val) : val)}
                                                  label={scanTxt(`labels.${key}`)}
                                                  scanTxt={scanTxt}
                                                  choiceKey={key==="structuredSSNFormat" ? "ssn-formats" : "sym-links"}
                                             />
                                        )
                                   ) : isLoading ? (
                                        <Skeleton className="w-1/3 h-9"/>
                                   ) : (
                                        <Input
                                             type={option.value.inputType==="number" ? "number" : "text"}
                                             min={option.value.min}
                                             max={option.value.max}
                                             className="max-w-1/3"
                                             value={(values[key] ?? option.value.default ?? "") as number}
                                             onChange={e =>setValue(key, Number(e.target.value))}
                                        />
                                   )}
                              </SettingsOption>
                         )}
                    )}
               </SettingsItem>
               {isFetching ? (
                    <FolderPathFormLoader items={paths.length}/>
               ) : (
                    <FolderPathForm
                         title={t("realtime-paths.title")}
                         description={t("realtime-paths.desc")}
                         addButtonText={t("realtime-paths.add-button")}
                         emptyText={t("realtime-paths.no-paths")}
                         formTitle={t("realtime-paths.form-title")}
                         confirmationTitle={t("realtime-paths.confirmation")}
                         data={monitoringPaths}
                         onSubmit={values=>handlePathAction(values.path,"add")}
                         onDelete={path=>handlePathAction(path,"remove")}
                    />
               )}
               <SettingsItem
                    Icon={Trash2}
                    title={t("danger-zone.title")}
                    description={t("danger-zone.desc")}
                    type="danger"
                    className="space-y-4"
               >
                    <SettingsOption
                         title={t("danger-zone.delete.title")}
                         description={t("danger-zone.delete.desc")}
                    >
                         <LoadingButton
                              isLoading={isPending}
                              loaderText={t("danger-zone.pending")}
                              variant="destructive"
                              onClick={()=>updateState({isOpenDelete: true})}
                         >
                              <Trash2/>
                              {t("danger-zone.delete.button")}
                         </LoadingButton>
                    </SettingsOption>
                    <SettingsOption
                         title={t("danger-zone.restore.title")}
                         description={t("danger-zone.restore.desc")}
                    >
                         <LoadingButton
                              isLoading={isPending}
                              loaderText={t("danger-zone.pending")}
                              variant="destructive"
                              onClick={()=>updateState({isOpenRestore: true})}
                         >
                              <RotateCcw/>
                              {t("danger-zone.restore.button")}
                         </LoadingButton>
                    </SettingsOption>
               </SettingsItem>
          </div>
          <Popup
               open={dangerZoneState.isOpenDelete}
               onOpen={isOpenDelete=>updateState({isOpenDelete})}
               title={t("danger-zone.delete.confirmation")}
               description={t("danger-zone.continue")}
               closeText={t("danger-zone.cancel")}
               submitTxt={t("danger-zone.delete.button")}
               submitEvent={()=>handleDangerZoneAction("delete")}
               type="danger"
          />
          <Popup
               open={dangerZoneState.isOpenRestore}
               onOpen={isOpenRestore=>updateState({isOpenRestore})}
               title={t("danger-zone.restore.confirmation")}
               description={t("danger-zone.continue")}
               closeText={t("danger-zone.cancel")}
               submitTxt={t("danger-zone.restore.button")}
               submitEvent={()=>handleDangerZoneAction("restore")}
          />
          </>
     )
}