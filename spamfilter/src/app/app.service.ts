import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable,  Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';
import swal from 'sweetalert2';



@Injectable()
export class AppService {
  public base_url = "http://localhost:3000/"

  public urlGetInbox = this.base_url + 'mail/inbox';
  public urlGetSpam = this.base_url + 'mail/spam';
  public urlGetSentMail = this.base_url + 'mail/sentmail';
  public urlSendMail = this.base_url + 'mail/sendmail';
  public urlDetailMail = this.base_url + 'mail/maildetail';

  public username = localStorage['username'] || 'Alexander Pierce';
  public useremail = localStorage['useremail'] || 'alex.pierce@gmail.com';
  public userphoto = localStorage['userphoto'] || 'avatar5.png';

  //sendmail
  public subject = '';
  public recipients = '';
  public textareaValue = '';

  private subscription: Subscription;


  public emails : any[] = [];

  constructor(private http: Http) { }

    /*{
      id: 1,
      senderName: 'Nadia Carmichael',
      recieverName: 'Alexander Pierce',
      sender: 'nadia.carmie@gmail.com',
      reciever: 'alex.pierce@gmail.com',
      title: 'Perkenalan',
      content: 'Halo, perkenalkan nama saya Nadia Carmichael. Saya baru saja mencoba aplikasi SpamFilter. Mohon kerja samanya.',
      date: '12/20/2017',
      status: 'normal',
      read: 'read'
    }*/
 

  getRequest(url){
    let response;
    let header = new Headers;
    header.append('Content-type', 'application/json')
    return this.http.get(url,{headers:header})
      .map((response:Response) =>
          response.json()
        )
  }

  postRequest(url){
    let response;
    let body = JSON.stringify({recipients: this.recipients, subject: this.subject, content: this.textareaValue, frommail: this.useremail});
    let header = new Headers;
    header.append('content-type','application/json')
    return this.http.post(url,body,{headers:header})
      .map((response:Response) =>
          response.json()
        )
  }

  sendEmail(body){
    this.postRequest(this.urlSendMail)
      .subscribe(
        data=>{
          if (data.status == true){
            this.sendSuccess();
          }
        })
  }

   sendSuccess() {
    swal(
      'Success!',
      'Message has been sent',
      'info'
    );
  }

  public setMail(isi){
    this.emails = isi;
  }



  

  getInboxEmails() {
    const listEmail = [];
    this.getRequest(this.urlGetInbox + '?recipients=' + this.useremail)
    .subscribe(data =>{
      this.emails = data.data
      this.emails.forEach(email => {
          email.read = 'unread';
          listEmail.push(email);
      });
      this.subscription = Observable.interval(1000).subscribe((x) => {
        this.setMail(listEmail);
        if (this.emails != null) {
          this.subscription.unsubscribe();
        }
      });

    })
    return listEmail;
  }

  getSentEmails() {
    const listEmail = [];
    this.getRequest(this.urlGetSentMail + '?frommail=' + this.useremail)
    .subscribe(data => {
      this.emails = data.data
      this.emails.forEach(email => {
          email.read = 'read';
          listEmail.push(email);
      });
       this.subscription = Observable.interval(1000).subscribe((x) => {
        this.setMail(listEmail);
        if (this.emails != null) {
          this.subscription.unsubscribe();
        }
      });
    })
    return listEmail;
  }

  getSpamEmails() {
    const listEmail = [];
    this.getRequest(this.urlGetSpam + '?recipients=' + this.useremail)
    .subscribe(data => {
      this.emails = data.data
      this.emails.forEach(email => {
        email.read = 'unread';
        listEmail.push(email);
      });
       this.subscription = Observable.interval(1000).subscribe((x) => {
        this.setMail(listEmail);
        if (this.emails != null) {
          this.subscription.unsubscribe();
        }
      });
    });
    return listEmail;
  }


  countUnreadInbox() {
    let unread = 0;
    this.emails.forEach(email => {
      if (email.frommail !== this.useremail) {
        if (email.typemail === 1) {
          if (email.read === 'unread') {
            unread++;
          }
        }
      }
    });
    if (unread > 0) {
      return unread;
    } else {
      return '';
    }
  }

  countUnreadSpam() {
    let unread = 0;
    this.emails.forEach(email => {
      if (email.frommail !== this.useremail) {
        if (email.typemail === 0) {
          if (email.read === 'unread') {
            unread++;
          }
        }
      }
    });
    if (unread > 0) {
      return unread;
    } else {
      return '';
    }
  }

}
