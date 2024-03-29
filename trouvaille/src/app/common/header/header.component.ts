import { Component, HostListener, OnInit} from '@angular/core';
import { Router, NavigationEnd, Event  } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentRoute: string = "";
  scrollEffect: boolean = false;
  routerEvent$: any;
  isLoggedIn: any;
  homeLink: any = false;

  constructor(private router: Router,
              private modalService: NgbModal,
              private authService: AuthService){

    this.routerEvent$ = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
            console.log(event);
      }});

      
  }

  ngOnInit(): void {

    
    (this.currentRoute === "/home" || this.currentRoute === "/dashboard") ? (this.homeLink = true):(this.homeLink = false);

    this.authService.getIsLoggedIn().subscribe(
      (res)=>{
        this.isLoggedIn = res;
        console.log(this.isLoggedIn);
      }
    );
    
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginComponent, { centered: true });
    modalRef.componentInstance.data = "login";
  }

  openSignupModal() {
    const modalRef = this.modalService.open(LoginComponent, { centered: true });
    modalRef.componentInstance.data = "";
  }

  signOut(){
    const credentials: any = null;
    this.authService.signOut(credentials).subscribe(
      (response) => {
        console.log(response);
        this.authService.setIsLoggedIn(false);
        this.router.navigate(["/home"]);
        },
      error => console.error(error)
    );
  }

  homeClick(){
    // this.scrollEffect = false;
    this.isLoggedIn ? this.router.navigate(["/dashboard"]): this.router.navigate(["/home"]);
    console.log("homeclick", this.isLoggedIn);
    // this.isLoggedIn ? (this.homeLink = "/dashboard"): (this.homeLink = "/home")
  }

  @HostListener("document:scroll")
  scrollEffectFunction(){
    if((this.currentRoute === "/home") || (this.currentRoute === "/") || (this.currentRoute === "/dashboard")){
      if((document.body.scrollTop > 40) || (document.documentElement.scrollTop > 40)){
        this.scrollEffect = true;
      } else {
        this.scrollEffect = false;
      }
    }

    (this.currentRoute === "/plan/create" || this.currentRoute === "/dashboard") && (this.scrollEffect = true);
  }

}
