#target photoshop

var exporterFilename = new File($.fileName);
var exporterFilepath = exporterFilename.parent;

$.evalFile(exporterFilepath + "/~Include.jsx");

exporterSettings.ReadXmlExporterConfigs();

exporterSettings.DumpExportSettingsObject();

exporterSettings.WriteXmlExporterConfigs();
//exporterSettings.WriteXmlExporterDefaultConfigs();
