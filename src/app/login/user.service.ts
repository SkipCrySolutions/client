import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  public login(user: any) {
    const url = '/api/users/login';
    return this.http.post(url, user);
  }

  public getUserById(id: string, customerCode: string) {
    const url = `/api/users/get/${id}/${customerCode}`;
    return this.http.get(url);
  }

  public signup(user: any) {
    const url = `/api/users/signup`;
    return this.http.post(url, user);
  }

  public editUser(user: any) {
    const url = `/api/users/edit/${user._id}`;
    return this.http.put(url, user);
  }
}
