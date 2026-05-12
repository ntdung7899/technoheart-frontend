"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/api/auth";
import {
  updateAccountProfile,
  changeAccountPassword,
  type UserProfile,
} from "@/lib/api/account";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPwSection, setShowPwSection] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          window.location.href = "/login";
          return;
        }

        if (mounted) {
          setUser({
            id: currentUser.id,
            name: currentUser.name || currentUser.full_name || null,
            email: currentUser.email,
            phone: currentUser.phone || null,
            avatar: (currentUser as any).avatar || null,
          });
        }
      } catch (error) {
        console.error("LOAD_PROFILE_ERROR:", error);
        if (mounted) {
          setError("Không tải được thông tin hồ sơ");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await updateAccountProfile({
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      });

      setMessage("Cập nhật hồ sơ thành công!");
      setUser(updatedUser);
    } catch (error) {
      console.error("UPDATE_PROFILE_ERROR:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật hồ sơ"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwMsg("");
    setPwErr("");

    if (!passwords.currentPassword) {
      setPwErr("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      setPwErr("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwErr("Mật khẩu xác nhận không khớp");
      return;
    }

    setPwLoading(true);

    try {
      await changeAccountPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setPwMsg("Đổi mật khẩu thành công!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("CHANGE_PASSWORD_ERROR:", error);
      setPwErr(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi đổi mật khẩu"
      );
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">Hồ sơ</h1>

      <div className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-5">
        {message && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm text-green-600">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-muted-foreground text-2xl font-bold overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                width={64}
                height={64}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          <div>
            <p className="text-sm font-bold">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Họ và tên
          </label>

          <input
            type="text"
            value={user?.name || ""}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, name: event.target.value } : current
              )
            }
            className="h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </label>

          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="h-11 w-full rounded-xl border border-border/50 bg-secondary/20 px-4 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Số điện thoại
          </label>

          <input
            type="tel"
            value={user?.phone || ""}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, phone: event.target.value } : current
              )
            }
            placeholder="0123 456 789"
            className="h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            URL ảnh đại diện
          </label>

          <input
            type="url"
            value={user?.avatar || ""}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, avatar: event.target.value } : current
              )
            }
            placeholder="https://example.com/avatar.jpg"
            className="h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu thay đổi
        </button>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
        <button
          type="button"
          onClick={() => setShowPwSection(!showPwSection)}
          className="flex items-center gap-2 text-sm font-bold"
        >
          <Lock className="h-4 w-4" />
          Đổi mật khẩu
        </button>

        {showPwSection && (
          <div className="space-y-4 pt-2">
            {pwMsg && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm text-green-600">
                {pwMsg}
              </div>
            )}

            {pwErr && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
                {pwErr}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mật khẩu hiện tại
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mật khẩu mới
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    newPassword: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Xác nhận mật khẩu mới
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {pwLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Đổi mật khẩu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}