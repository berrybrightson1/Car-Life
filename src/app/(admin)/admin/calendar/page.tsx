"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Ship, Users, CheckCircle } from "lucide-react";
import { MockDB, CalendarEvent } from "@/lib/mock-db";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const events = MockDB.getEvents();

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getEventsForDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };

    const EventBadge = ({ event }: { event: CalendarEvent }) => {
        const styles = {
            shipment: "bg-blue-100 text-blue-700 border-blue-200",
            meeting: "bg-orange-100 text-orange-700 border-orange-200",
            sale: "bg-green-100 text-green-700 border-green-200"
        };

        const icons = {
            shipment: Ship,
            meeting: Users,
            sale: CheckCircle
        };

        const Icon = icons[event.type];

        return (
            <div className={`text-[10px] px-2 py-1 rounded-md border truncate font-medium flex items-center gap-1 mb-1 ${styles[event.type]}`}>
                <Icon size={10} />
                <span className="truncate">{event.title}</span>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Calendar</h1>
                    <p className="text-gray-500">Schedule of shipments, appointments, and sales.</p>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" aria-label="Previous Month">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-lg font-bold min-w-[140px] text-center">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" aria-label="Next Month">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                    {DAYS.map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-[120px] md:auto-rows-[160px] divide-x divide-gray-100 border-b border-gray-100">
                    {/* Empty cells for prev month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-gray-50/20" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = getEventsForDay(day);
                        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

                        return (
                            <div key={day} className={`p-2 transition-colors hover:bg-blue-50/10 group ${isToday ? 'bg-blue-50/30' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-700'
                                        }`}>
                                        {day}
                                    </span>
                                    {isToday && <span className="text-[10px] font-bold text-blue-600 px-2 py-0.5 bg-blue-100 rounded-full">Today</span>}
                                </div>

                                <div className="space-y-1 overflow-y-auto max-h-[80px] md:max-h-[110px] no-scrollbar">
                                    {dayEvents.map(event => (
                                        <EventBadge key={event.id} event={event} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upcoming List (Mobile Optimized) */}
            <div className="mt-8 md:hidden">
                <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                    {MockDB.getEvents().map(event => (
                        <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.type === 'shipment' ? 'bg-blue-100 text-blue-600' :
                                event.type === 'meeting' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                }`}>
                                {event.type === 'shipment' ? <Ship size={18} /> :
                                    event.type === 'meeting' ? <Users size={18} /> : <CheckCircle size={18} />}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-gray-900">{event.title}</div>
                                <div className="text-xs text-gray-500">{event.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
