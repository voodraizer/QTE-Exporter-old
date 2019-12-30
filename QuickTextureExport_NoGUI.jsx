// ----------------------------------------------------------------------------------------------------------
//
//		Q.T.E.  v.2.0
//
// ----------------------------------------------------------------------------------------------------------

#target photoshop

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/TgaSaver_NoGUI/Menu=Q.T.E. Exporter NoGUI</name>
<about>$$$/JavaScripts/TgaSaver_NoGUI/About=Q.T.E. ^rExport PSD file to TGA files ^rwith options^r2011-2020</about>
<category>Q.T.E. Exporter</category>
<enableinfo>true</enableinfo>
<eventid></eventid>
<terminology></terminology>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/


// -- evaluate include file.
var exporterFilename = new File($.fileName);
var exporterFilepath = exporterFilename.parent;
$.evalFile(exporterFilepath + "/~Include.jsx");

// Read configs.
exporterSettings.ReadXmlExporterConfigs();
exporterSettings.GetExporterXMPPreset(app.activeDocument);
//exporterSettings.DumpExportSettingsObject();

// Export.
ExportFiles();