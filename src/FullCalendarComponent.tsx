// src/FullCalendarComponent.tsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import listPlugin from '@fullcalendar/list';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // tippyのCSSをインポート
import './FullCalendarComponent.css'; //ツールチップのスタイル変更


const inievents: EventInput[] = [
  { id: '1', resourceId: 'b', start: '2024-06-22T02:00:00', end: '2024-06-22T02:10:00', title: 'event 1\n hello\n test', backgroundColor: 'red' },
  { id: '2', resourceId: 'c', start: '2024-06-22T05:00:00', end: '2024-06-22T10:00:00', title: 'event 2' },
  { id: '3', resourceId: 'd', start: '2024-06-22T05:00:00', end: '2024-06-22T06:00:00', title: 'event 3', backgroundColor: 'red' },
  { id: '4', resourceId: 'e', start: '2024-06-22T03:00:00', end: '2024-06-22T05:00:00', title: 'event 4' },
  { id: '5', resourceId: 'f', start: '2024-06-22T00:30:00', end: '2024-06-22T02:30:00', title: 'event 5' },
];

const FullCalendarComponent: React.FC = () => {

  const [events, setEvents] = useState<EventInput[]>(inievents);
  //====================================新規イベントを作成するときの関数============================================
  const handleDateSelect = (info: any) => {
    const title = prompt('Enter Event Title:');
    if (title) {
      const newevents = {
        id: String(events.length + 1),
        resourceId: info.resource.id,
        start: info.startStr,
        end: info.endStr,
        title: title,
        allDay: info.allDay,
        backgroundColor: '#ff9f89', // Optional: Set a default color for new events
        borderColor: '#ff9f89' // Optional: Set a default border color for new events
      };
      setEvents([...events, newevents]);
    }
    info.view.calendar.unselect(); // Deselect the cells after adding the event
  }
  //=============================================================================================================

  //===================================ツールチップの設定関数======================================================
  const handleEventDidMount = (info: any) => {
    let startHour = getHour(info.event.startStr);
    let startMin = getMin(info.event.startStr);
    let EndHour = getHour(info.event.endStr);
    let EndMin = getMin(info.event.endStr);
    let tooltip = tippy(info.el, {
      content: `${startHour}:${startMin}-${EndHour}:${EndMin}<br>${info.event._def.title}`,
      placement: 'top',
      trigger: 'manual',
      hideOnClick: false,
      arrow: true,
      allowHTML: true, // HTMLを許可する
      theme: 'custom-theme',//カスタムテーマを適用
    });
    // カスタムデータ属性に保存して後でアクセスできるようにする
    info.el._tooltip = tooltip;
  };

  //=========================イベントが動作された時に起動する関数===================================================
  const eventClick = (info: any) => {
    const title = prompt('Enter new title:', info.event.title);
    if (title) {
      info.event._def.title = title;
      events.forEach(element => {
        if (element.id === info.event._def.publicId) {
          element.title = title;
        }
      });
    }
    setEvents([...events]);
  }

  const handleEventMouseEnter = (info: any) => {
    if (info.el) {
      info.el._tooltip.show();
    }
  };

  const handleEventMouseLeave = (info: any) => {
    if (info.el._tooltip) {
      info.el._tooltip.hide();
    }
  };

  const dragStart = (info: any) => {
    info.el._tooltip.hide();
    if (info.el._tooltip) {
    }
  };

  const dragEnd = (info: any) => {
    if (info.el._tooltip) {
      events.forEach(element => {
        if (element.id === info.event._def.publicId) {
        }
      });
    }
  }

  const handleEventChangeState = (info: any) => {
    const updatedEvents = events.map(event =>
      event.id === info.event.id ? {
        ...event,
        start: info.event.startStr,
        end: info.event.endStr,
        resourceId: info.event.getResources()[0]?.id,
      } : event
    );
    updateTooltip(info.el._tooltip, updatedEvents, info.event.id);
    setEvents(updatedEvents);
  }

  const updateTooltip = (event: any, updatedEvents: any, id: any) => {
    updatedEvents.forEach((element: any) => {
      if (element.id === id) {
        let startHour = getHour(element.start);
        let startMin = getMin(element.start);
        let EndHour = getHour(element.end);
        let EndMin = getMin(element.end);
        event.setContent(`${startHour}:${startMin}-${EndHour}:${EndMin}<br>${element.title}`)
      }
    });
  }

  const getHour = (time: Date) => {
    return new Date(time).getHours();
  }

  const getMin = (time: Date) => {
    const minutes = new Date(time).getMinutes();
    return minutes.toString().padStart(2, '0');
  };


  //============================以下HTML書く場所=========================================
  return (
    <div>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          resourceTimelinePlugin,
          resourceTimeGridPlugin,
          listPlugin
        ]}

        schedulerLicenseKey='GPL-My-Project-Is-Open-Source'

        editable={true}

        selectable={true}

        nowIndicator={true}

        allDaySlot={false}

        selectMirror={false}

        businessHours={[
          {
            daysOfWeek: [1, 2, 3],
            startTime: '08:00',
            endTime: '18:00' // 6pm
          },
          {
            daysOfWeek: [4, 5],
            startTime: '10:00',
            endTime: '16:00' // 4pm
          }
        ]}

        resources={[
          { id: 'a', title: 'Auditorium A' },
          { id: 'b', title: 'Auditorium B', eventColor: 'green' },
          { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          {
            id: 'd', title: 'Auditorium D', children: [
              { id: 'd1', title: 'Room D1' },
              { id: 'd2', title: 'Room D2' }
            ]
          },
          { id: 'e', title: 'Auditorium E' },
          { id: 'f', title: 'Auditorium F', eventColor: 'red' },
        ]}

        initialView="resourceTimeGrid"

        locale={'ja'}

        events={events}
        eventDidMount={handleEventDidMount}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        eventDragStart={dragStart}
        eventDragStop={dragEnd}
        eventDrop={handleEventChangeState}
        eventResize={handleEventChangeState}
        select={handleDateSelect}
        eventClick={eventClick}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"

        views={{
          resourceTimeline: {
            type: 'resourceTimeline',
            slotDuration: '00:15:00', //リソースタイムライン15分間隔
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            },
          },
          resourceTimeGrid: {
            type: 'resourceTimeGrid',
            slotDuration: '00:15:00', //リソースタイムグリッド15分間隔
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            },
            selectMirror: false,
          }
        }}

        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,resourceTimeline,resourceTimeGrid'
        }}
      />

      <div style={{ position: 'absolute', height: '200px', overflow: 'auto' }}>
        {events.map(event => (
          <div key={event.id}>
            {String(event.start)} : {String(event.end)}
          </div>
        ))}
      </div>

    </div>
  );
};

export default FullCalendarComponent;
