import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Action } from '../../action.model';
import { ActionService } from '../../action.service';

@Component({
  selector: 'app-update-action',
  templateUrl: './update-action.component.html',
  styleUrls: ['./update-action.component.css']
})
export class UpdateActionComponent implements OnInit {

  Id: string = '';
  OriginalAction: Action = new Action('', new Date(), '', '', '', '', null);
  Action: Action = new Action('', new Date(), '', '', '', '', null);

  constructor(private router: Router, private route: ActivatedRoute, private actionService: ActionService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.Id = params['id'];
        const result: Action | undefined = this.actionService.getAction(this.Id);
        if (!result) {
          this.router.navigate(['ward-view']);
          return;
        }
        this.OriginalAction = result;
        if (!this.OriginalAction) {
          return;
        }
        this.Action = JSON.parse(JSON.stringify(this.OriginalAction));
      }
    );
  }

  onSubmit(form: NgForm) {
    const newAction = new Action(this.Id, this.OriginalAction.Timestamp, form.value.email, form.value.calling, form.value.userName, form.value.ministerName, form.value.details);
    this.actionService.updateAction(this.OriginalAction, newAction);
    this.router.navigate(['ward-view']);
  }

  onCancel(){
    this.router.navigate(['ward-view']);
  }
}
