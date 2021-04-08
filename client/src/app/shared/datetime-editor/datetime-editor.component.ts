import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PureDate} from 'src/app/models/common/pure-date';

@Component({
  selector: 'app-datetime-editor',
  templateUrl: './datetime-editor.component.html',
  styleUrls: ['./datetime-editor.component.scss']
})
export class DatetimeEditorComponent implements OnInit
{
  @Input()
  cid = '';
  @Input()
  defaultValue: PureDate = {
    year: 1970,
    month: 1,
    day: 1
  };
  @Input()
  value: PureDate | undefined = undefined;
  @Output()
  valueChange = new EventEmitter<PureDate>();

  constructor()
  {
  }

  ngOnInit(): void
  {
    if (this.value === undefined)
    {
      this.value = this.defaultValue;
    }
  }

}
