import { useEffect, useState } from "react";
import { CalendarCheck, Clock, User, Phone, Globe2, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Booking = {
  id: string;
  full_name: string;
  phone: string | null;
  country: string | null;
  slot_time: string;
  slot_date: string;
  notes: string | null;
};

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatToday = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Mask phone like 98xxxxxx21
const maskPhone = (p: string | null) => {
  if (!p) return "—";
  const digits = p.replace(/\D/g, "");
  if (digits.length < 4) return "•••";
  return digits.slice(0, 2) + "x".repeat(Math.max(digits.length - 4, 2)) + digits.slice(-2);
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

export function TodaysMeetings() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("id, full_name, phone, country, slot_time, slot_date, notes")
        .eq("slot_date", todayISO())
        .order("slot_time", { ascending: true });
      setRows((data as Booking[]) ?? []);
      setLoading(false);
    };
    load();

    // Realtime updates
    const channel = supabase
      .channel("todays-meetings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const b = payload.new as Booking;
          if (b.slot_date === todayISO()) {
            setRows((prev) =>
              [...prev, b].sort((a, z) => a.slot_time.localeCompare(z.slot_time))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="todays-meetings" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <CalendarCheck className="w-4 h-4" />
            Live Schedule
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">Today's Meetings</h2>
          <p className="text-muted-foreground">
            {formatToday()} · {rows.length} {rows.length === 1 ? "student" : "students"} booked
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed bg-card/50">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-semibold">No meetings scheduled for today</p>
            <p className="text-muted-foreground mt-1">
              Book a free counseling slot below to get started.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((b) => (
              <div
                key={b.id}
                className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />

                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    {initials(b.full_name) || <User className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-lg truncate">{b.full_name}</p>
                    <div className="flex items-center gap-1.5 text-primary font-medium text-sm mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {b.slot_time}
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  {b.country && (
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{b.country}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{maskPhone(b.phone)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
