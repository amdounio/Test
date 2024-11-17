import { Component } from '@angular/core';
import { Match } from '../../../models/match.model';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Splide from '@splidejs/splide';
import { BackgroundsComponent } from '../backgrounds/backgrounds.component';
import { Typography } from '../../../models/typography.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../../services/match.service';
import { Background } from '../../../models/background.model';
import { GeneratedPhoto } from '../../../models/generated-photo.model';


@Component({
  selector: 'app-matchs',
  templateUrl: './matchs.component.html',
  styleUrl: './matchs.component.scss'
})
export class MatchsComponent {
  firstDayMatchs: Match[] = []
  secondDayMatchs: Match[] = []
  selectedMatch: Match[] = []
  selectedBackground : Background
  startDate: Date;
  endDate: Date;
  startDateString: string;
  endDateString: string;
  leagueName: string = "";

  generatedMedia : GeneratedPhoto[]= []
  startGenerate : boolean = false;

  typographyList: Typography[] = [
    { id: 1, name: 'Tahoma' },
    { id: 2, name: 'Arial' },
    { id: 3, name: 'Helvetica' },
    { id: 4, name: 'Times New Roman' },
    { id: 5, name: 'Courier New' },
    { id: 6, name: 'Verdana' },
    { id: 7, name: 'Georgia' },
    { id: 8, name: 'Palatino' },
    { id: 9, name: 'Garamond' },
    { id: 10, name: 'Bookman' }
  ];
  selectedTypography: Typography

  constructor(private config: NgbCarouselConfig, private modalService: NgbModal, private activeRoute: ActivatedRoute, private matchService: MatchService, private router : Router) {
    this.config.showNavigationArrows = true;
    this.config.showNavigationIndicators = true;
    this.startDate = new Date();
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 1);
    this.startDateString = this.formatDate(this.startDate);
    this.endDateString = this.formatDate(this.endDate);
  }

  ngOnInit(): void {
    this.getData();
  }


  openBackgroundModal() {
    const backgroundModalRef = this.modalService.open(BackgroundsComponent, {
      fullscreen: true,
      centered: true
    })
    backgroundModalRef.closed.subscribe({
      next: res => {
        console.log(res);
        this.selectedBackground = res.selectedBackground
      }
    })
  }


  getData() {
    this.leagueName = this.activeRoute.snapshot.queryParamMap.get('name');
    let leagueId = this.activeRoute.snapshot.queryParamMap.get('id');
    let season = this.startDate.getFullYear().toString()
    const firstDay = { leagueId: leagueId, date: this.startDate, season: season }
    const secondDay = { leagueId: leagueId, date: this.endDate, season: season }
    this.matchService.getMatch(firstDay).subscribe({
      next: res => {
        this.firstDayMatchs = res;
      },
      error: error => {
        console.log(error);
      }
    })
    this.matchService.getMatch(secondDay).subscribe({
      next: res => {
        this.secondDayMatchs = res;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  next() {
    this.startDate = new Date(this.endDate);
    this.startDate.setDate(this.startDate.getDate() + 1);
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 1);
    this.startDateString = this.formatDate(this.startDate);
    this.endDateString = this.formatDate(this.endDate);
    this.getData();
  }

  previous() {
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.endDate.getDate() - 1);
    this.startDate = new Date(this.endDate);
    this.startDate.setDate(this.endDate.getDate() - 1);
    this.startDateString = this.formatDate(this.startDate);
    this.endDateString = this.formatDate(this.endDate);
    this.getData();
  }


  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('fr-FR', options);
  }

  selectMatch(selectedItem: Match) { 
    this.startGenerate = true
    const findMatchIndex = this.selectedMatch.findIndex(match => match.id === selectedItem.id);
    
    if (findMatchIndex !== -1) {
      this.selectedMatch.splice(findMatchIndex, 1);
    } else {
      this.selectedMatch.push(selectedItem);
    }
  
    this.generatedMedia = [];
    
    const mediaRequests = this.selectedMatch.map(match => {
      const data = {
        match: match,
        typography: this.selectedTypography,
        background: this.selectedBackground
      };
  
      return this.matchService.generateMedia(data).toPromise()
        .then(res => {
          this.generatedMedia.push(res);
        })
        .catch(error => {
          console.error(error);
        });
    });
  
    Promise.all(mediaRequests).then(() => {
      this.startGenerate = false;
      console.log('All media generated successfully');
    });
  }
  

  selectTypography(item: Typography) {
    this.selectedTypography = item
  }

  isTypographyChecked(item) {
    return this.selectedTypography === item
  }



  saveMedia(){
    this.matchService.saveGeneratedMedia(this.generatedMedia).subscribe({
      next: res=>{
        this.router.navigate(['/dashboard/media'])
      },
      error : error =>{
        console.log(error);
        
      }
    })
  }

}