
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Phone, MessageSquare, Ambulance, Stethoscope, MessageCircle, MapPin, Loader2, LocateFixed } from "lucide-react";
import Link from 'next/link';
import type { ContactData } from '@/lib/config';
import { getDistance } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const allSymptoms = [
    { text: "¿Tenés Dolor de pecho?", isUrgent: true },
    { text: "¿Tenés dificultad para respirar?", isUrgent: true },
    { text: "¿Alguien se desmayó o perdió la conciencia?", isUrgent: true },
    { text: "¿Sufriste o estás en presencia de un accidente de tránsito o doméstico?", isUrgent: true },
    { text: "¿Tenés dolor abdominal leve o diarrea?", isUrgent: false },
    { text: "¿Tenés dolor leve de más de una semana de evolución?", isUrgent: false },
    { text: "¿Tenés tos, resfrío o dolor de garganta?", isUrgent: false },
];

type EvaluationClientProps = {
  contactData: ContactData;
};

type GeolocationStatus = 'pending' | 'loading' | 'success' | 'denied' | 'unsupported' | 'error' | 'outside';

export function EvaluationClient({ contactData }: EvaluationClientProps) {
    const [result, setResult] = useState<'urgent' | 'non-urgent' | null>(null);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('pending');
    
    const emergencyPhoneNumber = contactData.ambulance.phone;
    const smsRecipientNumber = contactData.samco.whatsapp;
    const whatsappTurnosNumber = contactData.samco.whatsapp;
    const centerPoint = contactData.geofence.center;
    const radiusKm = contactData.geofence.radiusKm;

    const checkLocation = () => {
        setGeoStatus('loading');
        if (!navigator.geolocation) {
            setGeoStatus('unsupported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const distance = getDistance(
                    { lat: latitude, lon: longitude },
                    { lat: centerPoint.lat, lon: centerPoint.lon }
                );

                if (distance <= radiusKm) {
                    setLocation({ latitude, longitude });
                    setGeoStatus('success');
                } else {
                    setGeoStatus('outside');
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setGeoStatus('denied');
                } else {
                    setGeoStatus('error');
                }
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    useEffect(() => {
       checkLocation();
    }, []);

    const handleSymptomClick = (isUrgent: boolean) => {
        setResult(isUrgent ? 'urgent' : 'non-urgent');
    };
    
    const restart = () => {
        setResult(null);
        checkLocation();
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
                                    Parece que no es una urgencia. Le recomendamos:
                                </CardDescription>
                                <div className="flex flex-col gap-4">
                                    <a href={`https://wa.me/${whatsappTurnosNumber}`} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button size="lg" variant="secondary" className="w-full"><MessageCircle className="mr-2"/>Pedir turno por WhatsApp</Button>
                                    </a>
                                    <Link href="/centros" passHref>
                                        <Button size="lg" variant="outline" className="w-full"><MapPin className="mr-2"/>Ver otros centros útiles</Button>
                                    </Link>
                                    <a href={`tel:${emergencyPhoneNumber}`} className="w-full">
                                        <Button size="lg" className="w-full"><Phone className="mr-2"/> Llamar de todas formas a ambulancia</Button>
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
    
    if (geoStatus === 'loading' || geoStatus === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                 <Loader2 className="w-16 h-16 text-primary animate-spin" />
                 <p className="text-lg font-medium text-muted-foreground">Verificando tu ubicación...</p>
                 <p className="text-sm text-muted-foreground">Esta función solo está disponible en el área de cobertura.</p>
            </div>
        )
    }

    if (geoStatus !== 'success') {
       return (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                <AlertTriangle className="w-16 h-16 text-destructive" />
                <h2 className="text-xl font-bold">Función no disponible</h2>
                {geoStatus === 'outside' && <p className="text-muted-foreground">Te encuentras fuera del área de cobertura de {radiusKm} km para esta función.</p>}
                {geoStatus === 'denied' && <p className="text-muted-foreground">No has dado permiso para acceder a tu ubicación. Es necesaria para usar esta función.</p>}
                {geoStatus === 'unsupported' && <p className="text-muted-foreground">Tu navegador no soporta la geolocalización.</p>}
                {geoStatus === 'error' && <p className="text-muted-foreground">No se pudo obtener tu ubicación. Revisa la configuración de tu dispositivo.</p>}
                <Button onClick={checkLocation}>
                    <LocateFixed className="mr-2" />
                    Reintentar
                </Button>
            </div>
       )
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
