import React, { useState } from "react";
import { register, login } from "../api/auth";

const AuthForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 전환
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [message, setMessage] = useState(""); // 성공/오류 메시지 저장

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작 방지
        setLoading(true); // 로딩 상태 활성화
        setMessage(""); // 메시지 초기화

        try {
            if (isLogin) {
                const response = await login(formData);
                localStorage.setItem("token", response.data);
                setMessage("로그인 성공! 🎉");
                alert("로그인 성공! 🎉");
            } else {
                await register(formData);
                setMessage("회원가입 성공! 로그인 해주세요.");
                alert("회원가입 성공! 로그인 해주세요.");
                setIsLogin(true); // 회원가입 후 로그인 화면으로 변경
            }
        } catch (error) {
            setMessage(`오류 발생: ${error.response?.data || "서버 오류"}`);
            alert(`오류 발생: ${error.response?.data || "서버 오류"}`);
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-96 p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                    {isLogin ? "로그인" : "회원가입"}
                </h2>

                {message && <p className="text-center text-red-500 mb-2">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="아이디"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full p-3 text-white rounded-lg ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 font-semibold hover:underline"
                    >
                        {isLogin ? "회원가입" : "로그인"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
