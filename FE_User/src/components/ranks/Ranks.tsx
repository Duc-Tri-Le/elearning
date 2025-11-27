"use client"
import style from "./Ranks.module.css"

export default function Rank() {

    const users = [
        { id: 1, name: 'Alice', score: 95 },
        { id: 2, name: 'Bob', score: 90 },
        { id: 3, name: 'Charlie', score: 85 },
        { id: 4, name: 'David', score: 80 },
    ];


    return (
        <div className={style.container}>
            <h1 className={style.title}>Leaderboard</h1>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}