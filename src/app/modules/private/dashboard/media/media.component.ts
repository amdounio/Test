import { Component, OnInit } from '@angular/core';
import { GeneratedPhoto } from '../../../models/generated-photo.model';
import { MatchService } from '../../../services/match.service';
import { MediaDTO } from '../../../models/media.model.dto';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {

  mediaList: MediaDTO[] = []

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.matchService.getGeneratedMedia(1).subscribe({
      next: res => {
        this.mediaList = res
        console.log(res);

      },
      error: error => {
        console.log(error);

      }
    })
  }


  formtDate(inputDate: string) {
    const date = new Date(inputDate)
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }; const locale = 'fr-FR'; // French locale for "Vendredi", "Aout"
    const dateFormatter = new Intl.DateTimeFormat(locale, options);
    const [weekDay, dayOfMonth, month] = dateFormatter.format(date).split(' ');
    const dayOfWeek = weekDay.charAt(0).toUpperCase() + weekDay.slice(1); // Capitalize first letter 
    const day = dayOfMonth;
    const months = month.charAt(0).toUpperCase() + month.slice(1);
    return { dayWeek: dayOfWeek, day: day, month: months }
  }

  download(fileUrl): void {
    this.matchService.downloadFile(fileUrl);
  }

  delete(id:number, userId : number, media: number){
    let data = {
      userId: userId,
      mediathequeId:media
  }
    this.matchService.deleteMedia(id,data).subscribe({
      next : res=>{
        this.loadData()
        
      },
      error : error=>{
        console.log(error);
        
      }
    })
  }
}
