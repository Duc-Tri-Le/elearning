import { query } from "../config/database"
import { UserGoal } from "../model/user.goal.models"

export const UserGoalService = {
    async getAll(userId: number): Promise<UserGoal[]> {
        const result = await query(
            `SELECT ug.*, s.subject_name, cg.current_progress 
            FROM user_goal ug
            JOIN subject s ON s.subject_id = ug.subject_id
            LEFT JOIN current_progress cg ON cg.user_goal_id = ug.user_goal_id
            WHERE ug.user_id = $1 
            ORDER BY ug.user_goal_id DESC`,
            [userId]
        );
        return result.rows;
    },

    async create(goal: UserGoal): Promise<UserGoal> {

        const result = await query(
            `INSERT INTO user_goal (target_score, deadline, user_id, subject_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [Number(goal.target_score), goal.deadline, goal.user_id, Number(goal.subject_id)]
        );

        return result.rows[0];
    },

    async delete(id: number, userId: number): Promise<boolean> {
        await query(
            `DELETE FROM user_goal WHERE user_goal_id = $1 AND user_id = $2`,
            [id, userId]
        );
        return true;
    }
};
