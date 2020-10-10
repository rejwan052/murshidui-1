import {Pagination} from '../models/Pagination';
import {GlobalsService} from '../services/globals.service';

export class PaginationUtils {

   static forcePageSelection(pagination: Pagination, pageNumber: number): Pagination {
      const index = pagination.pages.findIndex(p => p === pageNumber);
      if (index === -1) {
        throw new Error('cannot force pageNumber ' + pageNumber);
      } else {
        pagination.activePageIndex = index;
      }
      const morePagesInside = (pagination.activePageIndex) < (pagination.pages.length - 1);
      const morePagesOutside = pagination.absolutePageEnd < (pagination.itemCount - 1 );
      pagination.hasNext =  morePagesInside  ||  morePagesOutside;
      const hasInsideToTheLeft = (pagination.activePageIndex) > 0;
      const hasOutsideToTheLeft = pagination.absolutePageStart > 0;
      pagination.hasPrevious =  hasOutsideToTheLeft  ||  hasInsideToTheLeft;
      return pagination;
    }

  /**
   * it will try to shift  the pager, unless we are below the 2/3 of the length or there are no pages to the
   * right, in those cases it will move the selection
   */
  static actionNext(globals: GlobalsService, pagination: Pagination): Pagination {
    PaginationUtils.validate(globals,  pagination);
    let shouldShift = true;
    if (!pagination.hasNext) {
      shouldShift = false;
    } else if (pagination.activePageIndex  < globals.shiftLowerBound ||  (pagination.activePageIndex > globals.shiftUpperBound  && (pagination.absolutePageEnd === pagination.itemCount - 1))) {
      shouldShift = false;
    } else if (pagination.absolutePageEnd === (pagination.itemCount - 1)) {
      shouldShift = false;
    }

    if (shouldShift) {
      return PaginationUtils.shiftLeftWithSelectionInPlace(globals,  pagination);
    } else {
      const result = new Pagination();
      result.itemCount = pagination.itemCount;
      const morePagesInside = (pagination.activePageIndex + 1) < (pagination.pages.length - 1);
      const morePagesOutside = pagination.absolutePageEnd < (pagination.itemCount - 1 );
      result.hasNext =  morePagesInside  ||  morePagesOutside;
      const hasInsideToTheLeft = (pagination.activePageIndex + 1) > 0;
      const hasOutsideToTheLeft = pagination.absolutePageStart > 0;
      result.hasPrevious =  hasOutsideToTheLeft  ||  hasInsideToTheLeft;
      result.activePageIndex = pagination.activePageIndex + 1;
      result.absolutePageStart = pagination.absolutePageStart;
      result.absolutePageEnd = pagination.absolutePageEnd;
      result.pages = pagination.pages;
      result.pageSizes = pagination.pageSizes;
      return  result;
    }
  }

  /**
   * when we clicked "previous" and the pager shifts in place
   * with the selection remaining in the same place
   */
  static shiftRightWithSelectionInPlace(globals: GlobalsService,  pagination: Pagination): Pagination {
    PaginationUtils.validate(globals, pagination);
    const result = new Pagination();
    result.hasNext = true;
    result.absolutePageStart =  (pagination.absolutePageStart + 1 ) -  globals.pageSize;
    result.activePageIndex = pagination.activePageIndex;
    const newPages = pagination.pages.slice(0, pagination.pages.length - 1);
    const newPageSizes = pagination.pageSizes.slice(0, pagination.pageSizes.length - 1);
    newPages.unshift(pagination.pages[0] - 1);
    newPageSizes.unshift(globals.pageSize);
    result.pages = newPages;
    result.pageSizes = newPageSizes;
    result.absolutePageStart = pagination.absolutePageStart - globals.pageSize;
    result.absolutePageEnd = PaginationUtils.calculateEnd(result);
    result.itemCount = pagination.itemCount;
    const hasInsideToTheLeft = (result.activePageIndex) > 0;
    const hasOutsideToTheLeft = result.absolutePageStart > 0;
    result.hasPrevious =  hasOutsideToTheLeft  ||  hasInsideToTheLeft;
    return  result;
  }


  private static calculateEnd(pagination: Pagination): number {
    const totalItems = pagination.pageSizes.reduce((a, b) => a + b, 0);
    return pagination.absolutePageStart + totalItems - 1;
  }

  static validate(globals: GlobalsService, pagination: Pagination): void {
    if (typeof(pagination.pages) === 'undefined') {
      throw new Error('pages cannot be undefined');
    } else if (typeof (pagination.pageSizes) === 'undefined') {
      throw new Error('pageSizes  cannot be undefined');
    } else if (typeof (pagination.absolutePageEnd) === 'undefined') {
      throw new Error('absolutePageEnd cannnot   cannot be undefined');
    } else if (typeof (pagination.absolutePageStart) === 'undefined') {
      throw new Error('absolutePageStart cannnot   cannot be undefined');
    }


    // tslint:disable-next-line:triple-equals
    if (pagination.pages.length != pagination.pageSizes.length) {
      throw new Error('pages cannot be of different length than pageSizes');
    }

    if (pagination.pageSizes.length > 0) {
      for (let i = 0; i < (pagination.pageSizes.length - 1); i++) {
        if (pagination.pageSizes[i] !== globals.pageSize) {
          throw new Error('in pagination ' + pagination.toString() +  ' page ' + i  + ' (not the last) has not the maximum number of items (' + globals.pageSize + ') but ' + pagination.pageSizes[i]);
        }
      }
    }
  }

