import path from "path";
import fs from "fs";
import { getConfig } from "@librt/config";
import { IKeyValueStorage } from "keyvaluestorage";

export class KeyValueStorage implements IKeyValueStorage {
  data: Record<string, any> = {};

  constructor() {
    this._syncData();
  }

  _getPathname() {
    const config = getConfig();
    const uri = config.storage.uri.replace("$HOME", process.env["HOME"] || "");
    const pathname = path.resolve(uri);
    return pathname;
  }

  _syncData() {
    try {
      const pathname = this._getPathname();
      const data = fs.readFileSync(pathname, "utf-8");
      this.data = JSON.parse(data);
    } catch {
      this.data = {};
    }
  }

  async getKeys(): Promise<string[]> {
    return new Promise((resolve) => {
      const keys = Object.keys(this.data);
      resolve(keys);
    });
  }

  async getEntries<T = any>(): Promise<[string, T][]> {
    return new Promise((resolve) => {
      const entries = Object.entries(this.data);
      resolve(entries);
    });
  }

  async getItem<T = any>(key: string): Promise<T | undefined> {
    return new Promise((resolve) => {
      const item = this.data[key];
      resolve(item);
    });
  }

  async removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._syncData();
        const pathname = this._getPathname();
        delete this.data[key];
        const data = JSON.stringify(this.data, null, "  ");
        fs.writeFileSync(pathname, data);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async setItem<T = any>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._syncData();
        const pathname = this._getPathname();
        this.data[key] = value;
        const data = JSON.stringify(this.data, null, "  ");
        fs.writeFileSync(pathname, data);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
