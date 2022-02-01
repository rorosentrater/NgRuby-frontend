import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
// import { v4 as uuidv4 } from 'uuid';
// import { Chime } from 'aws-sdk'
import {
  AudioVideoFacade, AudioVideoObserver, RemovableAnalyserNode,
  ConsoleLogger, ContentShareObserver,
  DefaultBrowserBehavior,
  DefaultDeviceController,
  DefaultMeetingSession, DeviceChangeObserver,
  LogLevel,
  MeetingSessionConfiguration,
  DefaultModality,
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

  // You will only ever have 1 local volume indicator so we can put it on the service itself
  analyserNode: RemovableAnalyserNode | null | undefined // Tracks audio device volume
  localVolume: number | undefined  // Output volume % of analyserNode


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

  // Tries to update session with new video device selection and optionally outputs the video feed to a preview <video>
  public async localVideoSelectionChangeHandler(session: DefaultMeetingSession, deviceId: string | null, showPreview: boolean) {
    // TODO: Should probably have a separate ID for the local <video> element in case user wants to change video output
    //  during an ongoing call.
    const videoOutputElement = document.getElementById(environment.chimeVideoOutputElementID);
    console.log('Video device selection changed')
    // Try to select device
    if (deviceId) {
      try {
        // TODO: I guess sending null to chooseVideoInputDevice tries to select the default device. I made this function
        //  to interpret deviceId = null as a clear but maybe it should support null and use undefined as the clear.
        await session.audioVideo.chooseVideoInputDevice(deviceId);
        console.log('session successfully updated Video device ', deviceId)
      } catch (err) {
        // handle error - unable to acquire video device perhaps due to permissions blocking
        console.error('unable to acquire video device perhaps due to permissions blocking')
        deviceId = null
      }
    }
    // if device selection failed or this is a clear
    if (deviceId === null) {
      console.log('Selection was null or failed. Stopping local video preview')
      if (showPreview) {
        session.audioVideo.stopVideoPreviewForVideoInput(<HTMLVideoElement>videoOutputElement);
      }
      session.audioVideo.stopLocalVideoTile();
      // TODO: Something like this should be done for a UI element I haven't created yet
      // this.toggleButton('button-camera', 'off');
    } else { // device is selected. output video to preview element
      if (showPreview) {
        console.log('Outputting new video preview...')
        session.audioVideo.startVideoPreviewForVideoInput(<HTMLVideoElement>videoOutputElement);
      }
    }
  }

  // Remember to clean up! Making analyser nodes creates memory leaks!
  public killAnalyserNode (analyserNode: RemovableAnalyserNode) {
    analyserNode.disconnect();
    analyserNode.removeOriginalInputs();
  }

  public startAudioPreview(session: DefaultMeetingSession) {
    // const audioVolumeOutputElement = document.getElementById(environment.chimeLocalAudioVolumeElementID);
    // if we have an old existing node, kill it
    if (this.analyserNode) {
      // kill the old node and make a new one
      this.killAnalyserNode(this.analyserNode)
    }
    // make new node
    this.analyserNode = session.audioVideo.createAnalyserNodeForAudioInput();


    // If for some reason we are unable to get volume data, hide the volume indicator
    if (!this.analyserNode?.getByteTimeDomainData) {
      const volumeElement = document.getElementById(environment.chimeLocalAudioVolumeElementID)
      if (volumeElement) volumeElement.style.visibility = 'hidden'
      return;
    }

    const data = new Uint8Array(this.analyserNode.fftSize);
    let frameIndex = 0;
    let analyserNodeCallback = () => {
      if (this.analyserNode) {
        if (frameIndex === 0) {
          this.analyserNode.getByteTimeDomainData(data);
          const lowest = 0.01;
          let max = lowest;
          for (const f of data) {
            max = Math.max(max, (f - 128) / 128);
          }
          let normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
          let percent = Math.min(Math.max(normalized * 100, 0), 100);
          // console.log('Local audio percentage: ', percent)
          this.localVolume = percent
        }
        frameIndex = (frameIndex + 1) % 2;
        if (analyserNodeCallback) {
          requestAnimationFrame(analyserNodeCallback);
        }
      }
    };
    requestAnimationFrame(analyserNodeCallback);
  }

  public async startMeeting(meetingSession: DefaultMeetingSession, roster: object) {
    const audioOutputElement = document.getElementById(environment.chimeAudioOutputElementID);
    await meetingSession.audioVideo.bindAudioElement(<HTMLAudioElement>audioOutputElement);
    const videoOutputElement = document.getElementById(environment.chimeVideoOutputElementID);

    // Make observer object.
    // Chime has tons of events that occur when certain things happen. List any you want to hook into here.
    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: (tileState: { boundAttendeeId: any; localTile: any; tileId: number; isContent: boolean }) => {
        // Ignore a tile without attendee ID and other attendee's tile.
        console.log('tileState observer saw this: ', tileState)

        // Ignore a tile without attendee ID or a content share. TODO: content share should eventually get a case
        if (!tileState.boundAttendeeId || tileState.isContent) {
          return;
        } else if (tileState.localTile) { // If this is the localTile, bind to the local HTML videoOutputElement
          meetingSession.audioVideo.bindVideoElement(tileState.tileId, <HTMLVideoElement>videoOutputElement);
        } else { // Otherwise this is a different attendee's tile. Try to find a video element by using...
          // chimeVideoOutputElementID + tileState.boundAttendeeId
          const remoteAttendeeVideoOutputElement = document.getElementById(
            environment.chimeVideoOutputElementID + tileState.boundAttendeeId
          );
          meetingSession.audioVideo.bindVideoElement(tileState.tileId, <HTMLVideoElement>remoteAttendeeVideoOutputElement);
        }
      },
      // eventDidReceive(name: string, attributes: any) {
      //   console.log('EVENT')
      //   console.log(name)
      //   switch (name) {
      //     case 'attendeePresenceReceived':
      //       console.log('EVENT: attendeePresenceReceived')
      //       console.log(attributes)
      //   }
      // }

    };

    let attendeePresenceHandler = function (attendeeId: string, present: boolean) {
      meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
        attendeeId,
        async (
          attendeeId: string,
          volume: number | null,
          muted: boolean | null,
          signalStrength: number | null
        ) => {
          // Handle volume strength changed event
          // console.log('---------- attendeePresenceHandler ----------')
          // console.log('attendeeId', attendeeId)
          // console.log('volume', volume)
          // console.log('muted', muted)
          // console.log('signalStrength', signalStrength)
          const baseAttendeeId = new DefaultModality(attendeeId).base();
          if (baseAttendeeId !== attendeeId) {
            // Optional: Do not include the content attendee (attendee-id#content) in the roster.
            // See the "Screen and content share" section for details.
            return;
          }
          if (roster.hasOwnProperty(attendeeId)) {
            // A null value for any field means that it has not changed.
            if (volume !== null) {
              // @ts-ignore
              roster[attendeeId].volume = volume; // a fraction between 0 and 1
            }
            if (muted !== null) {
              // @ts-ignore
              roster[attendeeId].muted = muted; // A boolean
            }
            if (signalStrength !== null) {
              // @ts-ignore
              roster[attendeeId].signalStrength = signalStrength; // 0 (no signal), 0.5 (weak), 1 (strong)
            }
          } else {
            // Add an attendee.
            // Optional: You can fetch more data, such as attendee name,
            // from your server application and set them here.
            // @ts-ignore
            roster[attendeeId] = {
              attendeeId,
              volume,
              muted,
              signalStrength
            };
          }
        });
    }

    // @ts-ignore
    meetingSession.audioVideo.addObserver(observer);
    meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(attendeePresenceHandler);

    meetingSession.audioVideo.startLocalVideoTile();


    // START ACTUAL MEETING! This is when you start getting charged $$$
    meetingSession.audioVideo.start();
  }

  public async easyStartMeeting(meetingSession: DefaultMeetingSession, attendeeId: string, meetingId: string, roster: object) {
    this.createLogStream(attendeeId, meetingId).subscribe(
      data => {
        this.createBrowserEventLogStream(attendeeId, meetingId).subscribe(
          data => {
            this.startMeeting(meetingSession, roster)
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
