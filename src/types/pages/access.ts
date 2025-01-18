import { ISelectOption } from '../components/common';

export interface IAccessResult {
  AccessNo: number; // Primary Key
  AccessType: number; // 2: Door, 7: Relay, 12: Lockset, 13: Facegate, 17: ContLock
  DeviceSelect: number; // 0: Individual, 1: Group
  AccessName: string;
  AccessDesc: string;
}

export interface IAccessFilters {
  AccessNo: string;
  AccessName: string;
  Partition: ISelectOption | null;
  DeviceType: ISelectOption | null;
  Apply: boolean;
}

export interface IApiQueryParamsBase {
  offset: number;
  limit: number;
  sort_by: string;
  order: 'asc' | 'desc';
}
export interface IAccessApiQueryParams extends IApiQueryParamsBase {
  AccessNo_icontains?: string;
  AccessName_icontains?: string;
  PartitionNo?: string;
  AccessType?: string;
}

export interface IAccessFormData {
  Partition: ISelectOption | null;
  AccessName: string;
  AccessDesc: string;
  Schedule: ISelectOption | null;
  DeviceType: ISelectOption | null;
  DeviceSelect: ISelectOption | null;
  DeviceIds: string[];
  GroupIds: string[];
}

export interface IAccessDeviceTypes {
  Door: '2';
  Relay: '7';
  Lockset: '12';
  Facegate: '13';
  ContLock: '17';
  Intercom: '18';
}

export const accessDeviceTypes: { value: string; label: string }[] = [
  { value: '2', label: 'Door' },
  { value: '7', label: 'Relay' },
  { value: '12', label: 'Lockset' },
  { value: '13', label: 'Facegate' },
  { value: '17', label: 'ContLock' },
  { value: '18', label: 'Intercom' },
];
