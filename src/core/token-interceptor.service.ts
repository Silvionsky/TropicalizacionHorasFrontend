import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {TokenService} from './token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  /**
   * Intercepts outgoing http packets and adds the authorization headers if the user's session is valid
   * @param request the http request that will be modified if the session is valid
   * @param next the http handler for the outgoing request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(of(this.tokenService.getToken())
      .pipe(
        switchMap(token => {
          if (!token) { // if the session is not valid, do not add any headers
            return next.handle(request);
          }
          if (request.url.includes(environment.serverUrl) ) {
            const headers = request.headers
              .set('Authorization', 'Bearer ' + token);
            const requestClone = request.clone({
              headers
            });
            return next.handle(requestClone);
          } else {
            return next.handle(request);
          }
        })
      )
    );
  }

}
