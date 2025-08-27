
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Phone, MessageSquare, Ambulance, Stethoscope } from "lucide-react";
import Link from 'next/link';
import { CONTACT_DATA } from '@/lib/config';

const allSymptoms = [
    { text: "¿Tenés dolor de pecho?", isUrgent: true },
    { text: "¿Tenés dificultad para respirar?", isUrgent: true },
    { text: "¿Alguien se desmayó o perdió la conciencia?", isUrgent: true },
    { text: "¿Sufriste o estás en presencia de un accidente de tránsito o doméstico?", isUrgent: true },
    { text: "¿Tenés dolor abdominal leve o diarrea?", isUrgent: false },
    { text: "¿Tenés dolor leve de más de una semana de evolución?", isUrgent: false },
];

const emergencyPhoneNumber = CONTACT_DATA.ambulance.phone;
const smsRecipientNumber = CONTACT_DATA.samco.whatsapp;

type ResultType = 'urgent' | 'non-urgent' | null;

export function EvaluationClient() {
    const [result, setResult] = useState<ResultType>(null);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const handleSymptomClick = (isUrgent: boolean) => {
        if (isUrgent) {
            setResult('urgent');
        } else {
            setResult('non-urgent');
        }
    };

    useEffect(() => {
        if (result === 'urgent') {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setLocationError(null);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationError("No se pudo obtener la ubicación. Por favor, actívela en su dispositivo.");
                }
            );
        }
    }, [result]);
    
    const restart = () => {
        setResult(null);
        setLocation(null);
        setLocationError(null);
    }

    if (result) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Resultado de la Evaluación</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {result === 'urgent' && (
                            <>
                                <AlertTriangle className="w-16 h-16 mx-auto text-primary mb-4" />
                                <CardDescription className="text-lg mb-4">
                                    Parece ser una emergencia. Por favor, actúe de inmediato.
                                </CardDescription>
                                {locationError && <p className="text-destructive text-sm mb-4">{locationError}</p>}
                                <div className="flex flex-col gap-4">
                                    <a href={`tel:${emergencyPhoneNumber}`} className="w-full">
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90"><Phone className="mr-2"/> Llamar Ambulancia ({emergencyPhoneNumber})</Button>
                                    </a>
                                    {location && (
                                     <a href={`sms:${smsRecipientNumber}?body=Necesito ayuda. Mi ubicación es: https://www.google.com/maps?q=${location.latitude},${location.longitude}`} className="w-full">
                                        <Button size="lg" variant="secondary" className="w-full"><MessageSquare className="mr-2"/> Compartir Ubicación por SMS</Button>
                                     </a>
                                    )}
                                </div>
                            </>
                        )}
                        {result === 'non-urgent' && (
                            <>
                                <Stethoscope className="w-16 h-16 mx-auto text-accent mb-4" />
                                <CardDescription className="text-lg mb-4">
                                    Parece que no es una urgencia médica grave. Le recomendamos:
                                </CardDescription>
                                <div className="flex flex-col gap-4">
                                    <Link href="/centros" passHref>
                                        <Button size="lg" variant="secondary" className="w-full">Ver centros de atención / turnos</Button>
                                    </Link>
                                    <a href={`tel:${emergencyPhoneNumber}`} className="w-full">
                                        <Button size="lg" className="w-full"><Phone className="mr-2"/> Llamar a la ambulancia ({emergencyPhoneNumber})</Button>
                                    </a>
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                         <Button variant="link" onClick={restart} className="w-full">Comenzar de nuevo</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-primary mb-2" />
            <h1 className="text-2xl font-bold mb-1">Auto Evaluación Rápida</h1>
            <p className="text-muted-foreground mb-6">Seleccioná la opción que mejor describe tu situación</p>
            <div className="space-y-3 text-left">
                {allSymptoms.map((symptom, index) => (
                    <button
                        key={index}
                        onClick={() => handleSymptomClick(symptom.isUrgent)}
                        className={`w-full p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-200 border-l-4 ${symptom.isUrgent ? 'border-primary bg-card hover:bg-red-50/50' : 'border-gray-300 bg-card hover:bg-gray-50/50'}`}
                    >
                        <div className="flex items-center">
                            <span className={`font-bold mr-3 ${symptom.isUrgent ? 'text-primary' : 'text-blue-500'}`}>{index + 1}.</span>
                            <span className="font-medium">{symptom.text}</span>
                        </div>
                        {symptom.isUrgent && <Ambulance className="w-5 h-5 text-primary" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
