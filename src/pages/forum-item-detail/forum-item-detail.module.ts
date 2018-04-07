import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumItemDetailPage } from './forum-item-detail';

@NgModule({
  declarations: [
    ForumItemDetailPage
  ],
  imports: [
    IonicPageModule.forChild(ForumItemDetailPage)
  ]
})
export class ForumItemDetailPageModule {}
