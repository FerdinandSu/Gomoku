import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit
{
  @Input()
  target!: string;
  @Input()
  expression!: string;
  @Input()
  cid!: string;
  @Output()
  public confirmed = new EventEmitter();
  @Output()
  public canceled = new EventEmitter();
  constructor()
  {
  }

  ngOnInit(): void
  {
  }

}
