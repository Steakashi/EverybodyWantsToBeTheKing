import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';

import { AuthGuardService } from './services/auth-guard.service';
import { WebsocketService } from './services/websocket.service';
import { HomeComponent } from './home/home.component';
import { LobbyService } from './services/lobby.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'room', canActivate: [AuthGuardService], component: RoomComponent },
  { path: 'room/:id', canActivate: [AuthGuardService], component: RoomComponent },
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
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthGuardService,
    WebsocketService,
    LobbyService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
