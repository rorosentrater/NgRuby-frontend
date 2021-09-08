import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { TestapiComponent } from './components/testapi/testapi.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WebsocketComponent } from './components/websocket/websocket.component';
import { ComponentCommunicationComponent } from './components/component-communication/component-communication.component';
import { ChildComponent } from './components/component-communication/child/child.component';
import { PipeComponent } from './components/pipe/pipe.component';
import { ButtsPipe } from './pipes/butts.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestapiComponent,
    HeaderComponent,
    FooterComponent,
    WebsocketComponent,
    ComponentCommunicationComponent,
    ChildComponent,
    PipeComponent,
    ButtsPipe
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
