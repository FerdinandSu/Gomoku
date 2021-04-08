import {Component, OnInit} from '@angular/core';
import {SystemService} from '../services/system.service';
import {ModalJQuery} from '../models/elements/html-modal-element';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{

  constructor(public system: SystemService,
              private game: GameService,
              private router: Router)
  {
    system.invited.subscribe(() =>
    {
      ($('#accept-invitation-dialog') as ModalJQuery).modal('show');
    });
  }

  ngOnInit(): void
  {
  }

}
