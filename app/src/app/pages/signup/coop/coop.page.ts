import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NavController, ToastController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
//import * as Cordova from 'cordova';

@Component({
    selector: 'app-coop',
    templateUrl: './coop.page.html',
    styleUrls: ['./coop.page.scss'],
})
export class CoopPage implements OnInit {

    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    @ViewChild('form') form: ElementRef;
    public signaturePadOptions : Object = {
        'canvasWidth': 500,
        'canvasHeight': 200,
        'backgroundColor': "#eee"
    };
    private signatureImage: string;
    private diffAdd: boolean = false;
    private imageURI: any;
    private imageLoading: boolean = false;
    private phyString: string;
    private compString: string;
    private phyLocations: any = [];
    private compLocations: any = [];
    private info : {
        agent_id: string,
        accName : string,
        accEmail: string,
        compName : string,
        compDBA : string,
        compAddress : string,
        compCity : string,
        compZip : number,
        compPhone : number ,
        compEmail : string,
        compFax : number,
        phyAddress : string,
        phyCity : string,
        phyZip : number,
        dbaPhone : number,
        password : string,
        EIN : string,
        ssn : number,
        industry : string,
        website : string,
        bankAccName : string,
        accNum : number,
        routNum : number,
        agreeTerms : boolean,
        IRSName : string,
        signature : any,
        } = {
            agent_id: null,
            accName : "",
            accEmail: "",
            compName : "",
            compDBA : "",
            compAddress : "",
            compCity : "",
            compZip : null,
            compPhone : null ,
            compEmail : "",
            compFax : null,
            phyAddress : "" ,
            phyCity : "",
            phyZip : null,
            dbaPhone : null,
            password : "",
            EIN : "",
            ssn : null,
            industry : "",
            website : "",
            bankAccName : "",
            accNum : null,
            routNum : null,
            agreeTerms : false,
            IRSName : "",
            signature : null,
    };

    private industries : any = [
        "Accounting/Finance" ,
        "Advertising/Public Relations" ,
        "Arts/Entertainment/Publishing",
        "Automotive",
        "Business Development",
        "Clerical/Administrative",
        "Construction/Facilities",
        "Consumer Goods",
        "Customer Service",
        "Education/Training",
        "Gasoline/Convenience Store",
        "Green",
        "Grocery",
        "Healthcare",
        "Hospitality/Travel",
        "Installation/Maintenance",
        "Law Enforcement/Security",
        "Legal",
        "Marketing",
        "Non-Profit/Volunteer",
        "Professional Services",
        "QA/Quality Control",
        "Restaurant/Food Service",
        "Retail",
        "Sales",
        "Skilled Labor",
        "Technology",
        "Telecommunications",
        "Transportation/Logistics",
        "Other"
    ];
    private confirmPass : string;
    private locations : any;

    constructor(
        public navCtrl: NavController,
        public http: HttpClient,
        private toastCtrl: ToastController,
        private camera: Camera,
        private apiService: ApiService,
        private platform: Platform,
        public commonService: CommonService,
        public file: File,
        private emailComposer: EmailComposer,
        //public cordova: Cordova
    ) {
        this.info.agent_id = (this.commonService.agentData) ? this.commonService.agentData['agent_id']  : 0;
        this.http.get("../../assets/locations.json").subscribe((resp: any) => {
            this.locations = resp;
        });
    }

    ngOnInit() {}

    ngAfterViewInit(){
        this.signaturePad.clear();
    }

    updateSigDimensions(){
        const width = this.form.nativeElement.clientWidth - 15; //padding
        this.signaturePad.set('canvasWidth', width);
        this.signaturePad.set('canvasHeight', width/3);
        this.signaturePad.clear();
    }

    updateCitiesList(type: string){
        this.compLocations = [];
        this.phyLocations = [];

        if(type === "company"){
            this.locations.filter((loc: string) => {
                if(this.compLocations.length < 10) {
                    let combos = [
                        loc['city'],
                        loc['state'],
                        loc['abbr'],
                        loc['city']+","+loc['state'],
                        loc['city']+", "+loc['state'],
                        loc['city']+","+loc['abbr'],
                        loc['city']+", "+loc['abbr']
                    ];
                    for(let option of combos){
                        if(option.search(this.compString) > -1){
                            this.compLocations.push(loc);
                            return;
                        }
                    }
                };
            });
        }
        if(type === "physical"){
            this.locations.filter((loc: string) => {
                if(this.phyLocations.length < 10) {
                    let combos = [
                        loc['city'],
                        loc['state'],
                        loc['abbr'],
                        loc['city']+","+loc['state'],
                        loc['city']+", "+loc['state'],
                        loc['city']+","+loc['abbr'],
                        loc['city']+", "+loc['abbr']
                    ];
                    for(let option of combos){
                        if(option.search(this.phyString) > -1){
                            this.phyLocations.push(loc);
                            return;
                        }
                    }
                };
            });
        }
    }

