"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { HeartPulse, Wind, AlertTriangle, Home, Stethoscope, Activity, Mic, Phone, MessageSquare } from "lucide-react";
import Link from 'next/link';

const questions = [
    { text: "¿Tenés Dolor de pecho?", icon: HeartPulse, type: 'urgent' },
    { text: "¿Tenés dificultad para respirar?", icon: Wind, type: 'urgent' },
    { text: "¿Alguien se desmayó o perdió la conciencia?", icon: AlertTriangle, type: 'urgent' },
    { text: "¿Sufriste o estás en presencia de un accidente de tránsito o doméstico?", icon: Home, type: 'urgent' },
    { text: "¿Tenés dolor abdominal leve o diarrea?", icon: Stethoscope, type: 'non-urgent' },
    { text: "¿Tenés dolor leve de más de una semana de evolución?", icon: Activity, type: 'non-urgent' },
    { text: "¿Tenés tos, resfrío o dolor de garganta?", icon: Mic, type: 'non-urgent' },
];

type ResultType = 'urgent' | 'non-urgent' | null;

export function EvaluationClient() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [result, setResult] = useState<ResultType>(null);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const handleAnswer = (answer: boolean) => {
        if (answer) {
            setResult(questions[currentQuestionIndex].type);
        } else {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // All questions answered with "No", maybe suggest going to a care center
                setResult('non-urgent');
            }
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
                    setLocationError("No se pudo obtener la ubicación. Por favor, actívela en su dispositivo.");
                }
            );
        }
    }, [result]);
    
    const restart = () => {
        setCurrentQuestionIndex(0);
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
                                    <a href="tel:462111" className="w-full">
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90"><Phone className="mr-2"/> Llamar al 462111</Button>
                                    </a>
                                    {location && (
                                     <a href={`sms:462111?body=Necesito ayuda. Mi ubicación es: https://www.google.com/maps?q=${location.latitude},${location.longitude}`} className="w-full">
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
                                    <a href="tel:462111" className="w-full">
                                        <Button size="lg" className="w-full"><Phone className="mr-2"/> Llamar a la ambulancia de todas formas</Button>
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

    const CurrentIcon = questions[currentQuestionIndex].icon;

    return (
        <div className="p-4 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-lg shadow-xl text-center">
                <CardHeader>
                    <CurrentIcon className="w-16 h-16 mx-auto text-accent mb-4" />
                    <CardTitle className="text-2xl leading-tight">
                        {questions[currentQuestionIndex].text}
                    </CardTitle>
                    <CardDescription>Pregunta {currentQuestionIndex + 1} de {questions.length}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                    <Button variant="default" size="lg" onClick={() => handleAnswer(true)} className="w-32 bg-primary hover:bg-primary/90">Sí</Button>
                    <Button variant="secondary" size="lg" onClick={() => handleAnswer(false)} className="w-32">No</Button>
                </CardContent>
            </Card>
        </div>
    );
}
