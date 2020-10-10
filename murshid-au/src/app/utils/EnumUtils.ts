import {Transliteration} from '../models/Transliteration';
import {OrderSongsBy} from '../models/OrderSongsBy';


export class EnumUtils {
    static transliterationFromString(enumName: string): Transliteration {
    switch (enumName) {
      case 'हिन्दी':
        return Transliteration.Hindi;
      case 'اُردو':
        return Transliteration.Urdu;
      default:
        return Transliteration.Latin;
    }
  }

  static transliterationFromLatinString(enumName: string): Transliteration {
    switch (enumName) {
      case 'Hindi':
        return Transliteration.Hindi;
      case 'Urdu':
        return Transliteration.Urdu;
      default:
        return Transliteration.Latin;
    }
  }

  static stringFromTransliteration(enumName: Transliteration): string {
    switch (enumName) {
      case Transliteration.Hindi:
        return 'हिन्दी';
      case Transliteration.Urdu:
        return 'اُردو';
      default:
        return 'Latin';
    }
  }

  static latinStringFromTransliteration(enumName: Transliteration): string {
    switch (enumName) {
      case Transliteration.Hindi:
        return 'Hindi';
      case Transliteration.Urdu:
        return 'Urdu';
      default:
        return 'Latin';
    }
  }

    static sortFromString(enumName: string): OrderSongsBy {
        switch (enumName) {
            case 'alpha':
                return OrderSongsBy.alpha;
          case 'release':
            return OrderSongsBy.release;
          default:
                return OrderSongsBy.post;
        }
    }



}
