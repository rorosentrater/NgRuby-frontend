import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ChimeService} from '../../../services/chime/chime.service';


@Component({
  selector: 'app-chime',
  templateUrl: './chime.component.html',
  styleUrls: ['./chime.component.scss']
})
export class ChimeComponent implements OnInit {
  audioElementID = environment.chimeAudioOutputElementID
  createMeetingLoading = false
  createLogStreamLoading = false
  createBrowserLogStreamLoading = false

  attendeeName: string | undefined

  attendeeId = ''
  attendeeData = {}
  meetingId = ''
  meetingData = {}
  // @ts-ignore
  meetingTitle = ''

  createMeetingResponse: any

  constructor(private chimeService: ChimeService) { }

  ngOnInit(): void {
  }

  createMeeting(formData: any) {
    // Clear any existing meeting details
    this.createMeetingResponse = {};
    this.createMeetingLoading = true;
    console.log(formData.value);
    this.chimeService.createMeeting(formData.value.meetingTitle, formData.value.attendeeName).subscribe(
      data => {
        this.createMeetingResponse = data;
        console.log('THEEEEE DATA:', data)
        this.meetingTitle = formData.value.meetingTitle
        // @ts-ignore
        this.attendeeId = data.JoinInfo.Attendee.Attendee.AttendeeId
        // @ts-ignore
        this.attendeeData = data.JoinInfo.Attendee.Attendee
        // @ts-ignore
        this.meetingId = data.JoinInfo.Meeting.Meeting.MeetingId
        // @ts-ignore
        this.meetingData = data.JoinInfo.Meeting.Meeting
        this.createMeetingLoading = false;
      });
  }

  createLogStream() {
    this.createLogStreamLoading = true;
    this.chimeService.createLogStream(
      this.attendeeId,
      this.meetingId).subscribe(
      data => {
        this.createLogStreamLoading = false;
      });
  }

  createBrowserLogStream() {
    this.createBrowserLogStreamLoading = true;
    this.chimeService.createBrowserEventLogStream(
      this.attendeeId,
      this.meetingId).subscribe(
      data => {
        this.createBrowserLogStreamLoading = false;
      });
  }

  endCurrentMeeting() {
    // @ts-ignore
    this.chimeService.endMeeting(this.meetingTitle).subscribe(
      data => {
        this.attendeeId = ''
        this.meetingId = ''
        this.meetingTitle = ''
        this.createMeetingResponse = {}
      });
  }

  startMeeting() {
    // @ts-ignore
    this.chimeService.startMeeting(this.meetingData, this.attendeeData).then(function () {
        console.log('MEETING STARTED?')
      });
  }
}
