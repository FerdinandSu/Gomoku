import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-switch-editor',
  templateUrl: './switch-editor.component.html',
  styleUrls: ['./switch-editor.component.scss']
})
export class SwitchEditorComponent implements OnInit
{

  @Input()
  cid = '';

  selections: string[] = [
    '是',
    '否'
  ];
  @Input()
  value = false;

  valueRaw = '--选择--';

  @Output()
  valueChange = new EventEmitter<boolean>();

  constructor()
  {
  }

  ngOnInit(): void
  {
    this.valueRaw = this.value ? '是' : '否';
  }

}
