import { XMLParser } from 'fast-xml-parser';
import { AssetMapObject } from './interfaces/assetmapObject';
import { formatId, INTEROP_ASSETMAP_URI, SMTPE_ASSETMAP_URI } from './util';

export function assetMapParser(
	assetMapXMLString: string,
	format: 'raw' | 'formatted' = 'formatted'
): AssetMapObject | any {
	let xmlParser = new XMLParser({ ignoreAttributes: false });
	let assetRawObject = xmlParser.parse(assetMapXMLString).AssetMap;
	let assetObject: Partial<AssetMapObject> = {};
	if (format === 'raw') {
		return assetRawObject;
	}
	if (assetRawObject['@_xmlns'] == INTEROP_ASSETMAP_URI) {
		assetObject.type = 'INTEROP';
		xmlParser = new XMLParser();
		assetRawObject = xmlParser.parse(assetMapXMLString).AssetMap;
		assetObject.id = formatId(assetRawObject.Id);
		assetObject.annotationText = assetRawObject.AnnotationText;
		assetObject.issueDate = assetRawObject.IssueDate;
		assetObject.issuer = assetRawObject.Issuer;
		assetObject.creator = assetRawObject.Creator;
		assetObject.assetList = assetRawObject.AssetList.Asset.map((asset: any) => {
			return {
				id: formatId(asset.Id),
				annotationText: asset.AnnotationText,
				path: Array.isArray(asset.ChunkList)
					? asset.ChunkList.map((chunk: any) => chunk.Chunk.Path)
					: asset.ChunkList.Chunk.Path,
				...(asset.PackingList ? { packingList: asset.PackingList } : {}),
			};
		});
	} else if (assetRawObject['@_xmlns'] == SMTPE_ASSETMAP_URI) {
		assetObject.type = 'SMTPE';
		xmlParser = new XMLParser();
		assetRawObject = xmlParser.parse(assetMapXMLString).AssetMap;
		assetObject.id = formatId(assetRawObject.Id);
		assetObject.annotationText = assetRawObject.AnnotationText;
		assetObject.issueDate = assetRawObject.IssueDate;
		assetObject.issuer = assetRawObject.Issuer;
		assetObject.creator = assetRawObject.Creator;
		assetObject.assetList = assetRawObject.AssetList.Asset.map((asset: any) => {
			return {
				id: formatId(asset.Id),
				annotationText: asset.AnnotationText,
				path: Array.isArray(asset.ChunkList)
					? asset.ChunkList.map((chunk: any) => chunk.Chunk.Path)
					: asset.ChunkList.Chunk.Path,
				...(asset.PackingList ? { packingList: asset.PackingList } : {}),
			};
		});
	}
	return assetObject as AssetMapObject;
}
