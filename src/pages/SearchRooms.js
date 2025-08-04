import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SearchRooms() {
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const [guests, setGuests] = useState([]);

    const handleGuestChange = (idx, e) => {
        const newGuests = [...guests];
        newGuests[idx][e.target.name] = e.target.value;
        setGuests(newGuests);
    };

    const addGuest = () => {
        setGuests([...guests, { name: "", email: "", phone: "" }]);
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
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

    const handleReserve = async (roomId) => {
        try {

            const token = localStorage.getItem("token");
            const user_id = jwtDecode(token).id;


            const filledGuests = guests.filter(
                g => g.name && g.name.trim() !== "" && g.email && g.email.trim() !== "" && g.phone && g.phone.trim() !== ""
            );


            if (filledGuests.length === 0) {
                alert("Lütfen en az bir misafir bilgisini eksiksiz girin ve Misafir Ekle'ye tıklayın!");
                return;
            }

            await axios.post(
                "http://localhost:4000/reservation-with-guests",
                {
                    user_id,
                    room_id: roomId,
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate,
                    guests: filledGuests
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert("Rezervasyon ve misafir kaydı başarıyla oluşturuldu!");
            handleSearch();
            setGuests([]);
        } catch (err) {
            alert(err.response?.data?.error || "Bir hata oluştu");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h2>Uygun Oda Ara</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="date"
                    value={checkInDate}
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

            <div style={{ marginTop: 30, marginBottom: 30 }}>
                <h3>Misafir Bilgileri</h3>
                {guests.map((guest, idx) => (
                    <div key={idx} style={{ marginBottom: 10 }}>
                        <input
                            name="name"
                            placeholder="Ad Soyad"
                            value={guest.name}
                            onChange={e => handleGuestChange(idx, e)}
                        />
                        &nbsp;
                        <input
                            name="email"
                            placeholder="E-posta"
                            value={guest.email}
                            onChange={e => handleGuestChange(idx, e)}
                        />
                        &nbsp;
                        <input
                            name="phone"
                            placeholder="Telefon"
                            value={guest.phone}
                            onChange={e => handleGuestChange(idx, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addGuest}>Misafir Ekle</button>
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {rooms.map(room => (
                    <li key={room.id} style={{ margin: "20px", border: "1px solid #ccc", padding: "10px" }}>
                        <b>Oda No:</b> {room.room_number} &nbsp;
                        <b>Kapasite:</b> {room.capacity} &nbsp;
                        <b>Durum:</b> {room.status} &nbsp;
                        <button onClick={() => handleReserve(room.id)}>Rezerve Et</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
