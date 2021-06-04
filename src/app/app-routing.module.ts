import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestapiComponent } from './testapi/testapi.component';
import { WebsocketComponent } from './websocket/websocket.component';



const routes: Routes = [
  // { path: 'octoprint-alexa', component: OctoprintComponent },
  // { path: 'octoprint-alexa/privacy', component: OctoprintPrivacyComponent },
  // { path: 'octoprint-alexa/tos', component: OctoprintTosComponent },
  // { path: 'scotts-appliance', component: ScottsapplianceComponent },
  // { path: 'hire-me', component: EmailMeComponent },

  { path: 'test-api', component: TestapiComponent },
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
