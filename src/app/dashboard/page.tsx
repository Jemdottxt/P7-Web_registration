"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken, logoutUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { API_BASE } from "@/lib/config";

interface Position {
  position_id?: number;
  position_code: string;
  position_name: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPositions();
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  async function fetchPositions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/positions`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setPositions(data);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Position = {
      position_code: positionCode.trim(),
      position_name: positionName.trim(),
    };

    try {
      let res: Response;
      if (editingId != null) {
        res = await fetch(`${API_BASE}/positions/${editingId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/positions`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Request failed: ${res.status}`);
      }

      setPositionCode("");
      setPositionName("");
      setEditingId(null);
      await fetchPositions();
    } catch (e: any) {
      setError(e?.message || "Save failed");
    }
  }

  function startEdit(p: Position) {
    setEditingId(p.position_id ?? null);
    setPositionCode(p.position_code);
    setPositionName(p.position_name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this work?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/positions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      await fetchPositions();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setPositionCode("");
    setPositionName("");
  }

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-indigo-300 pb-4">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wide">
            TO-DO Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => fetchPositions()}>
              Refresh
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <Card className="mb-8 shadow-lg border border-indigo-200">
          <CardContent>
            <h2 className="text-xl font-semibold text-indigo-800 mb-5">
              {editingId ? "Edit Task" : "Create a new task"}
            </h2>
            <form
              onSubmit={handleCreateOrUpdate}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <Input
                placeholder="Task Title"
                value={positionCode}
                onChange={(e) =>
                  setPositionCode((e.target as HTMLInputElement).value)
                }
                required
                className="border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={10}
              />
              <Input
                placeholder="Task Description"
                value={positionName}
                onChange={(e) =>
                  setPositionName((e.target as HTMLInputElement).value)
                }
                required
                className="border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={50}
              />
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update" : "Create"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
            {error && (
              <p className="text-red-600 mt-3 font-medium select-none">{error}</p>
            )}
          </CardContent>
        </Card>

        <section>
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            Tasks {" "}
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
          </h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-indigo-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-indigo-100 text-indigo-700 font-semibold">
                <tr>
                  <th className="px-6 py-3 border-b border-indigo-300">Title</th>
                  <th className="px-6 py-3 border-b border-indigo-300">Description</th>
                  <th className="px-6 py-3 border-b border-indigo-300 w-36 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-5 text-center text-sm text-indigo-400"
                    >
                      No work found.
                    </td>
                  </tr>
                )}
                {positions.map((p) => (
                  <tr
                    key={p.position_id}
                    className="border-b border-indigo-200 hover:bg-indigo-50 transition"
                  >
                    <td className="px-6 py-4 align-middle font-mono text-indigo-900">
                      {p.position_code}
                    </td>
                    <td className="px-6 py-4 align-middle text-indigo-900">
                      {p.position_name}
                    </td>
                    <td className="px-6 py-4 align-middle text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(p.position_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}