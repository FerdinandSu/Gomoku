import {Component, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';
import {SystemService} from '../services/system.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit
{
  msgBuf = '';

  constructor(public game: GameService,
              public system: SystemService)
  {
  }

  ngOnInit(): void
  {
  }

}
