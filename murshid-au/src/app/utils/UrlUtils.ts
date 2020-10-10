import {ActivatedRoute} from '@angular/router';
import {UrlElements} from '../models/UrlElements';
import {EnumUtils} from './EnumUtils';
import {OrderSongsBy} from '../models/OrderSongsBy';

export class UrlUtils {
     static extractElements(route: ActivatedRoute): UrlElements {
        const result = new UrlElements();
        if (typeof (route) === 'undefined' || !(route.routeConfig)) {
          return result;
        }
        const path = route.routeConfig.path;
        switch (path) {
            case '':
                return result;
            case ':page':
                result.page = Number.parseInt(route.snapshot.url[0].path);
                return result;
            case 'tag/:tag':
                result.tag = route.snapshot.url[1].path;
                return result;
            case 'tag/:tag/sort/:sort':
                result.tag = route.snapshot.url[1].path;
                result.sort = EnumUtils.sortFromString(route.snapshot.url[3].toString());
                return result;
            case 'tag/:tag/:page':
                result.tag = route.snapshot.url[1].path;
                result.page = Number.parseInt(route.snapshot.url[2].toString());
                return result;
            case 'tag/:tag/sort/:sort/:page':
                result.tag = route.snapshot.url[1].path;
                result.sort = EnumUtils.sortFromString(route.snapshot.url[3].path);
                result.page = Number.parseInt(route.snapshot.url[4].toString());
                return result;
            case 'sort/:sort':
                result.sort = EnumUtils.sortFromString(route.snapshot.url[1].path);
                return result;
            case 'sort/:sort/:page':
                result.sort = EnumUtils.sortFromString(route.snapshot.url[1].toString());
                result.page = Number.parseInt(route.snapshot.url[2].toString());
                return result;
            case 'dictionary/:word':
                result.word = route.snapshot.url[1].toString();
                return result;
            case 'dictionary':
                return result;
            default:
                alert('url path ' + path + ' not supported');
                result.page = 0;
                result.sort = OrderSongsBy.release;
                result.tag = '';
                return result;
        }
    }

    static reconstruct(urlElements: UrlElements): string {
       if (urlElements.tag == null && urlElements.word == null) {
           if (urlElements.page == null) {
               if (urlElements.sort == null) {
                   return '/';
               } else {
                   return '/sort/' + urlElements.sort.toString();
               }
           } else {
               if (urlElements.sort == null) {
                   return '/' + urlElements.page.toString();
               } else {
                   return '/sort/' + urlElements.sort.toString() + '/' + urlElements.page.toString();
               }
           }
       } else if (urlElements.tag != null) {
           if (urlElements.page == null) {
               if (urlElements.sort == null) {
                  return  '/tag/' + urlElements.tag;
               } else {
                   return '/tag/' + urlElements.tag + '/sort/' + urlElements.sort.toString();
               }
           } else {
               if (urlElements.sort == null) {
                  return '/tag/' + urlElements.tag + '/' + urlElements.page.toString();
               } else {
                   return '/tag/' + urlElements.tag + '/sort/' + urlElements.sort.toString() + '/' + urlElements.page.toString();
               }
           }
       } else if (urlElements.word != null) {
         if (urlElements.page == null) {
           return '/dictionary/' + urlElements.word;
         } else {
           return '/dictionary/' + urlElements.word + '/' + urlElements.page.toString();
         }
       } else {
         throw new Error('unrecognized combination of urlElements ' + urlElements);
       }

    }

}
