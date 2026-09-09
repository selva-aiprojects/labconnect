export type DeviceType = 'analyzer' | 'centrifuge' | 'balance' | 'printer' | 'scanner';
export type DeviceProtocol = 'ASTM' | 'HL7' | 'FHIR' | 'RS-232' | 'TCP/IP' | 'USB';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';

export interface LabDevice {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  deviceType: DeviceType;
  department: string;
  protocol: DeviceProtocol;
  endpoint: string;
  serialNumber: string;
  firmwareVersion: string;
  status: DeviceStatus;
  enabled: boolean;
  load: number;
  reagentLevel: number;
  lastSeenAt: string;
  activeSampleBarcode?: string;
}

export const MASTER_DEVICE_REGISTRY: LabDevice[] = [
  {
    id: 'DEV-XL200', name: 'Cybe XL-200', manufacturer: 'Cybe Diagnostics', model: 'XL-200', deviceType: 'analyzer', department: 'Clinical Chemistry', protocol: 'ASTM', endpoint: 'COM1 / 9600-8-N-1', serialNumber: 'CYBE-XL200-4421', firmwareVersion: 'v4.18', status: 'online', enabled: true, load: 68, reagentLevel: 91, lastSeenAt: '12 seconds ago', activeSampleBarcode: 'BAR-99014'
  },
  {
    id: 'DEV-XL640', name: 'Cybe XL-640', manufacturer: 'Cybe Diagnostics', model: 'XL-640', deviceType: 'analyzer', department: 'Clinical Chemistry', protocol: 'TCP/IP', endpoint: '10.20.4.21:5100', serialNumber: 'CYBE-XL640-9921', firmwareVersion: 'v4.18', status: 'online', enabled: true, load: 84, reagentLevel: 72, lastSeenAt: '2 seconds ago', activeSampleBarcode: 'BAR-99014'
  },
  {
    id: 'DEV-H560', name: 'Cybe H-560', manufacturer: 'Cybe Diagnostics', model: 'H-560', deviceType: 'analyzer', department: 'Hematology', protocol: 'HL7', endpoint: '10.20.4.22:5100', serialNumber: 'CYBE-H560-7720', firmwareVersion: 'v3.06', status: 'online', enabled: true, load: 42, reagentLevel: 88, lastSeenAt: '14 seconds ago', activeSampleBarcode: 'BAR-44919'
  },
  {
    id: 'DEV-ECL760', name: 'Cybe ECL-760', manufacturer: 'Cybe Diagnostics', model: 'ECL-760', deviceType: 'analyzer', department: 'Coagulation', protocol: 'RS-232', endpoint: 'COM2 / 19200-8-N-1', serialNumber: 'CYBE-ECL760-1108', firmwareVersion: 'v2.12', status: 'maintenance', enabled: false, load: 0, reagentLevel: 45, lastSeenAt: '3 hours ago'
  },
  {
    id: 'DEV-CEN03', name: 'High-Speed Centrifuge', manufacturer: 'Cybe Diagnostics', model: 'CEN-03', deviceType: 'centrifuge', department: 'Pre-Analytics', protocol: 'USB', endpoint: 'USB-CEN-03', serialNumber: 'CYBE-CEN03-2204', firmwareVersion: 'v1.9', status: 'online', enabled: true, load: 35, reagentLevel: 100, lastSeenAt: '22 seconds ago'
  }
];

export function getEnabledDevices(devices: LabDevice[]): LabDevice[] {
  return devices.filter(device => device.enabled && device.status === 'online');
}
