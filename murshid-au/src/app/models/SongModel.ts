import {InflectedLine} from './InflectedLine';
import {MasterLine} from './MasterLine';
import {ParagraphBlock} from './ParagraphBlock';
import {Transliteration} from './Transliteration';
import {Tag} from './Tag';

export class SongModel {
  plainHtml = '';
  paragraphBlocks: ParagraphBlock[] = [];
  bollyName = '';
  urlKey = '';
  hindiTitle = '';
  urduTitle = '';
  inflectedLines: InflectedLine[] = [];
  masterLineItems: MasterLine[] = [];
  videoUrl = '';
  imageUrl = '';
  metaDescription = '';
  description = '';
  transliteration = Transliteration.Latin;
  tags: Tag[] = [];
}
