import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ChimeService} from '../../../services/chime/chime.service';
import {DefaultMeetingSession} from "amazon-chime-sdk-js";


@Component({
  selector: 'app-chime',
  templateUrl: './chime.component.html',
  styleUrls: ['./chime.component.scss']
})
export class ChimeComponent implements OnInit {
  audioElementID = environment.chimeAudioOutputElementID
  videoElementID = environment.chimeVideoOutputElementID
  createMeetingLoading = false
  easyCreateMeetingLoading = false

  attendeeName: string | undefined

  attendeeId = ''
  attendeeData = {}
  meetingId = ''
  meetingData = undefined
  // @ts-ignore
  meetingTitle = ''
  meetingSession: DefaultMeetingSession | undefined;

  createMeetingResponse: any
  audioInputDevicesList: {
    selected?: boolean;
    deviceId: string;
    label: string
  }[] = [];
  audioOutputDevicesList: {
    selected?: boolean;
    deviceId: string;
    label: string
  }[] = [];
  videoDevicesList: {
    selected?: boolean;
    deviceId: string;
    label: string
  }[] = [];

  constructor(public chimeService: ChimeService) { }

  ngOnInit(): void {
  }

  async createMeeting(formData: any) {
    // Clear any existing meeting details
    this.createMeetingResponse = {};
    this.meetingSession = undefined;
    this.createMeetingLoading = true;
    console.log(formData.value);
    this.chimeService.createMeeting(formData.value.meetingTitle, formData.value.attendeeName).subscribe(
      async data => {
        this.createMeetingResponse = data;
        console.log('CREATE meeting data:', data)
        this.meetingTitle = formData.value.meetingTitle
        // @ts-ignore
        this.attendeeId = data.JoinInfo.Attendee.Attendee.AttendeeId
        // @ts-ignore
        this.attendeeData = data.JoinInfo.Attendee.Attendee
        // @ts-ignore
        this.meetingId = data.JoinInfo.Meeting.Meeting.MeetingId
        // @ts-ignore
        this.meetingData = data.JoinInfo.Meeting.Meeting

        // @ts-ignore
        this.meetingSession = this.chimeService.createFacadeMeeting(this.meetingData, this.attendeeData)
        // Get all device lists for form selects
        // @ts-ignore
        const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
        // An array of MediaDeviceInfo objects
        audioInputDevices.forEach(mediaDeviceInfo => {
          // console.log(`DEVICE-ID: ${mediaDeviceInfo.deviceId} LABEL: ${mediaDeviceInfo.label}`);
          this.audioInputDevicesList.push({deviceId: mediaDeviceInfo.deviceId, label: mediaDeviceInfo.label})
        });
        // @ts-ignore
        const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();
        audioOutputDevices.forEach(mediaDeviceInfo => {
          this.audioOutputDevicesList.push({deviceId: mediaDeviceInfo.deviceId, label: mediaDeviceInfo.label})
        });
        // @ts-ignore
        const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();
        videoInputDevices.forEach(mediaDeviceInfo => {
          this.videoDevicesList.push({deviceId: mediaDeviceInfo.deviceId, label: mediaDeviceInfo.label})
        });

        this.createMeetingLoading = false;
      });
  }

  endCurrentMeeting() {
    // @ts-ignore
    this.chimeService.endMeeting(this.meetingTitle).subscribe(
      data => {
        this.attendeeData = {}
        this.attendeeId = ''
        this.meetingData = undefined
        this.meetingId = ''
        this.meetingTitle = ''
        this.meetingSession = undefined
        this.createMeetingResponse = {}
      });
  }

  // startMeeting() {
  //   const facadeMeeting = this.chimeService.createFacadeMeeting(this.meetingData, this.attendeeData)
  //   // @ts-ignore
  //   this.chimeService.startMeeting(facadeMeeting).then(function () {
  //       console.log('MEETING STARTED?')
  //     });
  // }

  easyStartMeeting(formData: any) {
    this.easyCreateMeetingLoading = true
    // @ts-ignore
    this.chimeService.easyStartMeeting(this.meetingSession, this.attendeeId, this.meetingId).then(
      data => {
        console.log('Meeting should now be starting...')
        this.easyCreateMeetingLoading = false
      });
  }
}
