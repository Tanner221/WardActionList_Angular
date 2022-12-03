import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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
        return new Action(item.id, new Date(item.timestamp), item.email, item.calling, item.userName, item.ministerName, item.details);
      })
      this.sortAndSend();
    })
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

  sortAndSend() {
    this.Actions.sort((a, b) =>
      a.Timestamp > b.Timestamp ? 1 : b.Timestamp > a.Timestamp ? -1 : 0
    );
    this.actionChangedEvent.next(this.Actions.slice());
  }

}
