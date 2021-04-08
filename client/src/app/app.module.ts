import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import {SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {MessagesComponent} from './messages/messages.component';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {EditStringDialogComponent} from './shared/edit-string-dialog/edit-string-dialog.component';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogComponent} from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MessagesComponent,
    HomeComponent,
    GameComponent,
    LayoutComponent,
    EditStringDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot({
      url: `${environment.server}:${environment.serverPort}`
    }),
    NgbToastModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
