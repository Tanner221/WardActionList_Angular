import { Component, OnInit } from '@angular/core';
import { action } from '../action.model';
import { ActionService } from '../actions/action.service';

@Component({
  selector: 'app-ward-view',
  templateUrl: './ward-view.component.html',
  styleUrls: ['./ward-view.component.css']
})
export class WardViewComponent implements OnInit {
  Actions: action[] = []
  constructor(private actionService: ActionService) { }

  ngOnInit(): void {
    this.actionService.actionChangedEvent.subscribe(result => {
      this.Actions = result;
      console.log(this.Actions);
      console.log(this.Actions[0].Timestamp);
      console.log(new Date())
    }
    )
  }

}
