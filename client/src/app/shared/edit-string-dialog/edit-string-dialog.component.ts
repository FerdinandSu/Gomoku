/*
Copyright 2020 ReFreSH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-edit-string-dialog',
  templateUrl: './edit-string-dialog.component.html',
  styleUrls: ['./edit-string-dialog.component.css']
})
export class EditStringDialogComponent implements OnInit
{

  @Input()
  DefaultValue: string | undefined;

  value!: string;
  @Input()
  ComponentId!: string;
  @Input()
  ValueTypeName!: string;
  @Output()
  public ValueSubmitted = new EventEmitter<string>();


  constructor()
  {
  }

  ngOnInit(): void
  {
    if (this.DefaultValue)
    {
      this.value = this.DefaultValue;
    }
    else
    {
      this.value = '';
    }
  }

}
