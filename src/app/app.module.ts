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
import { ServiceComm1Component } from './components/component-service-communication/parent-child/service-comm1/service-comm1.component';
import { ServiceComm2Component } from './components/component-service-communication/parent-child/service-comm2/service-comm2.component';
import { UnrelatedComponent } from './components/component-service-communication/component-component/unrelated/unrelated.component';
import { CtoCComponent } from './components/component-service-communication/component-component/cto-c/cto-c.component';
import { Unrelated2Component } from './components/component-service-communication/component-component/unrelated2/unrelated2.component';
import { ChimeComponent } from './components/chime/chime/chime.component';

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
    ButtsPipe,
    ServiceComm1Component,
    ServiceComm2Component,
    UnrelatedComponent,
    CtoCComponent,
    Unrelated2Component,
    ChimeComponent
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
