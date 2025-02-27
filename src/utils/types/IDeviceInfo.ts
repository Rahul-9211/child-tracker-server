
// Device creation interface
export interface CreateDeviceInput {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    osVersion: string;
    manufacturer: string;
    lastConnected: Date;
    status: 'active' | 'inactive';
    childId: string;
    batteryLevel: number;
    installedApps?: {
      appName: string;
      packageName: string;
      isRestricted: boolean;
    }[];
    settings: {
      screenTimeLimit: number;
      geofenceRadius: number;
      allowedApps: string[];
      blockedWebsites: string[];
    };
  }


  // example ----->>>>>>
//   {
//     "deviceId": "abcdef123458",
//     "deviceName": "Child's Tablet",
//     "deviceType": "Tablet",
//     "osVersion": "iOS 16",
//     "manufacturer": "Apple",
//     "lastConnected": "2024-12-14T12:30:00Z",
//     "status": "inactive",
//     "childId": "child_001",
//     "batteryLevel": 85,
   
//     "settings": {
//       "screenTimeLimit": 120,
//       "geofenceRadius": 100,
//       "allowedApps": [
//         "Educational Games",
//         "Reading Apps"
//       ],
//       "blockedWebsites": [
//         "example.com",
//         "socialmedia.com"
//       ]
//     }
//   }
  