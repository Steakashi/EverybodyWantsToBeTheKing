import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'

import { AppComponent } from './app.component';

import { WebsocketService } from './services/websocket.service';
import { HomeComponent } from './home/home.component';
import { LobbyQueriesService } from './services/lobby/lobby-queries.service';
import { LobbyResponsesService } from './services/lobby/lobby-responses.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'room', component: RoomComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: '', component: HomeComponent },
  { path: 'not-found', component: HomeComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    WebsocketService,
    LobbyQueriesService,
    LobbyResponsesService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
