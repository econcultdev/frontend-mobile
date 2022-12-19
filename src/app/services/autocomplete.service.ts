import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { map } from 'rxjs/operators';
import { myInitObject } from '../config/config';

/*
@Injectable({
  providedIn: 'root'
})
*/
@Injectable()
export class ACompleteService implements AutoCompleteService, OnDestroy {

  apiUrl = myInitObject.apiUrl;

  labelAttribute = 'nombre';
  formValueAttribute = 'nombre';
  private data: any = { 'paises': [], 'provincias': [], 'ciudades': [] };
  private table = 'paises';
  private parentId = 0;
  private labelParentId = '';
  private ids = { 'pais': 0, 'provincia': 0, 'ciudad': 0 };

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    this.data = { 'paises': [], 'provincias': [], 'ciudades': [] };
  }

  setData(table: string, parentId: number, labelParentId: string) {
    this.table = table;
    this.parentId = parentId;
    this.labelParentId = labelParentId;
  }

  getResults(keyword: string): Observable<any[]> {
    let observable: Observable<any>;
    // console.log(keyword);
    if (this.data[this.table].length === 0) {
      switch (this.table) {
        case 'paises':
          observable = this.http.get(this.apiUrl + 'paises');
          break;
        case 'provincias':
          observable = this.http.get(this.apiUrl + 'provincias');
          break;
        case 'ciudades':
          observable = this.http.get(this.apiUrl + 'ciudades');
          break;
      }
    } else {
      observable = of(this.data[this.table]);
    }

    return observable.pipe(
      map(
        (result) => {
          if (this.data[this.table].length === 0) {
            this.data[this.table] = result;
          }
          if (keyword !== '') {
            const keyw = keyword.toLowerCase();
            const arr = result.filter(
              (item, index, arr) => {
                // arr[index]['idStr'] = item.id + '';
                return (this.parentId && this.labelParentId) ?
                  item[this.labelParentId] === this.parentId &&
                  item.nombre.toLowerCase().startsWith(keyw)
                  :
                  item.nombre.toLowerCase().startsWith(keyw)
              }
            );
            // console.log(arr);
            return arr;
          } else {
            return [];
          }
        }
      )
    );
  }

}
