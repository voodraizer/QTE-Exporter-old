#target photoshop;

function TEST_1()
{
	//while(app.activeDocument.layerSets.length){

	activeDocument.activeLayer = app.activeDocument.layerSets[1];

	executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);

	activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER);

	//}
	
//~ 	var idMrgV = charIDToTypeID("MrgV");
//~ 	executeAction(idMrgV, undefined, DialogModes.NO);
}

function TEST_2()
{
	// Copy all visible layers to clipboard (true = merged)
	//app.activeDocument.activeLayer.copy(true);
	// then paste them (creates a new layer)
	//activeDocument.paste();
	//app.activeDocument.rasterizeAllLayers();
	app.activeDocument.mergeVisibleLayers();
	
	//Document.duplicate (relativeObject: Object , insertionLocation: ElementPlacement ): Document 
}


TEST_2();