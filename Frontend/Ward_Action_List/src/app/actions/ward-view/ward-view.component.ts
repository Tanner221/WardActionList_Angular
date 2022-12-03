import { Component, OnInit } from '@angular/core';
import { Action } from '../action.model';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-ward-view',
  templateUrl: './ward-view.component.html',
  styleUrls: ['./ward-view.component.css']
})
export class WardViewComponent implements OnInit {
  Actions: Action[] = []
  constructor(private actionService: ActionService) { }
  
  ngOnInit(): void {
    this.actionService.actionChangedEvent.subscribe(result => {
      this.Actions = result;
    }
    )
    this.actionService.getActions();
  }
  
  onDelete(Id: string) {
    this.actionService.DeleteAction(Id);
  }
}
