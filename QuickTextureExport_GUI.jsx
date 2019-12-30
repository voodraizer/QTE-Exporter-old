// ----------------------------------------------------------------------------------------------------------
//
//		Q.T.E.  v.2.0
//
// ----------------------------------------------------------------------------------------------------------


#target photoshop

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/TgaSaver_GUI/Menu=Q.T.E. Exporter GUI...</name>
<about>$$$/JavaScripts/TgaSaver_GUI/About=Q.T.E. ^rExport PSD file to TGA files ^rwith options^r2011-2020</about>
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
$.evalFile(exporterFilepath + "/~gui_gen_callbacks.jsx");


//$.writeln("============= START");
GUI_main( );