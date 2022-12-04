import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Action } from './action.model';

interface responseType {
  id: string,
  timestamp: string,
  email: string,
  calling: string,
  userName: string,
  ministerName: string,
  details: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  Base_Url: string = 'https://localhost:7132/api/Actions/';
  Actions: Action[] = [];
  actionChangedEvent = new Subject<Action[]>();
  
  constructor(private http: HttpClient) {
    this.getActions();
  }
  
  getActions() {
    this.http.get<responseType[]>(this.Base_Url).subscribe((response:responseType[])=>{
      this.Actions = response.map(item => {
        return this.ResponseToAction(item);
      })
      this.sortAndSend();
    })
  }
  
  getAction(id: string) : Action | undefined {
    this.getActions();
    return this.Actions.find(item => {
      return item.Id === id;
    })
  }
  
  updateAction(OriginalAction: Action, newAction: Action) {
    if(!OriginalAction || !newAction){
      return;
    }

    const pos = this.Actions.findIndex(d => d.Id === OriginalAction.Id);

    if(pos < 0){
      return;
    }

    newAction.Id = OriginalAction.Id;
    newAction.Timestamp = OriginalAction.Timestamp;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.Base_Url + newAction.Id,
     this.ActionToResponse(newAction),
      { headers: headers})
      .subscribe(
        (response) => {
          this.Actions[pos] = newAction;
          this.sortAndSend();
        }
      )
  }

  DeleteAction(Id: string) {
    const pos = this.Actions.findIndex(d => d.Id == Id);
    
    if(pos < 0){
      return;
    }
    
    this.http.delete(this.Base_Url + Id).subscribe(
      (response) => {
        this.Actions.splice(pos, 1);
        this.sortAndSend();
      }
      )
    }
    
    addAction(newAction: Action) {
      if(!newAction){
        return;
      }
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      const sendItem:responseType = this.ActionToResponse(newAction);
      this.http.post<responseType>(this.Base_Url, sendItem, { headers: headers }).subscribe(
        (responseData) => {
          this.Actions.push(this.ResponseToAction(responseData));
          this.sortAndSend();
          //this.Actions.push(responseData);
          //this.sortAndSend;
        }
      )
    }

    sortAndSend() {
      this.Actions.sort((a, b) =>
      a.Timestamp < b.Timestamp ? 1 : b.Timestamp < a.Timestamp ? -1 : 0
      );
      this.actionChangedEvent.next(this.Actions.slice());
    }

    ActionToResponse(action:Action){
      let response:responseType= {
        id : action.Id,
        timestamp : action.Timestamp.toISOString(),
        email : action.Email,
        calling : action.Calling,
        userName : action.UserName,
        ministerName : action.MinisterName,
        details : action.Details
      }
      return response;
    }

    ResponseToAction(item:responseType){
      const action = new Action(item.id, new Date(item.timestamp), item.email, item.calling, item.userName, item.ministerName, item.details);
      //console.log(action);
      return action;
    }
    
  }
  