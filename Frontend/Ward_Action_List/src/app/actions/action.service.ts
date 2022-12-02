import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { action } from '../action.model';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  Base_Url:string = 'https://localhost:7132/api/Actions';
  Actions:action[] = [];
  actionChangedEvent = new Subject<action[]>();

  constructor(private http:HttpClient) { 
    this.getActions();
  }

  getActions(){
    this.http.get<action[]>(this.Base_Url).subscribe(
      response => {
        console.log(response);
        this.Actions = response.map(item => {
          return new action(item.Id, new Date(), item.Email, item.Calling, item.UserName, item.Email, item.Details);
        });
        this.actionChangedEvent.next(this.Actions.slice());
      }
    )
  }
}
