// ----------------------------------------------------------------------------------------------------------
//
//		TGA_saver tool 1.5
//
// ----------------------------------------------------------------------------------------------------------

//#target photoshop

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

// END__HARVEST_EXCEPTION_ZSTRING

*/

// -- exporter version (d - debug).
// If version consist <d> some paths look into sdk folders.
const TGASAVERVERSION = "2.0d";


//$.level = 0;	// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
//debugger; 	// launch debugger on next line

// -- file name delimiter ( example: <texture_name>_#<version>.psd )
var fileNameDelimiter = "_#";

var exporterFilename = new File($.fileName);
var exporterFilepath = exporterFilename.parent;

// exporter settings object.
var exporterSettings= new Object();


// -- check for debug version.
//var isDebug = (ScriptUI.version.search("d") != -1) ? true : false;
var isExporterDebug = (TGASAVERVERSION.search("d") != -1) ? true : false;

// -- swf gui file.
if (isExporterDebug)
{
	// -- debug version.
	//var swfExporter = new File(exporterFilepath + "/sdk/FD_project/bin-release/TgaSaver.swf");
	//var swfHelp = new File(exporterFilepath + "/sdk/FD_project/bin-release/TgaSaver_help.swf");
	//var swfProgress = new File(exporterFilepath + "/sdk/FD_project/bin-release/TgaSaver_progressbar.swf");
}
else
{
	// -- release version.
	//var swfExporter = new File(exporterFilepath + "/swf/TgaSaver.swf");
	//var swfHelp = new File(exporterFilepath + "/swf/TgaSaver_help.swf");
	//var swfProgress = new File(exporterFilepath + "/swf/TgaSaver_progressbar.swf");
}

// -- multiplatform.
var isWin = (File.fs == "Windows");

// ---------------------------------------------------------------------------------------------------------------------
//  Exporter configs,
// ---------------------------------------------------------------------------------------------------------------------

exporterSettings.xmlExporterConfPath = exporterFilepath + "/exporter_conf.xml";
exporterSettings.xmlConf = undefined;
exporterSettings.xmpConf = undefined;

exporterSettings.ReadXmlExporterConfigs = function ()
{
	this.xmlConf = new Object();
	var xml = undefined;
	
	try
	{
		//$.writeln("== READ CONFIGS");
		var config_file = new File(this.xmlExporterConfPath);
		config_file.open('R');
		if (config_file.exists == false)
		{
			// -- create config if not exist
			//return;
		}
		
		var configXML = config_file.read();
		config_file.close();
		
		xml = new XML(configXML);
	}
	catch (e)
	{
		config_file.close();
	}
	
	// Parse slots.
	var slotsArr = new Array();
	
	for(var i = 0; i < xml.slots.children().length(); i++)
	{
		var slotSettings = new Object();

		slotSettings.type = this.ToValue(xml.slots.slot[i].@type);
		slotSettings.selected = this.ToValue(xml.slots.slot[i].@selected);
		slotSettings.suffix = this.ToValue(xml.slots.slot[i].@suffix);
		slotSettings.fill = this.ToRGB(xml.slots.slot[i].@fill);
		slotSettings.allowSharpen = this.ToValue(xml.slots.slot[i].@allowSharpen);
		slotSettings.downscale = this.ToValue(xml.slots.slot[i].@downscale);
		slotSettings.tiffPres = this.ToValue(xml.slots.slot[i].@tiffPres);
		
		var channelsArr = new Array();
		
		for(var ch = 0; ch < xml.slots.slot[i].children().length(); ch++)
		{
			if (xml.slots.slot[i].channel[ch] != undefined)
			{
				var channel = new Object();
				channel.type = this.ToValue(xml.slots.slot[i].channel[ch].@type);
				channel.source = this.ToValue(xml.slots.slot[i].channel[ch].@source);
				channelsArr.push(channel);
			}
		}
		
		slotSettings.channels = channelsArr;
		
		slotsArr.push(slotSettings);
	}

	this.xmlConf.slots = slotsArr;
	
	// Parse options.
	var options = new Object();
	options.outputtype = this.ToValue(xml.options.outputtype.@value);
	options.nonpow2 = this.ToValue(xml.options.nonpow2.@value);
	options.sharpencontrast = this.ToValue(xml.options.sharpencontrast.@value);
	options.disablecrytiff = this.ToValue(xml.options.disablecrytiff.@value);
	options.copytoexportpath = this.ToValue(xml.options.copytoexportpath.@value);
	options.copytolocalpath = this.ToValue(xml.options.copytolocalpath.@value);
	
	this.xmlConf.options = options;
	
	// Parse gui.
	var gui = new Object();
	gui.compactslotsize = this.ToValue(xml.gui.compactslotsize.@value);
	
	this.xmlConf.gui = gui;
	
	//this.DumpExportSettingsObject();
}

