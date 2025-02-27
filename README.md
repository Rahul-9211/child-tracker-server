# Child Tracker Server

A robust backend server for the Child Tracker application system, providing secure APIs for device monitoring and parental control features.

## 🚀 Features

### Device Management
- 📱 Device Information Tracking
- 📍 Real-time GPS Location Monitoring
- 📱 Installed Applications List
- 🏃‍♂️ Running Applications Tracker
- 🔋 Battery Status Monitoring

### Communication Monitoring
- 📞 Call Logs Tracking
- 📱 SMS Reader
- 🔔 Notification Monitor
- 📱 App Usage Statistics

### User Management
- 👥 Multi-level User Access (Super Admin, Admin, User)
- 🔐 Secure Authentication System
- 📱 Multiple Device Management
- 📊 Activity Logging

## 🛠 Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Security**: bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## ⚙️ Installation

1. Clone the repository: 



I'll create a comprehensive README.md file for your child tracker server project:

```markdown:README.md
# Child Tracker Server

A robust backend server for the Child Tracker application system, providing secure APIs for device monitoring and parental control features.

## 🚀 Features

### Device Management
- 📱 Device Information Tracking
- 📍 Real-time GPS Location Monitoring
- 📱 Installed Applications List
- 🏃‍♂️ Running Applications Tracker
- 🔋 Battery Status Monitoring

### Communication Monitoring
- 📞 Call Logs Tracking
- 📱 SMS Reader
- 🔔 Notification Monitor
- 📱 App Usage Statistics

### User Management
- 👥 Multi-level User Access (Super Admin, Admin, User)
- 🔐 Secure Authentication System
- 📱 Multiple Device Management
- 📊 Activity Logging

## 🛠 Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Security**: bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/child-tracker-server.git
cd child-tracker-server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
PORT=3001
MONGODB_URI=your_mongodb_uri
username=user_name
password=user_password
JWT_SECRET=your_jwt_secret
SUPER_ADMIN_ACCESS_CODE=your_access_code
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/signup - Register new user
POST /api/auth/signin - User login
POST /api/auth/add-device - Add device to user
```

### Device Management
```
GET /api/devices - Get all devices
GET /api/devices/:id - Get specific device
POST /api/devices - Register new device
PUT /api/devices/:id - Update device info
DELETE /api/devices/:id - Remove device
```

### Location Tracking
```
GET /api/location/:deviceId - Get device location
POST /api/location - Update device location
```

### App Monitoring
```
GET /api/apps/:deviceId - Get installed apps
GET /api/apps/:deviceId/running - Get running apps
```

### Communication Logs
```
GET /api/communications/:deviceId/calls - Get call logs
GET /api/communications/:deviceId/sms - Get SMS logs
GET /api/communications/:deviceId/notifications - Get notifications
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- Role-based access control
- API rate limiting
- Request validation
- Activity logging

## 📱 Mobile App Integration

This server is designed to work with the Child Tracker Android app, which collects and sends the following data:
- Device information
- GPS location
- SMS and call logs
- App usage statistics
- System notifications
- Running applications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is intended for legal guardian monitoring only. Please ensure compliance with local laws and regulations regarding device monitoring and data collection.

## 📞 Support

For support, email support@childtracker.com or create an issue in the repository.
```

This README provides:
1. Clear feature overview
2. Technical details
3. Setup instructions
4. API documentation
5. Security information
6. Integration details
7. Contribution guidelines
8. Legal disclaimers

Would you like me to expand on any section or add more specific details about certain features?
