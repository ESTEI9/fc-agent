import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    private email: string;
    private password: string;

  constructor(
      private apiService: ApiService,
      private commonService: CommonService,
      private navCtrl: NavController,
      private toastCtrl: ToastController
  ) { }

  ngOnInit() {
      this.commonService.agentData = null;
  }

  doLogin() {
      let data = "action=login"
      + "&email=" + this.email
      + "&password=" + this.password;

      this.apiService.login(data).subscribe(async (resp:any) => {
          if(resp.status === 1) {
              if(resp.code === "LO-01-SA"){
                    delete resp.agent.password;
                    this.commonService.agentData = resp.agent;
                    this.navCtrl.navigateForward('/home');
              } else {
                    const toast = await this.toastCtrl.create({
                        message: 'Login Incorrect. Please try again',
                        position: 'bottom',
                        duration: 2000
                    });
    
                    toast.present();
              }
          } else {
                const toast = await this.toastCtrl.create({
                    message: 'There was an error',
                    position: 'top',
                    duration: 2000
                });

                toast.present();
          }
      }, async (err: any) => {
            console.log(err);
            const toast = await this.toastCtrl.create({
                message: 'There was an error',
                position: 'top',
                duration: 2000
            });

            toast.present();
      });
  }

}
