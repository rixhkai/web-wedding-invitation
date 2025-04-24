import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Comment } from 'src/app/_model/data';
import { DataService } from 'src/services/data/data.service';
import { UtilityService } from 'src/services/utility/utility.service';
import { WebSocketService } from 'src/services/websocket/websocket.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [NgFor, IonButton, IonIcon, FormsModule, NgIf]
})
export class CommentsComponent  implements OnInit {

  @Input() userId: string | undefined | null = null;
  comment = '';

  page: number = 1;
  totalPage: number = 1;
  commentList: Array<Comment> = [];
  constructor(
    private data: DataService,
    public utility: UtilityService,
    private websocket: WebSocketService
  ) { }

  ngOnInit() {
    this.initComment();
    this.websocket.getMessages().subscribe({
      next: (res) => {
        console.log('res get messages web socket ', res)
        if (res && res.data) {
          this.commentList.unshift(res.data);
        }
      }
    })
  }

  initComment(type = 'init') {
    if (type == 'init') {
      this.page = 1;
      this.totalPage = 1;
    }
    const body = {
      page: this.page
    }
    this.data.getCommentList(body).subscribe({
      next: (res: any) => {
        console.log('res get comment ', res)
        this.page++;
        this.totalPage = res.pagination.total_page;
        if (type == 'init') {
          this.commentList = res.data;
        } else {
          this.commentList = this.commentList.concat(res.data);
        }
      },
      error: (err: any) => {
        console.log('err get comment ', err)
      }
    })
  }

  submit() {
    const body = {
      comment: this.comment,
      user_id: this.userId
    }
    this.data.createComment(body).subscribe({
      next: (res: any) => {
        console.log('res creating comment ', res)
        this.comment = '';
        // this.commentList.unshift(res.data);
      },
      error: (err: any) => {
        console.log('err creating comment ', err)
      }
    })
  }
}
