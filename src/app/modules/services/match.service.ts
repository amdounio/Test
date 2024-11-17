import { Injectable } from '@angular/core';
import { BaseService } from '../../core/services/base.service';
import { HttpService } from '../../core/services/http.service';
import { Match } from '../models/match.model';
import { MatchRequestDTO } from '../models/matchRequest.dto';
import { GeneratedPhoto } from '../models/generated-photo.model';
import { GeneratedPhotoDTO } from '../models/generate-photo.dto';
import { MediaDTO } from '../models/media.model.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatchService extends BaseService<Match> {
  override entityName = 'match';

  constructor(private HttpService: HttpService, private httpClient: HttpClient) {
    super();
  }

  getMatch(data: MatchRequestDTO) {
    return this.HttpService.post<Match[], MatchRequestDTO>(`matches/leagues/${data.leagueId}/matches`, data)
  }


  generateMedia(match: GeneratedPhotoDTO) {
    return this.HttpService.post<GeneratedPhoto, GeneratedPhotoDTO>('generator/generate-image/combined', match)
  }

  saveGeneratedMedia(data: GeneratedPhoto[]) {
    return this.HttpService.post('generator/save', data)
  }

  getGeneratedMedia(userId: number) {
    return this.HttpService.get<MediaDTO[]>('mediatheques/matches/' + userId)
  }


  downloadFile(fileUrl: string): void {
    this.httpClient.get(fileUrl, { responseType: 'blob' }).subscribe(
      blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl; a.download = 'file';
        a.click(); URL.revokeObjectURL(objectUrl);
      });
  }


  deleteMedia(id:number, data){
    return this.HttpService.post('mediatheques/matches/'+id,data);
  }


}
