
// Interface for signup request body
export interface SignupRequestBody {
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin' | 'super_admin';
    deviceId: string;
    superAdminKey?: string; // Optional key for super admin signup
  }

//   example ----->>>>>>
// {
//     "name" : "rahul", 
//     "email" : "rahul.rawat.fec2@gmail.com",
//     "password" : "rahul",
//     "role" : "super_admin",
//     "deviceId" : "",
//     "superAdminKey":"your-secret-access-code-123"
// }