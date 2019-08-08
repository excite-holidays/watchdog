import { BackgroundImageComponent } from './background-image/background-image.component';
import { logging } from 'protractor';
import { WatchersComponent } from './watchers/watchers.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store'
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppState } from './app.state';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from 'src/environments/environment';

const components = [
  WatchersComponent,
  BackgroundImageComponent,
];

@NgModule({
  declarations: [AppComponent, components],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
