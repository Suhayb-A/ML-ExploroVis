import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
const path = require("path");
const remote = window.require("electron").remote;
let resources_path = remote.app.getAppPath();

if (!remote.require("electron-is-dev"))
  resources_path = path.join(resources_path, "..");

const fs = window.require("electron").remote.require("fs");
const DIR = path.join(resources_path, "python");

function getMarkdown(path: string, fallback: string) {
  try {
    return fs.readFileSync(`${DIR}/${path}.md`);
  } catch (e) {
    return fs.readFileSync(`${DIR}/${fallback}.md`);
  }
}

function Help({
  active,
  selectedDataSet,
  methodPath,
}: {
  active: boolean;
  selectedDataSet: any;
  methodPath: string;
}) {
  const [dataSetContent, setDataSetContent] = useState('');
  const [methodContent, setMethodContent] = useState('');

  useEffect(() => {
    if (!selectedDataSet || !active) return;
    setDataSetContent(
      getMarkdown(`data/${selectedDataSet.title}`, "data/default")
      );
  }, [selectedDataSet, active]);

  useEffect(() => {
    if (!active) return; // Don't fetch when hidden.
    setMethodContent(getMarkdown(`methods/${methodPath}`, "methods/default"));
  }, [methodPath, active]);

  return (
    <div id="help-menu" className={active ? " active" : ""}>
      <div id="help-menu-content">
        <div id="help-data-set">
          <ReactMarkdown children={dataSetContent} />
        </div>
        <div id="help-content">
          <ReactMarkdown children={methodContent} />
        </div>
      </div>
    </div>
  );
}
export default Help;
