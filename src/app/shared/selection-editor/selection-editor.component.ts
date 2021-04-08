import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-selection-editor',
  templateUrl: './selection-editor.component.html',
  styleUrls: ['./selection-editor.component.scss']
})
export class SelectionEditorComponent implements OnInit
{
  @Input()
  cid = '';
  @Input()
  selections: string[] = [];
  @Input()
  value = '';
  @Output()
  valueChange = new EventEmitter<string>();

  constructor()
  {
  }

  ngOnInit(): void
  {
    if (!this.value || this.selections.indexOf(this.value) < 0)
    {
      this.value = this.selections[0];
      this.valueChange.emit(this.value);
    }

  }
}