    changeAdd(){
        if(!this.diffAdd){
            this.info.phyAddress = this.info.compAddress;
            this.info.phyCity = this.info.compCity;
            this.info.phyZip = this.info.compZip;
            this.info.dbaPhone = this.info.compPhone;
        }
        if(this.diffAdd){
            this.info.phyAddress = "";
            this.info.phyCity = "";
            this.info.phyZip = null;
            this.info.dbaPhone = null;
        }
    }

    async register(){
        this.signatureImage = this.signaturePad.toDataURL();
        this.info.signature = this.signatureImage;

        if(this.signatureImage) {
            if(this.info.accName != "" &&
            this.info.accEmail != "" &&
            this.info.compName != "" &&
            this.info.compDBA != "" &&
            this.info.compAddress != "" &&
            this.info.compCity != "" &&
            this.info.compZip != null &&
            this.info.compPhone != null &&
            this.info.compEmail != "" &&
            this.info.phyAddress != "" &&
            this.info.phyCity != "" &&
            this.info.phyZip != null &&
            this.info.dbaPhone != null &&
            this.info.password != "" &&
            this.info.industry != "" &&
            this.info.bankAccName != "" &&
            this.info.IRSName != "" &&
            this.info.accNum != null &&
            this.info.routNum != null &&
            this.info.signature != null) {

                let action = "action=enrollMerchant"+
                "&agent_id=" + this.info.agent_id +
                "&accName=" + this.info.accName +
                "&accEmail=" + this.info.accEmail +
                "&compName=" + this.info.compName +
                "&compDBA=" + this.info.compDBA +
                "&compAddress=" + this.info.compAddress +
                "&compCity=" + this.info.compCity['city'] +
                "&compState=" + this.info.compCity['state'] + 
                "&compZip=" + this.info.compZip + 
                "&compPhone=" + this.info.compPhone +
                "&compEmail=" + this.info.compEmail +
                "&compFax=" + this.info.compFax +
                "&compLogo=" + this.imageURI + 
                "&phyAddress=" + this.info.phyAddress +
                "&phyCity=" + this.info.phyCity['city'] +
                "&phyState=" + this.info.phyCity['state'] +
                "&phyZip=" + this.info.phyZip + 
                "&dbaPhone=" + this.info.dbaPhone + 
                "&password=" + this.info.password +
                "&EIN=" + this.info.EIN + 
                "&ssn=" + this.info.ssn +
                "&IRSName=" + this.info.IRSName +
                "&industry=" + this.info.industry +
                "&website=" + this.info.website +
                "&bankAccName=" + this.info.bankAccName + 
                "&accNum=" + this.info.accNum + 
                "&routNum=" + this.info.routNum + 
                "&agreeTerms=" + this.info.agreeTerms +
                "&signature=" + this.info.signature;

                if(this.info.password == this.confirmPass){
                    this.apiService.signup(action).subscribe(async (resp : any) => {
                        if(resp.status == 1 ){
                            // if(window.cordova){
                            //     this.file.writeFile(window.cordova.file.dataDirectory, 'cc-signup-'+resp.merchant_id+'.txt', JSON.stringify(this.info)).then(()=>{
                            //         this.emailComposer.isAvailable().then((available: boolean) => {
                            //             if(available){
                            //                 let email = {
                            //                     to: this.info.compEmail,
                            //                     cc: this.commonService.agentData['email'],
                            //                     attachments: [
                            //                         window.cordova.file.dataDirectory + 'cc-singup-'+resp.merchant_id+'.txt'
                            //                     ],
                            //                     subject: 'Welcome to Cashless Cooperative',
                            //                     body: "Welcome to the Cooperative! We're looking forward to seeing what you can do! Attached is your signup info.",
                            //                     isHtml: true
                            //                 };
                            //                 this.emailComposer.open(email);
                            //             };
                            //         });
                            //     });
                            // };
                            const toast = await this.toastCtrl.create({
                                message: 'Merchant Registered',
                                duration: 3000,
                                position: 'bottom'
                            });
                            toast.present();  
                            this.navCtrl.navigateRoot('/home');
                        } else {
                            const toast = await this.toastCtrl.create({
                                message: 'There was an error',
                                duration: 2000,
                                position: 'bottom'
                            });
                            toast.present();
                        }
                    });
                } else {
                    let toast = await this.toastCtrl.create({
                    message: 'Passwords do not match',
                    duration: 3000,
                    position: 'top'
                    });
                    toast.present();  
                }
            } else {
                const toast = await this.toastCtrl.create({
                    message: 'All fields are required',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            }
        }
    }

    async selectFile(){
        this.imageLoading = true;
        const options: CameraOptions = {
          quality: 90,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          encodingType: this.camera.EncodingType.PNG
        };
        await this.camera.getPicture(options).then((imageData: any) => {
            this.imageURI = (imageData) ? 'data:image/png;base64,' + imageData : null;
        }, async (err) => {
          console.log(err);
          const toast = await this.toastCtrl.create({
              message: 'Error: could not get logo',
              position: 'top',
              duration: 2000
          });
          toast.present();
        });
        this.imageLoading = false;
      }
}
