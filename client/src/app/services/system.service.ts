import {EventEmitter, Injectable} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {Player} from '../models/player';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService
{


  constructor(private ws: WebSocketService,
              private msg: MessageService)
  {
    ws.observe<Player[]>('updatePlayers')
      .subscribe(p => this.players = p);
    ws.observe<Player>('setPlayer')
      .subscribe(p => this.me = p);
    ws.observe<string>('exception')
      .subscribe(exp => msg.addError(`出现意外！${exp}`));

    this.invited = ws.on('invite');
    this.invited.subscribe(
      (i: Player) => this.inviter = i
    );
    ws.observe<Player>('deny')
      .subscribe(p => msg.addWarning(`${p.name}拒绝了游戏请求。`));
    this.createGame = ws.on('createGame');
    this.createGame.subscribe(
      () =>
      {
        if (this.me)
        {
          this.me.inGame = true;
        }
      });
  }

  private static avatars: string[] = [
    'fa-user-astronaut',
    'fa-user-graduate',
    'fa-user-injured',
    'fa-user-md',
    'fa-user-ninja',
    'fa-user-nurse',
    'fa-user-secret',
  ];
  public players: Player[] = [];
  public me: Player | undefined;
  public invited: EventEmitter<Player>;
  public createGame: EventEmitter<Player>;

  inviter: Player | undefined;

  public changeName(newName: string): void
  {
    this.ws.raise('changeName', newName);
    if (this.me)
    {
      this.me.name = newName;
    }
  }

  public invite(player: Player): void
  {
    this.ws.raise('invite', player);
    this.msg.addOk('邀请已发送');
  }

  public deny(): void
  {
    this.ws.raise('deny', this.inviter);
  }

  public accept(): void
  {
    this.ws.raise('createGame', this.inviter);
  }

  public isMe(p: Player): boolean
  {
    return p.id === this.me?.id;
  }

  public getAvatar(i: number): string
  {
    const rnd = Math.floor(i % SystemService.avatars.length);
    return `fas ${SystemService.avatars[rnd]} player-avatar`;
  }
}
