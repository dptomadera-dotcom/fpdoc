import api from '../lib/api-client';

export interface Session {
  id: string;
  groupId: string;
  moduleId?: string;
  date: string;
  startTime: string;
  endTime: string;
  room?: string;
  notes?: string;
}

export interface CalendarDay {
  date: string;
  isTeaching: boolean;
  label?: string;
}

export const planningService = {
  getSessions: async (groupId: string, start: string, end: string): Promise<Session[]> => {
    const response = await api.get('/planning/sessions', {
      params: { groupId, start, end },
    });
    return response.data;
  },

  getCalendar: async (start: string, end: string): Promise<CalendarDay[]> => {
    const response = await api.get('/planning/calendar', {
      params: { start, end },
    });
    return response.data;
  },

  createSession: async (data: Omit<Session, 'id'>) => {
    const response = await api.post('/planning/sessions', data);
    return response.data;
  },

  markHoliday: async (date: string, label: string) => {
    const response = await api.post('/planning/holidays', { date, label });
    return response.data;
  },
};
