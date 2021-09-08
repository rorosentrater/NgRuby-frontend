import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { TestapiComponent } from './testapi/testapi.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WebsocketComponent } from './websocket/websocket.component';
import { ComponentCommunicationComponent } from './component-communication/component-communication.component';
import { ChildComponent } from './component-communication/child/child.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestapiComponent,
    HeaderComponent,
    FooterComponent,
    WebsocketComponent,
    ComponentCommunicationComponent,
    ChildComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
