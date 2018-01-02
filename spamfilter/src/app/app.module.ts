import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ReadComponent } from './read/read.component';
import { ComposeComponent } from './compose/compose.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { InboxComponent } from './inbox/inbox.component';
import { SentComponent } from './sent/sent.component';
import { SpamComponent } from './spam/spam.component';
import { TrashComponent } from './trash/trash.component';
import { NoContentComponent } from './no-content/no-content.component';


@NgModule({
  declarations: [
    AppComponent,
    ReadComponent,
    ComposeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    InboxComponent,
    SentComponent,
    SpamComponent,
    TrashComponent,
    NoContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: InboxComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'sent', component: SentComponent },
      { path: 'spam', component: SpamComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'read/:id', component: ReadComponent },
      { path: '**', component: NoContentComponent }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
