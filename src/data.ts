import { csvParse } from "d3";
const path = require("path");
const remote = window.require("electron").remote;
let resources_path = remote.app.getAppPath();

if (!remote.require("electron-is-dev"))
  resources_path = path.join(resources_path, "..");

const DIR = path.join(resources_path, "python", "data/");
const fs = window.require("electron").remote.require("fs");

export interface DataSet {
  title: string;
  csv: string;
  data: ReturnType<typeof csvParse>;
}

/** Loads all CSV files in the data directory as Data objects */
export function loadDefaultDataSets(): Promise<DataSet[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(DIR, (err, files) => {
      if (err) throw err;
      // Load all the data files
      Promise.all(
        files
          .filter((file) => file.endsWith("csv"))
          .sort()
          .map(
            async (fileName: string) =>
              new Promise((resolve, reject) => {
                fs.readFile(DIR + fileName, "utf8", (err, csvData) => {
                  if (err) return reject(err);
                  return resolve({
                    title: fileName.slice(0, -4),
                    csv: csvData,
                    frames: [{scatter: csvParse(csvData)}],
                  });
                });
              })
          )
      )
        .then((res) => resolve(res as any))
        .catch((err) => reject(err));
    });
  });
}
