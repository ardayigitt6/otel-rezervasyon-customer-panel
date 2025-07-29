import React, { useState } from "react";
import axios from "axios";

export default function SearchRooms() {
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");
        setRooms([]);
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:4000/rooms/available", {
                params: {
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRooms(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Bir hata oluştu");
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h2>Uygun Oda Ara</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="date"
                    value={checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setCheckInDate(e.target.value)}
                />
                {" "}→{" "}
                <input
                    type="date"
                    value={checkOutDate}
                    onChange={e => setCheckOutDate(e.target.value)}
                />
                <br /><br />
                <button type="submit">Ara</button>
            </form>
            {loading && <p>Yükleniyor...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {rooms.map(room => (
                    <li key={room.id} style={{ margin: "20px", border: "1px solid #ccc", padding: "10px" }}>
                        <b>Oda No:</b> {room.room_number} &nbsp;
                        <b>Kapasite:</b> {room.capacity} &nbsp;
                        <b>Durum:</b> {room.status} &nbsp;
                        <button>Rezerve Et</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
