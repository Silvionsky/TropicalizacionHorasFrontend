import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CustomResponse} from '../../models/custom-response.model';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<CustomResponse> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = '{' +
      ' "correoUsuario": "' + email + '",' +
      ' "contrasenna": "' + password + '"' +
      '}';
    return this.http.post<CustomResponse>(environment.serverUrl + '/autenticar/sign-in', body, {headers});
  }

  public validateToken(token: string) {
    const params = new HttpParams().set('token', token);
    return this.http.get<CustomResponse>(environment.serverUrl + '/autenticar/validar', {params});
  }
}