exporterSettings.WriteXmlExporterConfigs = function ()
{
	//var saveFile = this.xmlExporterConfPath;
	var saveFile = "c:/Program Files/Adobe/Adobe Photoshop CC 2019/Presets/Scripts/TgaSaver/test.xml";
	var exportData = exporterSettings.xmlConf;
	
	var xml = new XML( "<data> <slots></slots> <options></options> <gui></gui> </data>");
	
	// Write slots.
	for (var i = 0; i < exportData.slots.length; i++)
	{	
		xml.slots.appendChild(<slot></slot>);
		
		var slot = xml.slots.slot[i];
		slot.@type = this.ToString(exportData.slots[i].type);
		slot.@selected = this.ToString(exportData.slots[i].selected);
		slot.@suffix =  this.ToString(exportData.slots[i].suffix);
		slot.@fill = this.ToString(exportData.slots[i].fill);
		slot.@allowSharpen = this.ToString(exportData.slots[i].allowSharpen);
		slot.@downscale = this.ToString(exportData.slots[i].downscale);
		slot.@tiffPres = this.ToString(exportData.slots[i].tiffPres);
		
		for(var k = 0; k < exportData.slots[i].channels.length; k++)
		{
			xml.slots.slot[i].appendChild(<channel></channel>);
			
			var channel = xml.slots.slot[i].channel[k];
			channel.@type = this.ToString(exportData.slots[i].channels[k].type);
			channel.@source = this.ToString(exportData.slots[i].channels[k].source);
			channel.@fill = this.ToString(exportData.slots[i].channels[k].fill);
		}
	}

	// Write options.
	xml.options.outputtype.@value = this.ToString(exportData.options.outputtype);
	xml.options.nonpow2.@value = this.ToString(exportData.options.nonpow2);
	xml.options.sharpencontrast.@value = this.ToString(exportData.options.sharpencontrast);
	xml.options.disablecrytiff.@value = this.ToString(exportData.options.disablecrytiff);
	xml.options.copytoexportpath.@value = this.ToString(exportData.options.copytoexportpath);
	xml.options.copytolocalpath.@value = this.ToString(exportData.options.copytolocalpath);
	
	// Write gui.
	xml.gui.compactslotsize.@value = this.ToString(exportData.gui.compactslotsize);


	var textfile = new File(saveFile);
	textfile.open( "w" );
	textfile.write(xml.toXMLString());
	textfile.close;
}

exporterSettings.DumpExportSettingsObject = function ()
{
	var obj = this.xmlConf;
	
	$.writeln("==============================");
	$.writeln("	DumpExportSettingsObject");
	$.writeln("==============================");
	$.writeln("> slots:");
	$.writeln(" ");
	for (var i = 0; i < obj.slots.length; i++)
	{
			$.writeln("	type: " + obj.slots[i].type);
			$.writeln("	selected: " + obj.slots[i].selected);
			$.writeln("	suffix: " + obj.slots[i].suffix);
			$.writeln("	tiff preset: " + obj.slots[i].tiffPres);
			
			var channels = "";
			for(var k = 0; k < obj.slots[i].channels.length; k++)
			{
				channels += obj.slots[i].channels[k].type;
				channels += " - ";
				channels += obj.slots[i].channels[k].source;
				channels += "; ";
			}
			$.writeln("	channels: " + channels);
			$.writeln("  ---------------------------------------");
	}
	
	$.writeln(" ");
	$.writeln("> options:");
	$.writeln(" ");
	$.writeln("	outputtype: " + obj.options.outputtype);
	$.writeln("	nonpow2: " + obj.options.nonpow2);
	$.writeln("	sharpencontrast: " + obj.options.sharpencontrast);
	$.writeln("	disable crytiff: " + obj.options.disablecrytiff);
	$.writeln("	copytoexportpath: " + obj.options.copytoexportpath);
	$.writeln("	copytolocalpath: " + obj.options.copytolocalpath);
	
	$.writeln(" ");
	$.writeln("> gui:");
	$.writeln(" ");
	$.writeln("	compactslotsize: " + obj.gui.compactslotsize);
	
}

exporterSettings.WriteXmlExporterDefaultConfigs = function ()
{
	//var saveFile = this.xmlExporterConfPath;
	var saveFile = "c:/Program Files/Adobe/Adobe Photoshop CC 2019/Presets/Scripts/TgaSaver/default.xml";
	
	var xml = new XML(
		<data>
		  <slots>
			<slot type="diffuse" selected="true" suffix="_df" fill="128;128;128" allowSharpen="true" downscale="1" tiffPres="">
				<channel type="a" source="alpha" fill=""></channel>
			</slot>
			<slot type="normal" selected="false" suffix="_nm" fill="128;128;255" allowSharpen="false" downscale="2" tiffPres="">
				<channel type="a" source="glossiness" fill=""></channel>
			</slot>
			<slot type="alpha" selected="false" suffix="_alpha" fill="255;255;255" allowSharpen="false" downscale="1" tiffPres="">
			</slot>
			<slot type="mask_RGB" selected="false" suffix="_mask" fill="128;128;128" allowSharpen="true" downscale="1" tiffPres="">
				<channel type="r" source="r" fill=""></channel>
				<channel type="g" source="g" fill=""></channel>
				<channel type="b" source="b" fill=""></channel>
			</slot>
		  </slots>
		  <options>
			<outputtype value="tga"/>
			<nonpow2 value="true"/>
			<sharpencontrast value="false"/>
			<disablecrytiff value="false"/>
			<copytoexportpath value="false"/>
			<copytolocalpath value="true"/>
		  </options>
		  <gui>
			<compactslotsize value="true"/>
			<lastprojectpath path=""/>
		  </gui>
		</data>
	);
	
	var textfile = new File(saveFile);
	textfile.open( "w" );
	textfile.write(xml.toXMLString());
	textfile.close;
}

//~ function LoadXML(filename)
//~ {
//~ 	//$.writeln("load xml");
//~ 	
//~ 	textfile = new File( exporterFilepath + "/" + filename );
//~ 	if (textfile.exists == true)
//~     {
//~ 		textfile.open();
//~ 		// -- read through the text file
//~ 		var xml = "";
//~ 		while ( !textfile.eof )
//~ 		{
//~ 			line = textfile.readln();
//~ 			xml += line;
//~ 		}
//~ 		textfile.close;
//~ 	}
//~ 	
//~ 	return xml;
//~ }


// XMP meta
var qteXMPNamespace = "http://qte.exporter/1.0/";
var qteXMPPrefix = "qtesets:";

if (ExternalObject.AdobeXMPScript == undefined)  ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
XMPMeta.registerNamespace(qteXMPNamespace, qteXMPPrefix);

