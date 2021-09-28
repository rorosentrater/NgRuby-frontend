import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ChimeService, ChimeDeviceChangeObserver} from '../../../services/chime/chime.service';
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
  deviceObserver: ChimeDeviceChangeObserver | undefined

  createMeetingResponse: any

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
        const facadeMeeting = await this.chimeService.createFacadeMeeting(this.meetingData, this.attendeeData);
        this.meetingSession = facadeMeeting.session
        this.deviceObserver = facadeMeeting.deviceObserver
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
