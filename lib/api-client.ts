const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers);

    // Use the .set() method to safely add or override values
    headers.set("Content-Type", "application/json");

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.message || "An error occurred" }
      }

      return { data }
    } catch (error) {
      return { error: "Network error. Please check your connection." }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any) {
    return this.request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Students endpoints
  async getStudents(page = 1, limit = 10, search = "") {
    return this.request<any>(`/students?page=${page}&limit=${limit}&search=${search}`)
  }

  async getStudent(id: number) {
    return this.request<any>(`/students/${id}`)
  }

  async createStudent(studentData: any) {
    return this.request<any>("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  async updateStudent(id: number, studentData: any) {
    return this.request<any>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    })
  }

  async deleteStudent(id: number) {
    return this.request<any>(`/students/${id}`, {
      method: "DELETE",
    })
  }

  // Teachers endpoints
  async getTeachers(page = 1, limit = 10, search = "") {
    return this.request<any>(`/teachers?page=${page}&limit=${limit}&search=${search}`)
  }

  async getTeacher(id: number) {
    return this.request<any>(`/teachers/${id}`)
  }

  async createTeacher(teacherData: any) {
    return this.request<any>("/teachers", {
      method: "POST",
      body: JSON.stringify(teacherData),
    })
  }

  async updateTeacher(id: number, teacherData: any) {
    return this.request<any>(`/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(teacherData),
    })
  }

  async deleteTeacher(id: number) {
    return this.request<any>(`/teachers/${id}`, {
      method: "DELETE",
    })
  }

  // Classes endpoints
  async getClasses(page = 1, limit = 10) {
    return this.request<any>(`/classes?page=${page}&limit=${limit}`)
  }

  async getClass(id: number) {
    return this.request<any>(`/classes/${id}`)
  }

  async createClass(classData: any) {
    return this.request<any>("/classes", {
      method: "POST",
      body: JSON.stringify(classData),
    })
  }

  async updateClass(id: number, classData: any) {
    return this.request<any>(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(classData),
    })
  }

  async deleteClass(id: number) {
    return this.request<any>(`/classes/${id}`, {
      method: "DELETE",
    })
  }

  // Subjects endpoints
  async getSubjects() {
    return this.request<any>("/subjects")
  }

  async createSubject(subjectData: any) {
    return this.request<any>("/subjects", {
      method: "POST",
      body: JSON.stringify(subjectData),
    })
  }

  async deleteSubject(id: number) {
    return this.request<any>(`/subjects/${id}`, {
      method: "DELETE",
    })
  }

  // Grades endpoints
  async getGrades(studentId?: number) {
    const query = studentId ? `?studentId=${studentId}` : ""
    return this.request<any>(`/grades${query}`)
  }

  async createGrade(gradeData: any) {
    return this.request<any>("/grades", {
      method: "POST",
      body: JSON.stringify(gradeData),
    })
  }

  async updateGrade(id: number, gradeData: any) {
    return this.request<any>(`/grades/${id}`, {
      method: "PUT",
      body: JSON.stringify(gradeData),
    })
  }

  // Attendance endpoints
  async getAttendance(classId?: number, date?: string) {
    let query = ""
    if (classId) query += `classId=${classId}`
    if (date) query += (query ? "&" : "") + `date=${date}`
    return this.request<any>(`/attendance${query ? "?" + query : ""}`)
  }

  async markAttendance(attendanceData: any) {
    return this.request<any>("/attendance", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    })
  }

  // Exams endpoints
  async getExams() {
    return this.request<any>("/exams")
  }

  async createExam(examData: any) {
    return this.request<any>("/exams", {
      method: "POST",
      body: JSON.stringify(examData),
    })
  }

  async updateExam(id: number, examData: any) {
    return this.request<any>(`/exams/${id}`, {
      method: "PUT",
      body: JSON.stringify(examData),
    })
  }

  // Timetable endpoints
  async getTimetable(classId?: number) {
    const query = classId ? `?classId=${classId}` : ""
    return this.request<any>(`/timetable${query}`)
  }

  async createTimetable(timetableData: any) {
    return this.request<any>("/timetable", {
      method: "POST",
      body: JSON.stringify(timetableData),
    })
  }

  // Announcements endpoints
  async getAnnouncements() {
    return this.request<any>("/announcements")
  }

  async createAnnouncement(announcementData: any) {
    return this.request<any>("/announcements", {
      method: "POST",
      body: JSON.stringify(announcementData),
    })
  }

  async deleteAnnouncement(id: number) {
    return this.request<any>(`/announcements/${id}`, {
      method: "DELETE",
    })
  }

  // Fees endpoints
  async getFees() {
    return this.request<any>("/fees")
  }

  async createFeeRecord(feeData: any) {
    return this.request<any>("/fees", {
      method: "POST",
      body: JSON.stringify(feeData),
    })
  }

  // Library endpoints
  async getBooks() {
    return this.request<any>("/library")
  }

  async createBook(bookData: any) {
    return this.request<any>("/library", {
      method: "POST",
      body: JSON.stringify(bookData),
    })
  }

  async borrowBook(borrowData: any) {
    return this.request<any>("/library/borrow", {
      method: "POST",
      body: JSON.stringify(borrowData),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
