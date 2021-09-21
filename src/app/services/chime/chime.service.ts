import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
// import { v4 as uuidv4 } from 'uuid';
// import { Chime } from 'aws-sdk'
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChimeService {

  constructor(private http: HttpClient) { }

  public createMeeting(meetingAlias: string, attendeeName: string, region='us-east-1') {
    return this.http.post(environment.chimeEndpoint + '/join', undefined, {
      params: {
        title: meetingAlias,
        name: attendeeName,
        region: region
      }
    });
  }

  public createLogStream(attendeeId: string, meetingId: string) {
    return this.http.post(environment.chimeEndpoint + '/create_log_stream', {
      attendeeId: attendeeId,
      meetingId: meetingId,
    });
  }

  public createBrowserEventLogStream(attendeeId: string, meetingId: string) {
    return this.http.post(environment.chimeEndpoint + '/create_browser_event_log_stream', {
      attendeeId: attendeeId,
      meetingId: meetingId,
    });
  }

  public async startMeeting(meetingId: string, attendeeId: string) {
    const logger = new ConsoleLogger('ChimeMeetingLogsTESTngROB', LogLevel.INFO); // Browser console logging
    const deviceController = new DefaultDeviceController(logger); // easy to use mic/camera/whatever interface
    const configuration = new MeetingSessionConfiguration(meetingId, attendeeId); // client-side meeting config
    const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController); // Start session
    // TODO: Using default audio input for now. In a proper implementation this would be a multi-step setup. Or maybe
    //  defaulting is fine but give a settings button to config on the fly?
    try {
      const audioInputs = await meetingSession.audioVideo.listAudioInputDevices();
      await meetingSession.audioVideo.chooseAudioInputDevice(audioInputs[0].deviceId);
    } catch (err) {
      // handle error - unable to acquire audio device perhaps due to permissions blocking
      console.error('unable to acquire audio device perhaps due to permissions blocking')
    }
    const audioOutputElement = document.getElementById(environment.chimeAudioOutputElementID);
    await meetingSession.audioVideo.bindAudioElement(<HTMLAudioElement>audioOutputElement);
    meetingSession.audioVideo.start();
  }

  public endMeeting(meetingAlias: string) {
    return this.http.post(environment.chimeEndpoint + '/end', undefined, {
      params: {
        title: meetingAlias,
      }
    });
  }


}
