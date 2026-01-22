
export class CreateClassDto {
    class_name: string;
    class_code: string;
    grade_level: number;
    section?: string;
    teacher_id?: number;
    room_number?: string;
    capacity?: number;
    academic_year?: string;
}
