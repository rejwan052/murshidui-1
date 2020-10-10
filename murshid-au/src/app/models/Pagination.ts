
export class Pagination {

  hasPrevious =  false;

  hasNext =  false;

  /**
   * visible plages with their numbers
   */
  pages: number[] = [];

  /**
   * Visible pages' sizes
   */
  pageSizes: number[] = [];

  /**
   * 0-based starting, in relation to the array of pages
   */
  activePageIndex = 0;

  /**
   * 0- based element index (of all elements) in which the first page of the paginator starts
   */
  absolutePageStart = 0;

  /**
   * 0- based element index (of all elements) in which the last page ends
   */
  absolutePageEnd = 0;


  itemCount = 0;


  toString() {
    return 'hasPrevious=' + this.hasPrevious + ' hasNext=' + this.hasNext + ' pages=' + this.pages + ' pageSizes=' + this.pageSizes
      + ' activePageIndex=' + this.activePageIndex + ' absolutePageStart=' + this.absolutePageStart + ' itemCount=' + this.itemCount;
  }

}
