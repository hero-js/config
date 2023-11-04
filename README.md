# @hero-js/config

`@hero-js/config` is a flexible and easy-to-use configuration management library for Node.js applications. It allows you to manage your application's configuration settings, including environment variables, with ease.

## Installation

You can install this module using npm:

```bash
npm install @hero-js/config
# or
yarn add @hero-js/config
```

## Usage

Here's how you can use this module in your Node.js application:

```javascript
const Config = require('@hero-js/config').default;

// Initialize the Config instance with optional options
const config = new Config();

// Set configuration values (not recommended)
config.set('API_KEY', 'your-api-key');

// Retrieve configuration values with type safety
const apiKey = config.get('API_KEY', { defaultValue: 'default-key' });

console.log('API Key:', apiKey); // Output: API Key: your-api-key
```

## Features

- **Environment Variable Parsing:** Automatically parses environment variables using [dotenv](https://www.npmjs.com/package/dotenv) to load your configuration.

- **Type-Safe Retrieval:** Retrieve configuration values with type safety, ensuring that you get the expected data type.

- **Default Values:** Provide default values for configuration options, simplifying the handling of missing or undefined values.

- **Type Conversion:** Automatically convert values to different types, such as integers and booleans.

- **Error Handling:** Proper error handling and customizable error messages for invalid or missing values.

## Configuration File

`@hero-js/config` uses the `.env` file in your project's root directory by default. You can customize the configuration file path and name during initialization:

```javascript
const Config = require('@hero-js/config').default;

// Specify a custom path and filename
const config = new Config({
  envFilePath: '/path/to/config',
  envFileName: 'my-env-file.env',
});
```

## License

This module is licensed under the MIT License. See the [LICENSE](https://github.com/hero-js/config/blob/main/LICENSE) file for details.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow the guidelines in [CONTRIBUTING](https://github.com/hero-js/hero/blob/main/CONTRIBUTING.md).

## Changelog

For a history of changes to this module, see the [CHANGELOG](https://github.com/hero-js/config/blob/main/CHANGELOG.md) file.

## Support

If you have any questions or encounter issues, please open a GitHub issue.
