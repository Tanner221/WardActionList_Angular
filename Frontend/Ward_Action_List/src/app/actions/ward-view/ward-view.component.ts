import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../action.model';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-ward-view',
  templateUrl: './ward-view.component.html',
  styleUrls: ['./ward-view.component.css']
})
export class WardViewComponent implements OnInit {
  Actions: Action[] = []
  constructor(private actionService: ActionService, private router:Router, private route: ActivatedRoute) { }
  
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

  onUpdate(Id: string) {
    this.router.navigate([Id], { relativeTo: this.route, queryParamsHandling: 'preserve'});
  }
}
