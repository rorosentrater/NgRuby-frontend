import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestapiComponent } from './testapi/testapi.component';
import { WebsocketComponent } from './websocket/websocket.component';
import { ComponentCommunicationComponent } from './component-communication/component-communication.component';



const routes: Routes = [

  { path: 'test-api', component: TestapiComponent },
  { path: 'component-communication', component: ComponentCommunicationComponent },
  { path: 'websocket-chat', component: WebsocketComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route for www.site.com
  { path: '**', redirectTo: '/home'} // Redirects any unknown url to home. MUST BE LAST
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
