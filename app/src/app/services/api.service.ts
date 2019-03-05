import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    public base: string = 'https://freedomchoiceglobal.com/api/agent/';
    public signupUrl: string = this.base + 'signup.php';
    private loginUrl: string = this.base + 'login.php';

    private headers: any = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };

  constructor(
      public http: HttpClient
  ) { }

  login(data) {
      return this.http.post(this.loginUrl, data, this.headers);
  }

  signup(data){
      return this.http.post(this.signupUrl, data, this.headers);
  }
}
