import { Component } from '@angular/core';

import { ChatPage } from '../chat/chat';
import { CalendarPage } from '../calendar/calendar';
import { ForumPage } from '../forum/forum';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ForumPage;
  tab2Root = ChatPage;
  tab3Root = CalendarPage;
  tab4Root = AccountPage;

  

  constructor() {
  }
}
