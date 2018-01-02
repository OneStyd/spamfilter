import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [AppService]
})
export class SidebarComponent implements OnInit {
  public username: any;
  public useremail: any;
  public unreadInbox: any;
  public unreadSpam: any;

  constructor(
    private DataService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.username = this.DataService.username;
    this.username = this.DataService.useremail;
    this.unreadInbox = this.DataService.countUnreadInbox();
    this.unreadSpam = this.DataService.countUnreadSpam();
  }

}
