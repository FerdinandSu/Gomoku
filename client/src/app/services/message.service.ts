import {Injectable} from '@angular/core';
import {Message} from '../models/message';
@Injectable({providedIn: 'root'})
export class MessageService
{
  messages: Message[] = [];

  add(message: string): void
  {
    this.messages.push({
      message,
      style: ''
    });
  }

  addInfo(message: string): void
  {
    this.messages.push({
      message,
      style: 'bg-info text-light'
    });
  }

  addOk(message = '操作成功'): void
  {
    this.messages.push({
      message,
      style: 'bg-success text-light'
    });
  }

  addError(message: string): void
  {
    this.messages.push({
      message,
      style: 'bg-danger text-light'
    });
  }

  addWarning(message: string): void
  {
    this.messages.push({
      message,
      style: 'bg-warning text-dark'
    });
  }

  remove(message: Message): void
  {
    this.messages = this.messages.filter(m => m !== message);
  }
}
