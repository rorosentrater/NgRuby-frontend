import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
// import { v4 as uuidv4 } from 'uuid';
// import { Chime } from 'aws-sdk'
import {
  AudioVideoFacade, AudioVideoObserver,
  ConsoleLogger, ContentShareObserver,
  DefaultBrowserBehavior,
  DefaultDeviceController,
  DefaultMeetingSession, DeviceChangeObserver,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChimeService {

  constructor(private http: HttpClient) { }

  defaultBrowserBehaviour: DefaultBrowserBehavior = new DefaultBrowserBehavior();
  audioVideo: AudioVideoFacade | null = null;
  needPermission = false;


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

  public async createFacadeMeeting(meeting: object, attendee: object) {
    // const logger = new ConsoleLogger('ChimeMeetingLogsTESTngROB', LogLevel.INFO); // Browser console logging
    // const logger = new ConsoleLogger('ChimeMeetingLogsTESTngROB', LogLevel.DEBUG); // Browser console logging
    const logger = new ConsoleLogger('ChimeMeetingLogsTESTngROB', LogLevel.WARN); // Browser console logging
    const deviceController = new DefaultDeviceController(logger); // easy to use mic/camera/whatever interface
    const configuration = new MeetingSessionConfiguration(meeting, attendee); // client-side meeting config
    const session = new DefaultMeetingSession(configuration, logger, deviceController) // Start session
    // TODO: Is passing back an observer to the component that created the meeting good enough? Would more than 1
    //  component need to observe device changes? Maybe that should be up to component <-> component communication?
    var deviceObserver = new ChimeDeviceChangeObserver() // Instance an observer we will pass back to components
    session.audioVideo.addDeviceChangeObserver(deviceObserver); // Observer for device changes
    this.setupDeviceLabelTrigger(session); // device label trigger override for knowing if we need browser perms or not
    // Get initial list of devices. DeviceChangeObserver will update these lists if needed
    deviceObserver.audioInputDevices = await session.audioVideo.listAudioInputDevices();
    deviceObserver.audioOutputDevices = await session.audioVideo.listAudioOutputDevices();
    deviceObserver.videoDevices = await session.audioVideo.listVideoInputDevices();
    // return session
    return {session: session, deviceObserver: deviceObserver}
  }

  private setupDeviceLabelTrigger(session: DefaultMeetingSession): void {
    // Note that device labels are privileged since they add to the
    // fingerprinting surface area of the browser session. In Chrome private
    // tabs and in all Firefox tabs, the labels can only be read once a
    // MediaStream is active. How to deal with this restriction depends on the
    // desired UX. The device controller includes an injectable device label
    // trigger which allows you to perform custom behavior in case there are no
    // labels, such as creating a temporary audio/video stream to unlock the
    // device names, which is the default behavior. Here we override the
    // trigger to also show an alert to let the user know that we are asking for
    // mic/camera permission.
    //
    // Also note that Firefox has its own device picker, which may be useful
    // for the first device selection. Subsequent device selections could use
    // a custom UX with a specific device id.
    if(!this.defaultBrowserBehaviour.doesNotSupportMediaDeviceLabels())
    {
      session.audioVideo.setDeviceLabelTrigger(
        async (): Promise<MediaStream> => {
          // if (this.isRecorder() || this.isBroadcaster()) {
          //   throw new Error('Recorder or Broadcaster does not need device labels');
          // }
          // this.switchToFlow('flow-need-permission');

          this.needPermission = true; // Assume permissions are needed until stream resolved
          // navigator.mediaDevices.getUserMedia({audio: true, video: true}); <--- !IS WHAT POPS THE BROWSER PERM MODAL!
          const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
          this.needPermission = false; // Stream await blocks the thread so if we're here we can assume we got permission
          return stream;
        }
      );
    }
  }

  public async startMeeting(meetingSession: DefaultMeetingSession) {
    // TODO: Using default audio input for now. In a proper implementation this would be a multi-step setup. Or maybe
    //  defaulting is fine but give a settings button to config on the fly?
    try {
      const audioInputs = await meetingSession.audioVideo.listAudioInputDevices();
      await meetingSession.audioVideo.chooseAudioInputDevice(audioInputs[0].deviceId);
    } catch (err) {
      // handle error - unable to acquire audio device perhaps due to permissions blocking
      console.error('unable to acquire audio device perhaps due to permissions blocking')
    }
    try {
      const videoInputs = await meetingSession.audioVideo.listVideoInputDevices();
      await meetingSession.audioVideo.chooseVideoInputDevice(videoInputs[0].deviceId);
    } catch (err) {
      // handle error - unable to acquire video device perhaps due to permissions blocking
      console.error('unable to acquire video device perhaps due to permissions blocking')
    }
    const audioOutputElement = document.getElementById(environment.chimeAudioOutputElementID);
    await meetingSession.audioVideo.bindAudioElement(<HTMLAudioElement>audioOutputElement);
    const videoOutputElement = document.getElementById(environment.chimeVideoOutputElementID);

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: (tileState: { boundAttendeeId: any; localTile: any; tileId: number; }) => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        meetingSession.audioVideo.bindVideoElement(tileState.tileId, <HTMLVideoElement>videoOutputElement);
      }
    };

    // @ts-ignore
    meetingSession.audioVideo.addObserver(observer);

    meetingSession.audioVideo.startLocalVideoTile();

    meetingSession.audioVideo.start();
  }

  public async easyStartMeeting(meetingSession: DefaultMeetingSession, attendeeId: string, meetingId: string) {
    this.createLogStream(attendeeId, meetingId).subscribe(
      data => {
        this.createBrowserEventLogStream(attendeeId, meetingId).subscribe(
          data => {
            this.startMeeting(meetingSession)
          })
      })
  }

  public endMeeting(meetingAlias: string) {
    return this.http.post(environment.chimeEndpoint + '/end', undefined, {
      params: {
        title: meetingAlias,
      }
    });
  }

}

export class ChimeDeviceChangeObserver {

  audioInputDevices: MediaDeviceInfo[] = [];
  audioOutputDevices: MediaDeviceInfo[] = [];
  videoDevices: MediaDeviceInfo[] = [];

  audioInputsChanged(freshAudioInputDeviceList: any) {
    console.log('Input list changed', freshAudioInputDeviceList);
    this.audioInputDevices = freshAudioInputDeviceList
  }

  audioOutputsChanged(freshAudioOutputDeviceList: any) {
    console.log('Output list changed', freshAudioOutputDeviceList);
    this.audioOutputDevices = freshAudioOutputDeviceList
  }

  videoInputsChanged(freshVideoInputDeviceList: any) {
    console.log('Video list changed', freshVideoInputDeviceList);
    this.videoDevices = freshVideoInputDeviceList
  }

  audioInputMuteStateChanged(device: any, muted: any) {
    console.log('Device', device, muted ? 'is muted in hardware' : 'is not muted');
  }
}
