import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
  styleUrls: ['./information-card.component.scss']
})
export class InformationCardComponent implements OnInit
{

  @Input()
  title = '';


  constructor()
  {
  }

  ngOnInit(): void
  {
  }

}