//  Read xmp configs,
exporterSettings.GetExporterXMPPreset = function (doc)
{
	this.xmpConf = new Object();
	
	var xmp = new XMPMeta( doc.xmpMetadata.rawData );
	
	//$.writeln("Path: " + xmp.getProperty(qteXMPNamespace, "ExportPath", XMPConst.STRING));
	//$.writeln("Type: " + xmp.getProperty(qteXMPNamespace, "OutputType", XMPConst.STRING));
	//$.writeln("DownScale: " + xmp.getProperty(qteXMPNamespace, "DownScale", XMPConst.NUMBER));
	
	this.xmpConf.ExportPath = xmp.getProperty(qteXMPNamespace, "ExportPath", XMPConst.STRING);
	this.xmpConf.DownScale = xmp.getProperty(qteXMPNamespace, "DownScale", XMPConst.NUMBER);
}

exporterSettings.SetExporterXMPPreset = function (doc, obj)
{
	var xmp = new XMPMeta( doc.xmpMetadata.rawData );
	
	//xmp.deleteProperty(qteXMPNamespace, "ExportPath");
	xmp.setProperty(qteXMPNamespace, "ExportPath", obj.ExportPath , 0, XMPConst.STRING);
	
	//xmp.deleteProperty(qteXMPNamespace, "OutputType");
	xmp.setProperty(qteXMPNamespace, "OutputType", obj.OutputType , 0, XMPConst.STRING);
	
	//xmp.deleteProperty(qteXMPNamespace, "DownScale");
	xmp.setProperty(qteXMPNamespace, "DownScale", obj.DownScale , 0, XMPConst.NUMBER);
	
	doc.xmpMetadata.rawData = xmp.serialize();
	
	// Read new presets to exporter settings.
	this.GetExporterXMPPreset(doc);
}

exporterSettings.DumpXMPPreset = function ()
{

}

//~ exporterSettings.ToBoolean = function (string)
//~ {
//~ 	//return (string.toLowerCase().trim() == 'true');
//~ 	//switch(string.toLowerCase().trim())
//~ 	switch(string)
//~ 	{
//~ 		case "true": case "yes": case "1": return true;
//~ 		case "false": case "no": case "0": case null: return false;
//~ 		default: return Boolean(string);
//~     }
//~ }

exporterSettings.ToString = function (value)
{	
	//$.writeln("INPUT: " + value + " Type: " + typeof(value));
	//switch(string.toLowerCase().trim())
	
	trim = function(value)
	{
		return value.replace(/^[\s]+|[\s]+$/g, '');
	}

	try
	{
		value = value.toString().toLowerCase();
		value = trim(value);
	}
	catch(e){}
	
	switch(typeof(value))
	{
			case "number":
				return value.toString();
			case "string":
				//return value.toString();
				$.writeln("INPUT: " + value + " Type: " + typeof(value));
				return String(value);
			case "boolean":
				//return value.toString();
				var newVal = value? "true":"false";
				//$.writeln("Orig: " + value + " To bool: " + newVal);
				return newVal;
			case "undefined":
				return "";
			default: return "---";
	}
}

//~ exporterSettings.ToNumber = function (value)
//~ {
//~ 	return value.toString();
//~ }

exporterSettings.ToValue = function (value)
{	
	trim = function(value)
	{
		return value.replace(/^[\s]+|[\s]+$/g, '');
	}

	try
	{
		value = value.toString().toLowerCase();
		//value = trim(value);
	}
	catch(e){}
	
	if (isNaN(value))
	{
		//if (Number(value) != NaN) return Number(value);
		if (value == "true" || value == "false") return (value == 'true'); //return Boolean(value);
		return String(value)
	}
	else return Number(value);
	
	return String("");
}

exporterSettings.ToRGB = function (str)
{
	var rgb = str.split(";");
	return [rgb[0], rgb[1], rgb[2]];
}

//~ function TestDecr()
//~ {
//~ 	var desc = new ActionDescriptor();
//~ 	desc.putBoolean("kMyFlag", true);
//~ 	desc.putInteger("kMyNumber", 42);
//~ 	desc.putString("export_path", "d:/_tmp_export");
//~ 	app.putCustomOptions( "qte_export_path", desc, true );
//~ 	try
//~ 	{
//~ 		var desc = app.getCustomOptions( "qte_export_path" );
//~ 		$.writeln("	QTE: " + desc);
//~ 	}
//~ 	catch(e){}
//~ }

// ---------------------------------------------------------------------------------------------------------------------
//  Read tiff metadata for CryEngine RC,
// ---------------------------------------------------------------------------------------------------------------------
function ReadTIFFMetadata()
{
	//exiftool -r -overwrite_original -XMP-photoshop:DocumentAncestors= '/Users/currentuser/Desktop/My Problem Folder Full of Bloated Images'
}


// ---------------------------------------------------------------------------------------------------------------------
//	Export files.
// ---------------------------------------------------------------------------------------------------------------------
function ExportFiles()
{
	$.writeln("===== START EXPORT");

	// -- get the active document.
	docRef = app.activeDocument;
	// -- get the active document name.
	docName = app.activeDocument.name;
	// -- get the info of the current doc.
	docWidth = docRef.width;
	docHeight = docRef.height;
	
	// -- check for errors.
	//if (CheckForErrors(data.nonpow2)) return;
	
	// -- delete alpha channels from original psd file.
	RemoveAlphaChannels(docRef);
	
	// -- create new document.
	// -- delete file extension and suffix.
	var exportPath = docRef.path.fsName;
	var exportName = docRef.name;
	exportName = decodeURI(exportName.substring(0, exportName.indexOf(".")));
	var tempStr = decodeURI(exportName.substring(0, exportName.lastIndexOf(fileNameDelimiter)));
	if (tempStr != "") exportName = tempStr;
	
	var exportedDoc = docRef.duplicate(exportName + "_export", false);
	app.activeDocument = exportedDoc;
	
	// -- create background layer.
	var backgroundLayer = GetOrCreateBackgroundLayer(exportedDoc);
	
	for (var i = 0; i < exporterSettings.xmlConf.slots.length; i++)
	{	
		if (exporterSettings.xmlConf.slots[i].selected == true)
		{
			//$.writeln("Export: ", exporterSettings.xmlConf.slots[i].type, " ", exporterSettings.xmlConf.slots[i].selected);//, " ", exportData.slots[i].suffix);
			
			// -- update progress bar.
			
			// -- export.
			ExportTexture(exportedDoc, exporterSettings.xmlConf.slots[i], exportPath, exportName);
		}
	}
	
	// -- close
	exportedDoc.close(SaveOptions.DONOTSAVECHANGES);
	
	// -- make original document active
	app.activeDocument = docRef;
	
	/*undo code sample
	var baseState = doc.historyStates.length - 2;
	doc.activeHistoryState = doc.historyStates[baseState];
	doc.save();
	*/

	$.writeln("===== END EXPORT");
	
	return 0;
}

