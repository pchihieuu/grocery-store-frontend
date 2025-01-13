// module.exports = function (api) {
//   api.cache(true);

//   return {
//     presets: [
//       [
//         "babel-preset-expo",
//         {
//           jsxImportSource: "nativewind",
//         },
//       ],
//       "nativewind/babel",
//     ],

//     plugins: [
//       [
//         "module-resolver",
//         {
//           root: ["./"],
//           alias: {
//             "@": "./",
//             "tailwind.config": "./tailwind.config.js",
//           },
//         },
//       ],
//       "react-native-reanimated/plugin",
//     ],
//   };
// };

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