  /**
   * when we clicked "next" and the pager shifts in place
   * with the selection remaining in the same place
   */
  static shiftLeftWithSelectionInPlace(globals: GlobalsService, pagination: Pagination): Pagination {
    PaginationUtils.validate(globals, pagination);
    const result = new Pagination();
    result.hasPrevious = true;
    const remainingItems =  pagination.itemCount - pagination.absolutePageEnd - 1;
    result.activePageIndex = pagination.activePageIndex;
    const newPages = pagination.pages.slice(1, pagination.pages.length);
    const newPageSizes = pagination.pageSizes.slice(1, pagination.pageSizes.length);
    if (remainingItems > 0) {
      newPages.push(pagination.pages[pagination.pages.length - 1] + 1);
      newPageSizes.push(Math.min(globals.pageSize, remainingItems));
    }
    result.pages = newPages;
    result.pageSizes = newPageSizes;
    result.absolutePageStart = pagination.absolutePageStart + globals.pageSize;
    result.absolutePageEnd = this.calculateEnd(result);
    result.itemCount = pagination.itemCount;
    const morePagesInside = (result.activePageIndex) < (result.pages.length - 1);
    const morePagesOutside = result.absolutePageEnd < (result.itemCount - 1 );
    result.hasNext =  morePagesInside  ||  morePagesOutside;
    return  result;
  }

  static actionPrevious(globals: GlobalsService, pagination: Pagination): Pagination {
    PaginationUtils.validate(globals, pagination);
    let shouldShift = true;
    if (!pagination.hasPrevious) {
      shouldShift = false;
    } else if ((pagination.activePageIndex > 0 && pagination.activePageIndex  < globals.shiftLowerBound) || pagination.activePageIndex > globals.shiftUpperBound) {
      shouldShift = false;
    } else if (pagination.absolutePageStart === 0) {
      shouldShift = false;
    }

    if (shouldShift) {
      return PaginationUtils.shiftRightWithSelectionInPlace(globals, pagination);
    } else {
      const result = new Pagination();
      result.itemCount = pagination.itemCount;
      const morePagesInside = (pagination.activePageIndex - 1) < (pagination.pages.length - 1);
      const morePagesOutside = pagination.absolutePageEnd < (pagination.itemCount - 1 );
      result.hasNext = morePagesInside || morePagesOutside;
      const hasInsideToTheLeft = (pagination.activePageIndex - 1) > 0;
      const hasOutsideToTheLeft = pagination.absolutePageStart > 0;
      result.hasPrevious = hasInsideToTheLeft || hasOutsideToTheLeft;
      result.activePageIndex = pagination.activePageIndex - 1;
      result.absolutePageStart = pagination.absolutePageStart;
      result.absolutePageEnd = pagination.absolutePageEnd;
      result.pages = pagination.pages;
      result.pageSizes = pagination.pageSizes;
      return  result;
    }
  }

  static start(globals: GlobalsService, items: number ): Pagination {
    // how many pages there are in total
    const totalPages = Math.ceil(items / globals.pageSize);

    // how many pages to show
    const pagesToShow = Math.min(globals.maxPagesDisplayed, totalPages);

    // pages array
    const pages = [];
    const pageSizes = [];
    let left = items;
    for (let i = 0; i < pagesToShow; i++) {
      pages.push(i + 1);
      const subtract = Math.min(left, globals.pageSize);
      pageSizes.push(subtract);
      left = left - subtract;
    }

    const result = new Pagination();
    result.hasPrevious = false;
    result.hasNext = pagesToShow < totalPages;
    result.activePageIndex = 0;
    result.absolutePageStart = 0;
    result.pages = pages;
    result.pageSizes = pageSizes;
    result.absolutePageEnd = PaginationUtils.calculateEnd(result);
    result.itemCount = items;

    return result;
  }

  static clickInside(globals: GlobalsService,  pageNumber: number, pagination: Pagination): Pagination {
    PaginationUtils.validate(globals, pagination);
    const result = new Pagination();
    result.activePageIndex = pagination.pages.indexOf(pageNumber);
    if (result.activePageIndex < 0) {
      throw new Error('the pageNumber ' + pageNumber + ' was expected to be in the pages array ' + pagination.pages.toString());
    }
    result.itemCount = pagination.itemCount;
    result.absolutePageStart = pagination.absolutePageStart;
    result.absolutePageEnd = pagination.absolutePageEnd;
    result.pages = pagination.pages;
    const morePagesInside = (pagination.activePageIndex) < (pagination.pages.length - 1);
    const morePagesOutside = pagination.absolutePageEnd < (pagination.itemCount - 1 );
    result.hasNext =  morePagesInside  ||  morePagesOutside;
    const hasInsideToTheLeft = (pagination.activePageIndex) > 0;
    const hasOutsideToTheLeft = pagination.absolutePageStart > 0;
    result.hasPrevious =  hasOutsideToTheLeft  ||  hasInsideToTheLeft;

    return result;
  }

  // /**
  //  * the items count represented in the pages of this pagination (not in the whole collection)
  //  */
  // static totalPaginationItems(pagination: Pagination): number {
  //   let accumulator = 0;
  //   for (let i = 0; i < pagination.pageSizes.length; i++) {
  //     accumulator += pagination.pageSizes[i];
  //   }
  //   return accumulator;
  // }

}