// ---------------------------------------------------------------------------------------------------------------------
//	Save file by texture type.
// ---------------------------------------------------------------------------------------------------------------------
function ExportTexture(doc, slot, exportPath, exportName)
{		
	var textureType = slot.type;
	var suffix = slot.suffix;
	var outputtype = exporterSettings.xmlConf.options.outputtype;
	
	// Hide all.
	HideAllInRoot(doc);
	
	RemoveAlphaChannels(doc);
	
	// -- construct document.
	var layer = GetLayerByNameOrCollapseSet(doc, slot.type);
	if (layer != undefined)
	{
		//$.writeln(" <<=============>> Layer: " + layer.name);
		doc.activeLayer = layer;
		
		CopyLayerToBackground(doc, layer);
			
		layer.visible = false;
	}

	for (var ch = 0; ch < slot.channels.length; ch++) 
	{
		var channel_layer = GetLayerByNameOrCollapseSet(doc, slot.channels[ch].source);
		if (channel_layer != undefined)
		{
				channel_layer.visible = true;
				doc.activeLayer = channel_layer;
				
				//backgroundLayer = GetOrCreateBackgroundLayer(doc);
				//if (backgroundLayer != undefined) doc.activeLayer = backgroundLayer;
				
				// Create from channels.
				if (slot.channels[ch].type == "r") SetChannelFromLayerGroup(doc, channel_layer, 0);
				if (slot.channels[ch].type == "g") SetChannelFromLayerGroup(doc, channel_layer, 1);
				if (slot.channels[ch].type == "b") SetChannelFromLayerGroup(doc, channel_layer, 2);
				if (slot.channels[ch].type == "a") SetChannelFromLayerGroup(doc, channel_layer, 3);
				
				channel_layer.visible = false;
		}
	}

	// -- downscale if needed.
	// TODO: если нужно даунскейлить, то создаём новый файл.
	//DownscaleSize(doc, slot);

	// -- sharpen. TODO: проходится по настройкам слота и шарпить бэкграунд и (или) каналы.
//~ 	if (data.sharpencontrast == true && slotTemplate.allowSharpen == true)
//~ 	{
//~ 		SharpenInkjetOutput();
//~ 		doc.flatten();
//~ 		// -- sharpen and contrast.
//~ 		SharpenLocalContrast();
//~ 		doc.flatten();
//~ 	}

	if (exporterSettings.xmlConf.options.copytolocalpath == true)
	{
		// -- full path with name.
		var saveFile = exportPath + "/" + exportName + suffix;
		SaveTexture(doc, saveFile, outputtype);
	}
	if (exporterSettings.xmlConf.options.copytoexportpath == true)
	{
		var saveFile = "";
		
		// Check path from XMP PSD.
		if (xmpSettings.ExportPath != "")
		{
			//if (Folder(xmpSettings.ExportPath).exists == false)
			var xmpPathFolder = Folder(xmpSettings.ExportPath);//.fsName.toLowerCase());
			if (!xmpPathFolder.exists)
			{
				xmpPathFolder.create();
			}
		
			// -- full path with name.
			//outputtype = xmpSettings.OutputType;
			saveFile = xmpSettings.ExportPath + "/" + exportName + suffix;
			SaveTexture(doc, saveFile, outputtype);
		}
	}
}

function SaveTexture(doc, saveFile, outputtype)
{
	// -- save new document
	var saveOptions = null;
	var hasAlpha = (doc.channels.length == 4) ? true : false;
    
	if (outputtype == "tga")
	{
		saveOptions = CreateTgaSaveOptions(hasAlpha);
	}
	if (outputtype == "png")
	{
		saveOptions = CreatePngSaveOptions(hasAlpha);
		// -- apply alpha. TODO
		// select from alpha channel, inverted, delete, delete alpha channel.
		
	}
	if (outputtype == "tiff")
	{
		saveOptions = CreateTiffSaveOptions(hasAlpha);
	}
	if (outputtype == "bmp")
	{
		saveOptions = CreateBmpSaveOptions(hasAlpha);
	}

	if (saveOptions == null)
	{
		$.writeln ("Not created save options");
		//doc.close(SaveOptions.DONOTSAVECHANGES);
		return;
	}
	
	//$.writeln(" >Save as: " + saveFile + "." + outputtype);
	doc.saveAs(new File(saveFile + "." + outputtype), saveOptions, true, Extension.LOWERCASE);
	
	// -- copy duplicate to symmetry path if one exist.
//~     var pathToExport = data.symmetrypath;
//~ 	if (data.copytosymmetrypath == true && Folder(pathToExport).exists == true)
//~ 	{
//~ 		symmetrypath = GetSymmetryPath(pathToExport);
//~ 		if (symmetrypath != null)
//~ 		{
//~ 			symmetrypath = symmetrypath + "/" + exportName + suffix + "." + data.outputtype;
//~ 			newDoc.saveAs(new File(symmetrypath), saveOptions, false, Extension.LOWERCASE);
//~ 		}
//~ 	}
//~     else if (data.copytosymmetrypath == true)
//~     {
//~ 		$.writeln ("Path to symmetry export not exist." + " Path = " + pathToExport);
//~     }
}

