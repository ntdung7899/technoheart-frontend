"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: "", email: "", phone: "", message: "" });
    };

    if (submitted) {
        return (
            <div className="text-center py-12">
                <CheckCircle
                    className="h-16 w-16 mx-auto mb-4"
                    style={{ color: "#FACC15" }}
                />
                <h3 className="text-xl font-bold text-white mb-2">Gửi thành công!</h3>
                <p style={{ color: "#93C5FD" }}>
                    Chúng tôi sẽ phản hồi trong vòng 24h.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#60A5FA" }}>
                        Họ và tên *
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="th-input"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#60A5FA" }}>
                        Email *
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="th-input"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#60A5FA" }}>
                    Số điện thoại
                </label>
                <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0901 234 567"
                    className="th-input"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#60A5FA" }}>
                    Nội dung *
                </label>
                <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Bạn cần hỗ trợ gì? Hãy để lại tin nhắn..."
                    className="th-input resize-none"
                />
            </div>
            <button type="submit" className="th-btn-primary w-full justify-center">
                Gửi tin nhắn
                <ArrowRight className="h-4 w-4 ml-2" />
            </button>
        </form>
    );
}
