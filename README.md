<!-- # GROCERY STORE FRONT-END

## Description

The Boolfly Grocery Store Demo is a modern mobile application designed to showcase the integration of Magento 2’s GraphQL API and Node.js microservices in an eCommerce environment. Developed as a training tool for internship students, this project focuses on demonstrating core concepts of mobile app development, API integration, and scalable architecture in the context of a real-world eCommerce solution.

## Prerequisite

Before you begin installing and running the project, ensure you have the following prerequisites:
a. **Node.js**
 Ensure you have **Node.js** installed on your machine. You can download it from the [official website](https://nodejs.org/). It is recommended to use the LTS (Long Term Support) version.
You can verify the installation by running:

```bash
node -v
```

b. **npm (Node Package Manager)**
 npm is installed automatically with Node.js. You can verify the installation by running:

```bash
npm -v
```

## Setup Base Project

Installing NodeJS

> https://nodejs.org/en

Installing React Native Tooling

> `npm install -g react-native-app`

> create-react-app <<project-name>>

> Waiting for a couple of times ...

## Cloning this project

```bash
git clone https://github.com/quy1003/grocery_store_fe.git
```

```bash
cd grocery_store_fe
```

```bash
npm i
```

```bash
npm start
```

Scan the QR code if using Expo Go or using the virtual machine offered by Android Studio -->

# Boolfly Grocery Store Demo Mobile App

A modern mobile application built with React Native, showcasing integration with Magento 2's GraphQL API and Node.js microservices. This demo app provides a seamless shopping experience for browsing and purchasing grocery items.

## Features

- Dynamic product browsing with category filtering
- Real-time product search powered by Node.js microservice
- User authentication with social login options
- Shopping cart management
- Secure checkout process
- Responsive and intuitive UI design

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

For iOS development:

- macOS
- Xcode (latest version)
- CocoaPods

For Android development:

- Android Studio
- Android SDK
- Java Development Kit (JDK)

## Installation Options

### Option 1: Using Expo Go (Recommended for Quick Start)

1. Install Expo CLI globally:

```bash
npm install -g expo-cli
```

2. Clone the repository:

```bash
git clone https://github.com/quy1003/grocery_store_fe.git
cd grocery_store_fe
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the Expo development server:

```bash
expo start
```

5. Install Expo Go on your mobile device:

- [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)

6. Scan the QR code from your terminal using:

- iOS: Camera app
- Android: Expo Go app

### Option 2: Using Android Studio Emulator

1. Install Android Studio and set up an Android Virtual Device (AVD)

2. Configure environment variables:

```bash
# Add these to your ~/.bash_profile or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

3. Start the Android emulator from Android Studio

4. Run the app:

```bash
npm run android
# or
yarn android
```

### Option 3: Using iOS Simulator (macOS only)

1. Install Xcode from the Mac App Store

2. Install CocoaPods:

```bash
sudo gem install cocoapods
```

3. Install iOS dependencies:

```bash
cd ios
pod install
cd ..
```

4. Run the app:

```bash
npm run ios
# or
yarn ios
```

## Project Structure

```

quy1003-grocery_store_fe/
├── src/
│ ├── Query/ # GraphQL queries
│ │ ├── cart.js
│ │ ├── category.js
│ │ ├── current-user.js
│ │ ├── favorite.js
│ │ ├── product.js
│ │ ├── sign-in.js
│ │ └── sign-up.js
│ ├── assets/ # Media files and assets
│ ├── components/ # React components
│ │ ├── BaseScreen.js
│ │ ├── MyTabs.js
│ │ ├── Login/ # Login related components
│ │ ├── Product/ # Product related components
│ │ ├── Screens/ # Main screen components
│ │ ├── Search/ # Search functionality
│ │ └── ui/ # Reusable UI components
│ ├── configs/ # Configuration files
│ │ └── apolloClient.js
│ ├── mutuals/ # Shared components
│ ├── reducers/ # State management
│ └── styles/ # Styling files
├── components/ # UI component library
│ └── ui/ # Base UI components
├── android/ # Android specific files
├── ios/ # iOS specific files
├── .github/ # GitHub configuration
├── .husky/ # Git hooks
└── Various config files:
├── app.json
├── babel.config.js
├── global.css
├── gluestack-ui.config.json
├── tailwind.config.js
├── tsconfig.json
├── .env.example
└── package.json

```

### Key Directories

- `/src`: Main application source code

  - `/Query`: GraphQL query definitions
  - `/components`: React components organized by feature
  - `/styles`: Styling files for different screens
  - `/configs`: Configuration files including Apollo Client setup
  - `/reducers`: State management logic
  - `/mutuals`: Shared components like modals and notifications

- `/components/ui`: Core UI component library

  - Built with TypeScript
  - Includes basic components like Box, Button, Card, Input, etc.
  - Web-specific implementations available

- `/android` & `/ios`: Native platform specific code and configurations

### Configuration Files

- `gluestack-ui.config.json`: UI library configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `.env.example`: Environment variables template
- `babel.config.js`: Babel configuration for React Native

The project uses a combination of TypeScript and JavaScript, with TypeScript primarily used in the UI component library and JavaScript in the main application code.

## Available Scripts

- `npm start` or `yarn start`: Start the Metro bundler
- `npm run android` or `yarn android`: Run on Android emulator
- `npm run ios` or `yarn ios`: Run on iOS simulator
- `npm test` or `yarn test`: Run tests
- `npm run lint` or `yarn lint`: Run linter

## Troubleshooting

### Common Issues

1. Metro bundler not starting:

```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

2. iOS build fails:

```bash
cd ios
pod install
cd ..
```

3. Android build fails:

```bash
cd android
./gradlew clean
cd ..
```

### Development Notes

- Ensure your Magento 2 GraphQL API endpoint is correctly configured in the `.env` file
- For social login features, configure your OAuth credentials in the appropriate configuration files
- The Node.js search microservice should be running for the search functionality to work

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