// ---------------------------------------------------------------------------------------------------------------------
//
// ---------------------------------------------------------------------------------------------------------------------
function GetSlotTemplate(slotTemplates, slot)
{
	var templateSlot = null;
	for (s = 0; s < slotTemplates.length; s++)
	{
		templateSlot = slotTemplates[s];
		if (templateSlot.slot == slot)
		{
			return templateSlot;
		}
	}
	return null;
}

// ---------------------------------------------------------------------------------------------------------------------
// Delete all layers or groups except 'textureType'.
// ---------------------------------------------------------------------------------------------------------------------
function DeleteAllExcept(doc, textureType)
{	
	for (var i = 0; i < doc.layers.length; i++) 
	{	
		doc.layers[i].allLocked = false;
		doc.layers[i].visible = false;
		if (textureType != doc.layers[i].name) doc.layers[i].visible = true;
	}
	
	// -- set active layer wich not equal with textureType.
	if (doc.layers[0].name == textureType) doc.activeLayer = doc.layers[1];
	if (doc.layers[1].name == textureType) doc.activeLayer = doc.layers[0];
	
	doc.mergeVisibleLayers();
	doc.activeLayer.remove();
	
	//--
	doc.activeLayer.visible = true;
	
	return doc.activeLayer;
}

function DeleteAllExcept_OLD(doc, textureType)
{
	var arr = [];
	
	for (var i = 0; i < doc.layers.length; i++) 
	{	
		if (textureType != doc.layers[i].name)
		{
			arr.push(doc.layers[i]);
		}
	}
	
	for (var i = 0; i < arr.length; i++) 
	{
		// -- delete.
		arr[i].visible = true;
		arr[i].allLocked = false;
		//doc.activeLayer = arr[i];
		
		if (arr[i].typename == "LayerSet")
		{
			var merged = arr[i].merge();
			merged.remove();
		}
		else
		{
			arr[i].remove();
			
			if (doc.layers[i].typename == "ArtLayer")
			{
				//arr[i].remove();
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Check.
// ---------------------------------------------------------------------------------------------------------------------
function CheckForErrors(data_nonpow2)
{
	var isErrors = false;
	
	if (app.documents.length == 0)
	{
		alert ('You must have a document open to export!');
		isErrors = true;
	}
	
	// -- check if document not saved.
	var isSaved = false;
	try
	{
		//	docRef.fullName		docRef.path
		if (docRef.path.toString() != "") isSaved = true;
	}
	catch(e)
	{
		isSaved = false;
	}
	if (!isSaved)
	{
		alert("Document must be saved.","Alert");
		isErrors = true;
	}
	
	// -- check texture size.
	if (data_nonpow2 == false && CheckDocumentSize() == false)
	{
		alert("Non 2 pow texture size.","Alert");
		isErrors = true;
	}
	
	if (isErrors)
	{
		CloseWindow();
	}
	
	return isErrors;
}

// ---------------------------------------------------------------------------------------------------------------------
// Load projects from environment var. Called from Flex. 
// ---------------------------------------------------------------------------------------------------------------------
function LoadProjectsPath()
{
	// -- projects path. TODO: Работает только в windows.
	var env_projects = $.getenv("WORKING_PROJECTS_PATH");
	if (env_projects != null)
	{
		var projects = env_projects.split(";");
		//dlg.fp.invokePlayerFunction ("AddSymmetryPath", "<path to project>");
		for (var i = 0; i < projects.length; i++)
		{
			p = projects[i];
			p = string_lstrip(p);
			p = string_rstrip(p);
			if (p.length > 5) dlg.fp.invokePlayerFunction ("AddSymmetryPath", p);
		}
	}	
}

// ---------------------------------------------------------------------------------------------------------------------
// Close dialog.
// ---------------------------------------------------------------------------------------------------------------------
function CloseWindow()
{
	try
	{
		ExpoterDialog.close ();
	}
	catch(e)
	{
		alert(e);
	}
}

function CloseWindow(wnd)
{
	try
	{
		wnd.close();
	}
	catch(e)
	{
		alert(e);
	}
}

function HideWindow(wnd)
{
	try
	{
		wnd.hide();
	}
	catch(e)
	{}
}

// ---------------------------------------------------------------------------------------------------------------------
//
// ---------------------------------------------------------------------------------------------------------------------
function Refresh()
{
	//$.writeln("Refresh");
	//app.refresh();
	//notify("OnDraw");
	//dlg.notify("OnMove");
	//dlg.notify("OnMoving");
	//dlg.notify("OnResize");
	
	//this.fp.notify("OnChange");
	//this.fp.notify("OnChanging");
	//this.fp.notify("OnClick");
	
	//waitForRedraw();
}

function waitForRedraw()
{
	function cTID(s) { return app.charIDToTypeID(s); };
	var desc = new ActionDescriptor();
	desc.putEnumerated(cTID("Stte"), cTID("Stte"), cTID("RdCm"));
	executeAction(cTID("Wait"), desc, DialogModes.NO);
}

var waitForRedraw2 = function()
{
	var d;
	d = new ActionDescriptor();
	d.putEnumerated(app.stringIDtoTypeID('state'), app.stringIDtoTypeID('state'), app.stringIDtoTypeID('redrawComplete'));
	return executeAction(app.stringIDtoTypeID('wait'), d, DialogModes.NO);
}

// ---------------------------------------------------------------------------------------------------------------------
// Remove element from.
// ---------------------------------------------------------------------------------------------------------------------
function RemoveUIElement(elem)
{
	elem.hide();
	elem.size = [0, 0];
	elem.location = [0, 0];
	//elem.remove();
}
	
// ---------------------------------------------------------------------------------------------------------------------
// Set dialog size.
// ---------------------------------------------------------------------------------------------------------------------
function SetWindowSize(width, height)
{
	dlg.bounds.width = width;
	dlg.bounds.height = height;
	
	//dlg.fp.bounds.width = width;
	//dlg.fp.bounds.height = height;
}

// ---------------------------------------------------------------------------------------------------------------------
//	Copy to symmetry path.
// ---------------------------------------------------------------------------------------------------------------------
function GetSymmetryPath(symmetryBasePath)
{
	// -- check for last slash in symmetryBasePath.
	var lastChar = symmetryBasePath.charAt(symmetryBasePath.length - 1);
	if (lastChar != "\\" && lastChar != "/")
	{
		symmetryBasePath += "\\";
	}
	
	var fullPath = null;
	var thepath = docRef.path.fsName.toLowerCase();
	theindex = thepath.indexOf("models");
    if (theindex != -1)
    {
        // -- find relative path from models.
        relativePath = docRef.path.fsName.substring(theindex, thepath.length);
		fullPath = symmetryBasePath + relativePath;
    }
    else
    {
        // -- find relative path from textures.
		theindex = thepath.indexOf("textures");
        relativePath = docRef.path.fsName.substring(theindex, thepath.length);
		fullPath = symmetryBasePath + relativePath;
    }
	if (fullPath == null) return null;
	//$.writeln("Relative:" + relativePath);
	//$.writeln("Full:" + fullPath);
		
	// -- create path if not exist
	fullPathFolder = Folder ( fullPath );
	if (!fullPathFolder.exists)
	{
		fullPathFolder.create();
	}
	
	return fullPath;
}

// ---------------------------------------------------------------------------------------------------------------------
// Save options.
// ---------------------------------------------------------------------------------------------------------------------
function CreateTgaSaveOptions(hasAlpha)
{
    var saveOptions = new TargaSaveOptions();
	if (hasAlpha == true)
	{
		saveOptions.resolution = TargaBitsPerPixels.THIRTYTWO;
		saveOptions.alphaChannels = true;
	}
	else
	{
		saveOptions.resolution = TargaBitsPerPixels.TWENTYFOUR;
		saveOptions.alphaChannels = false;
	}
	saveOptions.rleCompression = false;
    
    return saveOptions;
}

function CreatePngSaveOptions(hasAlpha)
{
	// var pngOpts = new ExportOptionsSaveForWeb; 
	// pngOpts.format = SaveDocumentType.PNG
	// pngOpts.PNG8 = false; 
	// pngOpts.transparency = true; 
	// pngOpts.interlaced = false; 
	// pngOpts.quality = 100;
	// activeDocument.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts);

	var saveOptions = new PNGSaveOptions();
	saveOptions.interlaced = false;
	return saveOptions;
}

function CreateTiffSaveOptions(hasAlpha)
{
	saveOptions = new TiffSaveOptions();
	if (hasAlpha == true)
	{
		saveOptions.alphaChannels = true;
	}
	else
	{	
		saveOptions.alphaChannels = false;
	}
	//if (TIFFEncoding.JPEG == exportInfo.tiffCompression)
	//saveOptions.jpegQuality = exportInfo.tiffJpegQuality;
	//saveOptions.embedColorProfile = exportInfo.icc;
	//saveOptions.imageCompression = exportInfo.tiffCompression;
	saveOptions.layers = false;
	//saveOptions.transparency = 
	
	return saveOptions;
}

function CreateBmpSaveOptions(hasAlpha)
{
	var saveOptions = new BMPSaveOptions();
	if (hasAlpha == true)
	{
		saveOptions.alphaChannels = true;
		saveOptions.depth = BMPDepthType.THIRTYTWO;
	}
	else
	{
		saveOptions.alphaChannels = false;
		saveOptions.depth = BMPDepthType.TWENTYFOUR;
	}
	saveOptions.flipRowOrder = false;
	saveOptions.osType = OperatingSystem.WINDOWS; //OS2
	saveOptions.rleCompression = false;
	
	return saveOptions;
}

// ---------------------------------------------------------------------------------------------------------------------
// Create artLayer and fill.
// Param color is array like [255, 0, 0] or null (layer not fill).
// ---------------------------------------------------------------------------------------------------------------------
function CreateLayer(doc, color)
{
	doc.artLayers.add();
	doc.selection.selectAll();
	
	if (color != null)
	{
		// -- fill.
		var fillColor = new SolidColor();
		fillColor.rgb.red = color[0];
		fillColor.rgb.green = color[1];
		fillColor.rgb.blue = color[2];
		doc.selection.fill(fillColor);
	}
	
	doc.selection.deselect();	
}

// ---------------------------------------------------------------------------------------------------------------------
// 
// 
// ---------------------------------------------------------------------------------------------------------------------
function CopyLayerTo(doc, layerFrom, layerTo)
{
	// TODO: не работает.
	if (layerFrom.allLocked == true) layerFrom.allLocked = false;
	if (layerFrom.visible == false) layerFrom.visible = true;
	
	doc.activeLayer = layerFrom;
	doc.selection.selectAll();
	//doc.selection.duplicate(layerFrom);
	doc.selection.copy();
	
	if (layerTo.allLocked == true) layerTo.allLocked = false;
	if (layerTo.visible == false) layerTo.visible == true;
	
	doc.activeLayer = layerTo;
	doc.paste();
	doc.selection.deselect();		
}

// ---------------------------------------------------------------------------------------------------------------------
//  Check if background layer exists.
// ---------------------------------------------------------------------------------------------------------------------
function HasBackgroundLayer(doc)
{
	// doc.hasOwnProperty("backgroundLayer")
	if (doc.artLayers.length == 0) return false;
    return doc.artLayers[doc.artLayers.length - 1].isBackgroundLayer ? true : false;
}

// ---------------------------------------------------------------------------------------------------------------------
//  Get background layer.
//  Сreate it if necessary.
// ---------------------------------------------------------------------------------------------------------------------
function GetOrCreateBackgroundLayer(doc)
{
	var backgroundLayer = undefined;
	
	if (HasBackgroundLayer(doc))
	{
		backgroundLayer = doc.backgroundLayer;
	}
	else
	{
		CreateLayer(doc, [0, 0, 0]);
		doc.activeLayer.isBackgroundLayer = true;
		//backgroundLayer = doc.activeLayer;
	}
	
	return backgroundLayer;
}

// ---------------------------------------------------------------------------------------------------------------------
//  Copy layer to background.
//  Сreate it if necessary.
// ---------------------------------------------------------------------------------------------------------------------
function CopyLayerToBackground(doc, layerFrom)
{
	layerFrom.allLocked = false;
	layerFrom.visible == true;
	
	if (HasBackgroundLayer(doc))
	{
		// Remove background.
		var layerTo = doc.backgroundLayer;
		layerTo.isBackgroundLayer = false;
		doc.activeLayer = layerTo;
		doc.activeLayer.remove();
	}
	
	doc.activeLayer = layerFrom;
	doc.selection.selectAll();
	doc.selection.copy();
	doc.paste();
	doc.selection.deselect();
	
	doc.activeLayer.isBackgroundLayer = true;
}

// ---------------------------------------------------------------------------------------------------------------------
// Create group and layer and fill layer.
// Param color is array like [255, 0, 0] or null (layer not fill).
// If group != null new group will be created as parent of group, otherwise in root.
// ---------------------------------------------------------------------------------------------------------------------
function CreateGroupAndLayer(doc, group, newGroupName, color)
{
	var newGroup = null;
	
	if (group != null && newGroupName != null)
	{
		// -- create sub group.
		newGroup = group.layerSets.add();
	}
	else if (group == null && newGroupName != null)
	{
		// -- create group.
		newGroup = doc.layerSets.add();
	}
	else return;
	
	newGroup.name = newGroupName;
	newGroup.artLayers.add();
	doc.selection.selectAll();
	
	if (color != null)
	{
		// -- fill.
		var fillColor = new SolidColor();
		fillColor.rgb.red = color[0];
		fillColor.rgb.green = color[1];
		fillColor.rgb.blue = color[2];
		doc.selection.fill(fillColor);
	}
	
	doc.selection.deselect();	
}

// ---------------------------------------------------------------------------------------------------------------------
// Create channel from layerGroup and delete layerGroup after that.
// channel - must be 0, 1, 2 or 3.
// Document must contain backgroundLayer.
// ---------------------------------------------------------------------------------------------------------------------
function SetChannelFromLayerGroup(doc, layer, channel)
{
	if (channel != 0 && channel != 1 && channel != 2 && channel != 3) return;
	
	// -- find background layer.
	var background = doc.backgroundLayer;

	layer.allLocked = false;
	layer.visible = true;
	
	doc.activeLayer = layer;
	doc.selection.selectAll();
	doc.selection.copy();
	layer.visible = false;
	
	doc.activeLayer = background;
	
	if (channel == 3 && doc.channels.length == 3)
	{
		// -- add alpha channel if needed.
		doc.channels.add();
	}
	
	doc.activeChannels = [doc.channels[channel]];
	
	doc.paste();
	doc.selection.deselect();

	// -- restore channel selection.
	doc.channels[0].visible = true;
	doc.channels[1].visible = true;
	doc.channels[2].visible = true;
	if (doc.channels.length > 3) doc.channels[3].visible = false;
	doc.activeChannels = [doc.channels[0], doc.channels[1], doc.channels[2]];
}

// ---------------------------------------------------------------------------------------------------------------------
//	Generate template structure.
// ---------------------------------------------------------------------------------------------------------------------
function CreateGroupFolders(data, slotTemplates)
{
	var doc = app.activeDocument;
	
	for (i = 0; i < data.textureslots.length; i++)
	{	
		var slot = data.textureslots[i].slot;
		
		// -- get template slot.
		var slotTemplate = GetSlotTemplate(slotTemplates, slot);
		if (slotTemplate == null) continue;
		
		if (slotTemplate.fill == undefined)
		{
			// -- create multichannel group structure.
			var group = doc.layerSets.add();
			group.name = slot;
			
			if (slotTemplate.fill_r != undefined && slotTemplate.fill_r != "null")
			{
				var rgb = slotTemplate.fill_r.split(";");
				CreateGroupAndLayer(doc, group, "(R)", rgb);
			}
			if (slotTemplate.fill_g != undefined && slotTemplate.fill_g != "null")
			{
				var rgb = slotTemplate.fill_g.split(";");
				CreateGroupAndLayer(doc, group, "(G)", rgb);
			}
			if (slotTemplate.fill_b != undefined && slotTemplate.fill_b != "null")
			{
				var rgb = slotTemplate.fill_b.split(";");
				CreateGroupAndLayer(doc, group, "(B)", rgb);
			}
			if (slotTemplate.fill_a != undefined && slotTemplate.fill_a != "null")
			{
				var rgb = slotTemplate.fill_a.split(";");
				CreateGroupAndLayer(doc, group, "(A)", rgb);
			}
		}
		else
		{	
			var rgb = slotTemplate.fill.split(";");
			CreateGroupAndLayer(doc, null, slot, rgb);
		}
	}
				
	// -- delete default layer.
	doc.artLayers.removeAll();
	// -- close window
	CloseWindow();
}

// ---------------------------------------------------------------------------------------------------------------------
//	Check document size for powers of 2.
// ---------------------------------------------------------------------------------------------------------------------
function CheckDocumentSize ()
{
	// -- check document size
	var powers = new Array(2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192);
	var heightMatch = 0;
	var widthMatch = 0;
	for ( x = 0 ; x < powers.length ; x++ )
	{
		if ( docWidth == powers[x]  )
		{
			heightMatch = 1;
		}
		if ( docHeight == powers[x]  )
		{
			widthMatch = 1;
		}
	}
	// -- see if it matches the powers if not get out of here
	if ( heightMatch == 0 || widthMatch == 0 )
	{
		return false;
	}
	return true;
}

// ---------------------------------------------------------------------------------------------------------------------
//	Downscale texture size.
// ---------------------------------------------------------------------------------------------------------------------
function DownscaleSize(newDoc, slot)
{
	var coeff = Number(slot.downscale);
	
	if (coeff == 1) return;
	
	var newWidth = newDoc.width/coeff;
	var newHeight = newDoc.height/coeff;
	
	$.writeln ("Orig width: " + newDoc.width + ", Orig height: " + newDoc.height + ", Downscale: " + coeff + ", New width: " + newWidth + ", New height: " + newHeight);
	
	// TODO: проверять чтобы даунскейленные значения не выходили за рамки (не равны 0, степень двойки если надо и т.д)
	newDoc.resizeImage(newWidth, newHeight, newDoc.resolution, ResampleMethod.BICUBIC);
}

// ---------------------------------------------------------------------------------------------------------------------
//	Remove alpha channel from active document.
// ---------------------------------------------------------------------------------------------------------------------
function RemoveAlphaChannels(doc) 
{
	var channels = doc.channels;
	var channelCount = channels.length - 1;
	while ( channels[channelCount].kind != ChannelType.COMPONENT ) 
	{
		channels[channelCount].remove();
		channelCount--;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Return an item called 'name' from the specified container.
// This works for the "magic" on PS containers like Documents.getByName(),
// for instance. However this returns null if an index is not found instead
// of throwing an exception
// The 'all' arg is optional and defaults to 'false'
// ---------------------------------------------------------------------------------------------------------------------
function getByName(container, name, all) 
{
	// -- check for a bad index
	if (!name) throw "'undefined' is an invalid name/index";

	var matchFtn;

	if (name instanceof RegExp) 
	{
		matchFtn = function(s1, re) { return s1.match(re) != null; }
	} 
	else 
	{
		matchFtn = function(s1, s2) { return s1 == s2;  }
	}

	var obj = [];

	for (var i = 0; i < container.length; i++) 
	{
		if (matchFtn(container[i].name, name)) 
		{
			if (!all) 
			{
				return container[i];     // -- there can be only one
			}
			obj.push(container[i]);    // -- add it to the list
		}
	}

	return all ? obj : undefined;
}

function getAllByName(container, name) 
{
	return getByName(container, name, true);
}

// ---------------------------------------------------------------------------------------------------------------------
// 
// ---------------------------------------------------------------------------------------------------------------------
function GetLayerByNameOrCollapseSet(doc, name)
{
	var layer = getByName(doc.layerSets, name, false);
	if (layer != undefined)
	{
		// Get LayerSet.
		//$.writeln(" === Get " + name + " as layer set");
		layer.allLocked = false;
		layer.visible = true;
		
		// Flatten layer set.
		doc.activeLayer = layer;
		executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
		doc.activeLayer.rasterize(RasterizeType.ENTIRELAYER);
		
		//doc.activeLayer.move(LocationOptions.AT_BEGINNING);
		//doc.activeLayer.move(doc.layers.index(0), ElementPlacement.PLACEAFTER);
		//originalLayer.zOrder(ZOrderMethod.SENDTOBACK); 
		
		layer = doc.activeLayer;
		layer.allLocked = false;
		layer.visible = true;
	}
	else
	{
		layer = getByName(doc.artLayers, name, false);
		if (layer != undefined)
		{
			// Get ArtLayer.
			//$.writeln(" === Get " + name + " as art layer");
			doc.activeLayer = layer;
			layer.allLocked = false;
			layer.visible = true;
		}
	}

	return layer;
}

// ---------------------------------------------------------------------------------------------------------------------
// Hide all group and art layers in document root.
// ---------------------------------------------------------------------------------------------------------------------
function HideAllInRoot(doc)
{
	for (var i = 0; i < doc.layerSets.length; i++) 
	{
		doc.layerSets[i].allLocked = false;
		doc.layerSets[i].visible = false;
	}
	for (var i = 0; i < doc.artLayers.length; i++) 
	{
		doc.artLayers[i].allLocked = false;
		doc.artLayers[i].visible = false;
	}	
}


// ---------------------------------------------------------------------------------------------------------------------
// 
// ---------------------------------------------------------------------------------------------------------------------
function RGB_Normalized(r, g, b)
{
	r = r/255;
	g = g/255;
	b = b/255;
	return [r, g, b];
}

// ---------------------------------------------------------------------------------------------------------------------
// String functions.
// ---------------------------------------------------------------------------------------------------------------------
function string_split ( word, splitat )
{
	splitword = word.split ( splitat );
	return ( splitword );
}

function string_replace ( word, before, after )
{
	replaced = word.replace ( before, after );
	return ( replaced );
}

function string_rstrip(str)
{
    new_str = ""
    for (var i = str.length - 1; i >= 0; i--)
    {
        if (str[i] != ' ')
        {
            new_str = str.substr(0, i + 1);
            break;
        }
    }
    return (new_str);
}

function string_lstrip(str)
{
    new_str = ""
    for (var i = 0; i < str.length; i++)
    {
        if (str[i] != ' ')
        {
            new_str = str.substr(i);
            break;
        }
    }
    return (new_str);
}

