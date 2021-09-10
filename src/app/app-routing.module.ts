import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TestapiComponent } from './components/testapi/testapi.component';
import { WebsocketComponent } from './components/websocket/websocket.component';
import { ComponentCommunicationComponent } from './components/component-communication/component-communication.component';
import { PipeComponent } from './components/pipe/pipe.component';
import { ServiceComm1Component } from './components/component-service-communication/parent-child/service-comm1/service-comm1.component'
import { CtoCComponent } from './components/component-service-communication/component-component/cto-c/cto-c.component'



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'test-api', component: TestapiComponent },
  { path: 'websocket-chat', component: WebsocketComponent },
  { path: 'component-communication', component: ComponentCommunicationComponent },
  { path: 'pipe', component: PipeComponent },
  { path: 'service-state-communication', component: ServiceComm1Component },
  { path: 'component-service-component', component: CtoCComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route for www.site.com
  { path: '**', redirectTo: '/home'} // Redirects any unknown url to home. MUST BE LAST
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
