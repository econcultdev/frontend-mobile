import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  transform(url): Observable<SafeUrl> {
    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)),
        catchError(<T>(error: any, result?: T) => {
          console.log(error);
          return of(result as T);
        })
      ));
  }

}
