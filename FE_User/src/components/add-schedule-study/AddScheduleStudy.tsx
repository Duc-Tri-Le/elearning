"use client";

import React, { useEffect, useState } from "react"
import FormScheduleStudy from "../form-schedule-study/FormScheduleStudy";

interface StudyScheduleForm {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: "pending" | "in_progress" | "completed";
    target_question: number;
    subject_id?: number;
}

interface StudySchedule {
    study_schedule_id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: string;
    target_question: number;
    subject_id: number;
    subject_name: string
}

interface Props {
    setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
    isAdd : boolean;
    setSchedules : React.Dispatch<React.SetStateAction<StudySchedule[]>>;
}

export default function AddScheduleStudy({isAdd, setIsAdd, setSchedules }: Props) {
    const [form, setForm] = useState<StudyScheduleForm>({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "pending",
        target_question: 0,
        subject_id: undefined,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (
        <FormScheduleStudy
            form={form}
            setIsAdd={setIsAdd}
            isAdd={isAdd}
            setForm={setForm}
            error={error}
            setError={setError}
            loading={loading}
            setSchedules={setSchedules}
        />
    );
}
