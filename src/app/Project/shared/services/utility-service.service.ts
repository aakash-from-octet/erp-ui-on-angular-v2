import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  data;

  private pannelArraySubject = new BehaviorSubject<unknown>('');
  pannelArray$ = this.pannelArraySubject.asObservable();

  setPannelTerm(term: string): void {
    this.pannelArraySubject.next(term);
  }
  getPannelTerm() {
    return this.pannelArray$;
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }
  private columnFilters: { [key: string]: BehaviorSubject<string> } = {};

  setFilter(column: string, filter: string): void {
    if (!this.columnFilters[column]) {
      this.columnFilters[column] = new BehaviorSubject<string>('');
    }
    this.columnFilters[column].next(filter);
  }
  getFilter(column: string): BehaviorSubject<string> {
    if (!this.columnFilters[column]) {
      this.columnFilters[column] = new BehaviorSubject<string>('');
    }
    return this.columnFilters[column];
  }
  setData(data): void {
    this.data = data;
  }
  getData() {
    return this.data;
  }

  getValueArray(listOfData, keyName: string): string[] {
    const valueSet = new Set<string>();
    if (!keyName.includes('.')) {
      listOfData?.forEach((item) => {
        valueSet.add(item[keyName]);
      });
    } else {
      const keySet: string[] = keyName.split('.');
      listOfData?.forEach((item) => {
        if (item[keySet[0]]) {
          if (typeof item[keySet[0]] === 'object') {
            const innerList = item[keySet[0]];
            const innerName = keySet[1];

            valueSet.add(innerList[innerName]);
          }
        }
      });
    }
    return Array.from(valueSet);
  }

  search(
    listOfData,
    searchString: string,
    keyName: string,
    currentPageIndex: number,
    pageSize: number
  ) {
    if (!keyName.includes('.')) {
      return listOfData
        .filter((item) =>
          item[keyName].toLowerCase().includes(searchString.toLowerCase())
        )
        .slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);
    } else {
      const keySet: string[] = keyName.split('.');
      return listOfData
        .filter((item) =>
          item[keySet[0]][keySet[1]]
            .toLowerCase()
            .includes(searchString.toLowerCase())
        )
        .slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);
    }
  }

  sort(
    listOfData,
    sortOrder: string,
    keyName: string,
    currentPageIndex: number,
    pageSize: number
  ) {
    if (sortOrder === 'asc') {
      if (!keyName.includes('.')) {
        return listOfData
          .slice()
          .sort(function (a, b) {
            if (a[keyName] && b[keyName]) {
              if (
                String(a[keyName]).toLowerCase() <
                String(b[keyName]).toLowerCase()
              ) {
                return -1;
              }
              if (
                String(a[keyName]).toLowerCase() >
                String(b[keyName]).toLowerCase()
              ) {
                return 1;
              }
            }
            if (a[keyName]) {
              return -1;
            }
            if (b[keyName]) {
              return 1;
            }
            return 0;
          })
          .slice(
            (currentPageIndex - 1) * pageSize,
            currentPageIndex * pageSize
          );
      } else {
        const keySet: string[] = keyName.split('.');
        return listOfData
          .slice()
          .sort(function (a, b) {
            if (a[keySet[0]] && b[keySet[0]]) {
              if (
                typeof a[keySet[0]] === 'object' &&
                typeof b[keySet[0]] === 'object'
              ) {
                const aInnerList = a[keySet[0]];
                const bInnerList = b[keySet[0]];
                const innerName = keySet[1];
                if (aInnerList[innerName] && bInnerList[innerName]) {
                  if (
                    String(a[keySet[0]][keySet[1]]).toLowerCase() <
                    String(b[keySet[0]][keySet[1]]).toLowerCase()
                  ) {
                    return -1;
                  }
                  if (
                    String(a[keySet[0]][keySet[1]]).toLowerCase() >
                    String(b[keySet[0]][keySet[1]]).toLowerCase()
                  ) {
                    return 1;
                  }
                }
                if (aInnerList[innerName]) {
                  return -1;
                }
                if (bInnerList[innerName]) {
                  return 1;
                }
              }
            }
            if (a[keySet[0]]) {
              return -1;
            }
            if (b[keySet[0]]) {
              return 1;
            }
            return 0;
          })
          .slice(
            (currentPageIndex - 1) * pageSize,
            currentPageIndex * pageSize
          );
      }
    } else {
      if (!keyName.includes('.')) {
        return listOfData
          .slice()
          .sort(function (a, b) {
            if (a[keyName] && b[keyName]) {
              if (
                String(a[keyName]).toLowerCase() >
                String(b[keyName]).toLowerCase()
              ) {
                return -1;
              }
              if (
                String(a[keyName]).toLowerCase() <
                String(b[keyName]).toLowerCase()
              ) {
                return 1;
              }
            }
            if (a[keyName]) {
              return 1;
            }
            if (b[keyName]) {
              return -1;
            }
            return 0;
          })
          .slice(
            (currentPageIndex - 1) * pageSize,
            currentPageIndex * pageSize
          );
      } else {
        const keySet: string[] = keyName.split('.');
        return listOfData
          .slice()
          .sort(function (a, b) {
            if (a[keySet[0]] && b[keySet[0]]) {
              if (
                typeof a[keySet[0]] === 'object' &&
                typeof b[keySet[0]] === 'object'
              ) {
                const aInnerList = a[keySet[0]];
                const bInnerList = b[keySet[0]];
                const innerName = keySet[1];
                if (aInnerList[innerName] && bInnerList[innerName]) {
                  if (
                    String(a[keySet[0]][keySet[1]]).toLowerCase() >
                    String(b[keySet[0]][keySet[1]]).toLowerCase()
                  ) {
                    return -1;
                  }
                  if (
                    String(a[keySet[0]][keySet[1]]).toLowerCase() <
                    String(b[keySet[0]][keySet[1]]).toLowerCase()
                  ) {
                    return 1;
                  }
                }
                if (aInnerList[innerName]) {
                  return -1;
                }
                if (bInnerList[innerName]) {
                  return 1;
                }
              }
            }
            if (a[keySet[0]]) {
              return 1;
            }
            if (b[keySet[0]]) {
              return -1;
            }
            return 0;
          })
          .slice(
            (currentPageIndex - 1) * pageSize,
            currentPageIndex * pageSize
          );
      }
    }
  }

  manageFilterState(
    filterState: Map<string, string[]>,
    filterValue: string,
    columnName: string
  ): Map<string, string[]> {
    if (filterState.has(columnName)) {
      let currentColumnState: string[] = filterState.get(columnName);
      if (currentColumnState.indexOf(String(filterValue).toLowerCase()) > -1) {
        currentColumnState.splice(
          currentColumnState.indexOf(String(filterValue).toLowerCase()),
          1
        );
      } else {
        currentColumnState.push(String(filterValue).toLowerCase());
        currentColumnState = Array.from(new Set<string>(currentColumnState));
      }
      filterState.set(columnName, currentColumnState);
    } else {
      filterState.set(columnName, [String(filterValue).toLowerCase()]);
    }
    return filterState;
  }

  filter(
    listOfData,
    filterState: Map<string, string[]>,
    filterValue: string,
    columnName: string,
    currentPageIndex: number,
    pageSize: number
  ) {
    if (!columnName.includes('.')) {
      return listOfData
        .filter((item) => {
          if (columnName === 'isActive' || columnName === 'enabled') {
            return (
              filterState
                .get(columnName)
                .indexOf(String(item[columnName]).toLowerCase()) > -1
            );
          }
          if (item[columnName]) {
            return (
              filterState
                .get(columnName)
                .indexOf(String(item[columnName]).toLowerCase()) > -1
            );
          }
          return false;
        })
        .slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);
    } else {
      const keySet: string[] = columnName.split('.');
      return listOfData
        .filter((item) => {
          if (item[keySet[0]]) {
            if (typeof item[keySet[0]] === 'object') {
              const innerList = item[keySet[0]];
              const innerName = keySet[1];
              if (innerList[innerName]) {
                return (
                  filterState
                    .get(columnName)
                    .indexOf(String(innerList[innerName]).toLowerCase()) > -1
                );
              }
              return false;
            }
          }
          return false;
        })
        .slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);
    }
  }

  filterTable(listOfData, searchTerm: string) {
    return listOfData.filter((entry) =>
      Object.keys(entry).some((key) => {
        const value = entry[key];
        const stringValue = typeof value !== 'string' ? String(value) : value;

        return (
          (typeof stringValue === 'string' &&
            stringValue.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (typeof value === 'object' &&
            value !== null &&
            Object.values(value).some((subValue) =>
              typeof subValue !== 'string'
                ? String(subValue)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                : subValue.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
      })
    );
  }
}
