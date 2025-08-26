
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { HeartPulse, Wind, AlertTriangle, Home, Stethoscope, Activity, Mic, Phone, MessageSquare, ChevronRight } from "lucide-react";
import Link from 'next/link';

const urgentSymptoms = [
    { text: "Dolor de pecho", icon: HeartPulse },
    { text: "Dificultad para respirar", icon: Wind },
    { text: "Pérdida de conciencia o desmayo", icon: AlertTriangle },
    { text: "Accidente de tránsito o doméstico", icon: Home },
];

const nonUrgentSymptoms = [
    { text: "Dolor abdominal leve o diarrea", icon: Stethoscope },
    { text: "Dolor leve de más de una semana", icon: Activity },
    { text: "Tos, resfrío o dolor de garganta", icon: Mic },
]

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
    
    const handleNonUrgentConfirmation = () => {
        setResult('non-urgent');
    }

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
                                    <a href="tel:107" className="w-full">
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90"><Phone className="mr-2"/> Llamar Ambulancia (107)</Button>
                                    </a>
                                    {location && (
                                     <a href={`sms:?body=Necesito ayuda. Mi ubicación es: https://www.google.com/maps?q=${location.latitude},${location.longitude}`} className="w-full">
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
                                    <a href="tel:107" className="w-full">
                                        <Button size="lg" className="w-full"><Phone className="mr-2"/> Llamar a la ambulancia (107)</Button>
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
        <div className="p-4 md:p-6">
             <Card className="mb-6">
                <CardHeader>
                    <CardTitle>¿Es una emergencia?</CardTitle>
                    <CardDescription>Si presenta alguno de estos síntomas, seleccione para continuar.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col">
                        {urgentSymptoms.map((symptom) => {
                            const Icon = symptom.icon;
                            return (
                                <button key={symptom.text} onClick={() => handleSymptomClick(true)} className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-accent/10 transition-colors duration-200 -mx-4 px-4 text-left w-full">
                                    <div className="flex items-center">
                                        <Icon className="w-6 h-6 mr-4 text-primary" />
                                        <span className="text-lg font-medium">{symptom.text}</span>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>¿No es una emergencia?</CardTitle>
                    <CardDescription>Si sus síntomas son leves o no son urgentes, puede buscar atención programada.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="flex flex-col">
                        {nonUrgentSymptoms.map((symptom) => {
                             const Icon = symptom.icon;
                            return (
                                 <div key={symptom.text} className="flex items-center justify-between py-3 border-b last:border-b-0 -mx-4 px-4">
                                    <div className="flex items-center">
                                         <Icon className="w-6 h-6 mr-4 text-accent" />
                                        <span className="text-lg font-medium">{symptom.text}</span>
                                    </div>
                                </div>
                            )
                        })}
                   </div>
                   <div className="p-6">
                     <Button onClick={handleNonUrgentConfirmation} size="lg" variant="secondary" className="w-full">No es urgente, mostrar opciones</Button>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
