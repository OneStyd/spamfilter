import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AppService]
})
export class HeaderComponent implements OnInit {
  public username: any;
  public useremail: any;
  public userphoto: any;

  constructor(
    private DataService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.username = this.DataService.username;
    this.useremail = this.DataService.useremail;
    this.userphoto = '../../assets/img/' + this.DataService.userphoto;
  }

  setUser(username, useremail, userphoto) {
    localStorage.setItem('username', username);
    localStorage.setItem('useremail', useremail);
    localStorage.setItem('userphoto', userphoto);
    window.location.reload();
  }

  logout() {
    swal(
      'Oops...',
      'This function is not implemented yet!',
      'error'
    );
  }

}
