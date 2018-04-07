import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumNewtopicPage } from './forum-newtopic';

@NgModule({
  declarations: [
    ForumNewtopicPage
  ],
  imports: [
    IonicPageModule.forChild(ForumNewtopicPage)
  ]
})
export class NewtopicPageModule {}
