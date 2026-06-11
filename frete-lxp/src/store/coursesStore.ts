import { create } from 'zustand'
import { type Course, type Enrollment } from '@/types'
import { MOCK_COURSES, MOCK_ENROLLMENTS } from './mockData'

interface CoursesState {
  courses:     Course[]
  enrollments: Enrollment[]
  updateProgress: (enrollmentId: string, progress: number) => void
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses:     MOCK_COURSES,
  enrollments: MOCK_ENROLLMENTS,

  updateProgress: (enrollmentId, progress) =>
    set((state) => ({
      enrollments: state.enrollments.map((e) =>
        e.id !== enrollmentId ? e : {
          ...e,
          progress,
          status:      progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
          completedAt: progress >= 100 ? new Date().toISOString() : e.completedAt,
        }
      ),
    })),
}))
