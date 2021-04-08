import {EventEmitter, Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService
{
  private socket: Socket;

  constructor()
  {
    this.socket = io('ws://localhost:3000');
  }

  public raise<T>(event: string, data: T): void
  {
    this.socket.emit(event, data);
  }

  public on<T>(event: string): EventEmitter<T>
  {
    const r = new EventEmitter<T>();
    this.socket.on(event, data => r.emit(data));
    return r;
  }

  public observe<T>(event: string): Observable<T>
  {
    return new Observable<T>(
      observer =>
      {
        this.socket.on(event, (data) =>
        {
          observer.next(data);
        });
      });
  }
}
