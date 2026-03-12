"use client";

import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import { use, useEffect, useState } from "react";
import { User, TeamResponse } from "@/constants/types";
import { useRouter } from "next/navigation";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  const router = useRouter();

  const { logout, status, user: currentUser } = useAuth();

  const [userData, setUserData] = useState<User | null>(null);
  const [teamData, setTeamData] = useState<TeamResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const isOwnProfile = currentUser?.id == userId;
  const isAdmin = currentUser?.role === "ADMIN";

  const canEdit = isOwnProfile || isAdmin;

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

  useEffect(() => {
    if (status === "unauthenticated") return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?id=${userId}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) setUserData(data);
      } catch (err) {
        console.error("Greška pri učitavanju korisnika:", err);
      }
    };

    fetchUser();
  }, [userId, status]);

  useEffect(() => {
    if (!userData?.teamId) {
      setTeamData(null);
      return;
    }

    const fetchTeam = async () => {
      try {
        const res = await fetch(`/api/team?id=${userData.teamId}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) setTeamData(data);
      } catch (err) {
        console.error("Greška pri učitavanju tima:", err);
      }
    };

    fetchTeam();
  }, [userData?.teamId]);

  useEffect(() => {
    if (!userData) return;

    setFormData({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
  }, [userData]);

  const handleDeleteProfile = async () => {
    if (!confirm("Da li ste sigurni da želite da obrišete profil?")) return;

  setIsDeleting(true);

  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Greška pri brisanju profila");
      return;
    }

    if (data.loggedOut) {
      logout(); 
      router.push("/login");
    } else {
      alert("Profil uspešno obrisan.");
      router.push(`/profile/${currentUser?.id}`);
    }
  } catch (err) {
    console.error(err);
    alert("Greška pri brisanju profila");
  } finally {
    setIsDeleting(false);
  }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Greška pri izmeni");
        return;
      }

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              name: formData.name,
              email: formData.email,
              role: formData.role || prev.role,
            }
          : prev,
      );

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Greška pri izmeni");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || !userData) {
    return (
      <div className="h-screen py-30 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-white rounded-full mx-auto mb-4"></div>
          <p>Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 pb-10 border-b border-slate-700 flex flex-col lg:flex-row gap-6">
          <img
            src={avatarUrl}
            className="w-20 h-20 rounded-full ring-4 ring-blue-500/70"
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {userData.name}
            </h1>

            <p className="text-slate-300 mb-3">{userData.email}</p>

            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-sm">
                {userData.role}
              </span>

              {userData.captain && (
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-sm">
                  Kapiten
                </span>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-10">
              <Button label="Odjavi se" onClick={logout} />
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/5 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Osnovne informacije
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">ID</p>
                <p className="text-white font-mono break-all">{userData.id}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Uloga</p>
                <p className="text-white">{userData.role}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Član od</p>
                <p className="text-white">
                  {new Date(userData.createdAt).toLocaleDateString("sr-RS")}
                </p>
              </div>
            </div>
          </div>

          {teamData ? (
            <div className="bg-white/5 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Tim</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Naziv</p>
                  <p className="text-white text-xl font-semibold">
                    {teamData.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Kapiten</p>
                  <p className="text-white">
                    {teamData.captain?.name || "Nije dodeljen"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Pozicija</p>
                  <p className="text-white">
                    {userData.captain ? "Kapiten" : "Član"}
                  </p>
                </div>

                {isOwnProfile && (
                  <Button
                    label="Pregledaj tim"
                    onClick={() =>
                      (window.location.href = `/team/${teamData.id}`)
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Tim</h3>

              <p className="text-slate-300 mb-4">Nije član nijednog tima</p>

              {isOwnProfile && (
                <Button
                  label="Pogledajte timove"
                  onClick={() => (window.location.href = "/team")}
                />
              )}
            </div>
          )}

          {canEdit && (
            <div className="bg-white/5 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Nalog</h3>

              <div className="flex flex-col gap-8">
                <Button
                  label="Izmeni nalog"
                  onClick={() => setIsEditing(true)}
                />

                <Button
                  label="Obriši nalog"
                  delete={true}
                  onClick={handleDeleteProfile}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Izmena profila
            </h2>

            <div className="flex flex-col gap-4">
              <input
                className="bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ime"
              />

              <input
                className="bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
              />

              {isAdmin && (
                <select
                  className="bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="PLAYER">Igrač</option>
                  <option value="ORGANIZER">Organizator</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                label={isSaving ? "Čuva se..." : "Sačuvaj"}
                onClick={handleUpdateProfile}
              />

              <Button label="Otkaži" onClick={() => setIsEditing(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
