## Project Structure

This project is organized as a monorepo using Yarn workspaces:

```
.
├── apps/
│   ├── expo-client/    # React Native Expo client application
│   └── server/         # Node.js backend server
└── packages/
    └── types/          # Shared TypeScript types
```

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Generate shared types:
```bash
yarn build:types
```

## Running the Applications

### Client (Expo)
To start the Expo client:
```bash
yarn client start
```
This will start the Expo development server. You can then:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with your phone to open in Expo Go

### Server
To start the backend server:
```bash
yarn dev
```

If you want to use mock data instead of real API calls, set the `MOCK` environment variable:
```bash
MOCK=true
```
This will use mock handlers from `src/mock` directory. Make sure to update the mock handlers in `mockHandler.ts` with the appropriate logic for the use case.