import {Component, OnInit} from '@angular/core';
import {BoardService} from '../services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor(private board: BoardService) {
  }

  ngOnInit(): void {
    this.board.canvas = document.getElementById('board-area') as HTMLCanvasElement;
    if (!this.board.canvas) {
      throw new Error('board-area Canvas Element NOT FOUND.');
    }
    this.board.initialize();

  }

}
