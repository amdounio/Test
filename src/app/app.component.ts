import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isHidden = true;
  showDashboard : boolean = false
  
    
  constructor(private router: Router, private authService: AuthenticationService) {}
  showSidebar = false;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  ngOnInit() {
    this.authService.socialAuthInit()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHidden = !(event.url === '/' || event.url === '/plans' || event.url === '/features' || event.url === '/faq');
        console.log(event.url.includes('dashboard'));
        
        if (event.url.includes('dashboard')) {
          this.showDashboard= true
        }else{
          this.showDashboard = false
        }
      }
    });
  }
}
