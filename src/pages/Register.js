import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post("http://localhost:4000/register", {
                name,
                email,
                password,
                role: "customer"
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Bir hata oluştu.");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={e => setName(e.target.value)}
                /><br /><br />
                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                /><br /><br />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                /><br /><br />
                <button type="submit">Kayıt Ol</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}