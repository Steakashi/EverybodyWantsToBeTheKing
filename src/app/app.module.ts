import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { WebsocketService } from './services/websocket.service';
import { HomeComponent } from './home/home.component';
import { LobbyService } from './services/lobby.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WebsocketService,
    LobbyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
