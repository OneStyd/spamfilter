import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css'],
  providers: [AppService]
})
export class ReadComponent implements OnInit {
  private mailId: any;
  private mailContent: any;

  public setMail(isi){
    this.mailContent = isi;
  }

  constructor(
    private DataService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.mailId = params['id'];
    });
  }

  getEmailContent(id) {
    this.DataService.getRequest(this.DataService.urlDetailMail+ '?id=' + id)
    .subscribe(data =>{
      
        this.setMail(data.data);
        console.log(this.mailContent)
    })
  }

  ngOnInit() {
    this.getEmailContent(this.mailId);
  }

  deleteThis() {
    swal({
      title: 'Are you sure?',
      text: 'Deleted mail will be moved to Trash',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        console.log('deleted'); // change to delete function later
      }
    });
  }

  printThis() {
    swal(
      'Oops...',
      'This function is not implemented yet!',
      'error'
    );
  }

}
