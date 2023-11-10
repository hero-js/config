import * as fs from 'fs';
import * as path from 'path';
import { IGetconfigData, IInvalid } from './types';
import * as dotenv from 'dotenv';

/**
 * A class for managing a config of data within an application.
 * @class
 */
export default class Config {
  private readonly config: Record<string, any>;

  constructor({
    envFilePath,
    envFileName,
  }: { envFilePath?: string; envFileName?: string } = {}) {
    envFilePath = envFilePath || this.findEnvFile(envFileName);
    dotenv.config({ path: envFilePath });
    this.config = process.env;
  }

  private findEnvFile(envFileName?: string): string {
    const rootPath = process.cwd();

    const fileMatcher = envFileName || /^\.env(\..+)?$/;

    const files = fs.readdirSync(rootPath);
    const envFile = files.find((file) => file.match(fileMatcher));

    if (envFile) return path.join(rootPath, envFile);

    throw new Error(`No .env file found in "${rootPath}"`);
  }

  private throwError(key: string) {
    throw new Error(`Data with key "${key}" not found in config.`);
  }

  private throwInvalidValueError(key: string) {
    throw new Error(
      `Invalid value was found for the key "${key}" in the config.`
    );
  }

  private testInvalidValue(
    value: any,
    invalidValues: IInvalid['invalidValues'] = []
  ) {
    return invalidValues.includes(value);
  }

  /**
   * Set a value for a specific key in the config.
   * @param {string} key - The key associated with the value.
   * @param {string | number} value - The value to set.
   */
  public set(key: string, value: string | number): void {
    process.env[key] = String(value);
    this.config[key] = value;
  }

  /**
   * Get a value associated with a specific key in the config.
   * @template T - The expected type of the value.
   * @param {string} key - The key associated with the value.
   * @param {IGetConfigData<T>} [options] - Options for data retrieval.
   * @returns {T|undefined} - The retrieved value, or the default value if specified, or `false` if invalid.
   */
  public get<T>(key: string, options: IGetconfigData<T> = {}): T | undefined {
    const { defaultValue, invalidValues = [], orInvalidValues = [] } = options;
    const value: T = this.config[key];

    let test = this.testInvalidValue(value, orInvalidValues);

    if (test) return defaultValue;

    if (invalidValues.length === 0) return value ?? defaultValue;

    test = this.testInvalidValue(value, invalidValues);

    return test ? defaultValue : value;
  }

  /**
   * Get a value associated with a specific key in the config or throw an error if not found.
   * @template T - The expected type of the value.
   * @param {string} key - The key associated with the value.
   * @param {IInvalid} [options] - Options for data retrieval, including invalid values.
   * @returns {T} - The retrieved value.
   * @throws {Error} - If the value is not found in the config.
   */
  getOrThrow<T = any>(key: string, options: IInvalid = {}): T {
    const {
      orInvalidValues = [],
      invalidValues = [],
      throwOnInvalidValue = true,
    } = options;
    const value = this.get<T>(key, options);

    if (value === undefined) throw this.throwError(key);

    const test = this.testInvalidValue(
      value,
      invalidValues.concat(orInvalidValues)
    );

    if (test && throwOnInvalidValue) throw this.throwInvalidValueError(key);
    return value;
  }

  /**
   * Get an integer value associated with a specific key in the config.
   * @param {string} key - The key associated with the value.
   * @param {IGetConfigData<number>} [options] - Options for data retrieval, including invalid values.
   * @returns {number|undefined} - The retrieved integer value, or `undefined` if not found.
   */
  getInt(
    key: string,
    options: IGetconfigData<number> = { orInvalidValues: [NaN] }
  ): number | undefined {
    const value = this.get(key, options);

    if (!value) return value;

    return parseInt(String(value), 10);
  }

  /**
   * Get an integer value associated with a specific key in the config or throw an error if not found.
   * @param {string} key - The key associated with the value.
   * @param {IInvalid} [options] - Options for data retrieval, including invalid values.
   * @returns {number} - The retrieved integer value.
   * @throws {Error} - If the value is not found in the config.
   */
  getIntOrThrow(key: string, options: IInvalid = {}): number {
    const {
      orInvalidValues = [NaN],
      invalidValues = [],
      throwOnInvalidValue = true,
    } = options;
    const value = this.getInt(key, options);

    if (value === undefined) throw this.throwError(key);

    const test = this.testInvalidValue(
      value,
      invalidValues.concat(orInvalidValues)
    );

    if (test && throwOnInvalidValue) throw this.throwInvalidValueError(key);
    return value;
  }

  /**
   * Get a boolean value associated with a specific key in the config.
   * @param {string} key - The key associated with the value.
   * @param {IGetConfigData<boolean>} [options] - Options for data retrieval, including invalid values.
   * @returns {boolean|undefined} - The retrieved boolean value, or `undefined` if not found.
   */
  getBoolean(
    key: string,
    options: IGetconfigData<boolean> & { strict?: boolean } = {}
  ): boolean | undefined {
    const { strict = false } = options;
    const value = this.get(key, options);

    if (value === undefined || value === null) return undefined;

    if (strict) return ['1', 'true'].includes(String(value).toLowerCase());

    return ['0', 'false'].includes(String(value).toLowerCase())
      ? false
      : Boolean(value);
  }

  /**
   * Get a boolean value associated with a specific key in the config or throw an error if not found.
   * @param {string} key - The key associated with the value.
   * @param {IInvalid} [options] - Options for data retrieval, including invalid values.
   * @returns {boolean} - The retrieved boolean value.
   * @throws {Error} - If the value is not found in the config.
   */
  getBooleanOrThrow(key: string, options: IInvalid = {}): boolean {
    const {
      orInvalidValues = [],
      invalidValues = [],
      throwOnInvalidValue = true,
    } = options;
    const value = this.getBoolean(key, options);

    if (value === undefined) throw this.throwError(key);

    const test = this.testInvalidValue(
      value,
      invalidValues.concat(orInvalidValues)
    );

    if (test && throwOnInvalidValue) throw this.throwInvalidValueError(key);
    return value;
  }
}
