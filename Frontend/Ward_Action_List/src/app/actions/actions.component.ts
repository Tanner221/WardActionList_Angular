import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Action } from './action.model';
import { ActionService } from './action.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  
  constructor(private actionService:ActionService, private router:Router) { }
  
  ngOnInit(): void {
  }
  
  onSubmit(form: NgForm) {
    const newAction = new Action('', new Date(), form.value.email, form.value.calling, form.value.userName, form.value.ministerName, form.value.details);
    this.actionService.addAction(newAction);
    this.router.navigate(['']);
  }
}
