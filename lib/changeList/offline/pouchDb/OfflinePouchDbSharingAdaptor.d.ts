/**
 * Created by Papa on 5/28/2016.
 */
import { SharingAdaptor, SharedChangeList } from "delta-store";
import { OfflinePouchDbSetupInfo, OfflinePouchDbChangeListShareInfo } from "./OfflinePouchDbSharingModel";
export declare class OfflinePouchDbSharingAdaptor implements SharingAdaptor {
    initialize(setupInfo: OfflinePouchDbSetupInfo): Promise<any>;
    findExistingChangeLists(setupInfo: OfflinePouchDbSetupInfo): Promise<OfflinePouchDbChangeListShareInfo[]>;
    createChangeList(name: string, setupInfo: OfflinePouchDbSetupInfo): Promise<SharedChangeList>;
    loadChangeList(shareInfo: OfflinePouchDbChangeListShareInfo): Promise<SharedChangeList>;
    setupInfoBelongsTo(setupInfo: OfflinePouchDbSetupInfo, setupInfos: OfflinePouchDbSetupInfo[]): boolean;
}
