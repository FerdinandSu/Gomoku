import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountService} from '../../services/web/account.service';
import {MessageService} from '../../services/message.service';

@Component({
  selector: 'app-sudo-confirm-dialog',
  templateUrl: './sudo-confirm-dialog.component.html',
  styleUrls: ['./sudo-confirm-dialog.component.scss']
})
export class SudoConfirmDialogComponent implements OnInit
{
  @Input()
  target!: string;
  @Input()
  expression!: string;
  @Input()
  cid!: string;
  @Output()
  public confirmed = new EventEmitter<string>();
  username = '';
  password = '';

  constructor(private account: AccountService,
              private msg: MessageService)
  {
  }

  ngOnInit(): void
  {
  }

  confirm(): void
  {
    this.account.getToken(this.password, this.target)
      .subscribe(r =>
      {
        if (r.length > 0)
        {
          this.confirmed.emit(r);
          // @ts-ignore
          $('#' + this.cid).modal('hide');
        }
        else
        {
          this.msg.addError('权限确认失败。');
        }
      });
  }
}
