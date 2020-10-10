import {InflectedKey} from './InflectedKey';
import {MasterDictionaryKey} from './MasterDictionaryKey';
import {Transliteration} from './Transliteration';

export class MeaningRequestView {

  transliteration = Transliteration.Latin;

  inflected_key = new InflectedKey();

  direct_master_references: MasterDictionaryKey[] = [];



}
